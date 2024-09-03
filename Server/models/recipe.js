const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    media: [
        {
            type: String,
            required: true
        }
    ],
    description: {
        type: String,
        required: true
    },
    ingredients: {
        type: String,
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    time: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comment: {
            type: String,
        }
    }],
    shares: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    views: {
        type: Number,
        default: 0
    },
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    rating: {
        type: Number,
        default: 0
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: {
            type: Number,
        }
    }]
}, {
    timestamps: true
});

// Method to calculate average rating
recipeSchema.methods.calculateAverageRating = function () {
    if (this.ratings.length > 0) {
        const totalRatings = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.rating = totalRatings / this.ratings.length;
    } else {
        this.rating = 0;
    }
    return this.save(); // Save the document after updating the rating
};
// Static method to get the feed
recipeSchema.statics.getFeed = async function (userId = null) {
    try {
        // Start with an empty pipeline
        const pipeline = [];

        // Conditionally add the $match stage if userId is provided
        if (userId) {
            pipeline.push({
                $match: { author: new mongoose.Types.ObjectId(userId) }
            });
        }

        // Add the rest of the pipeline stages
        pipeline.push(
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    image: {
                        $arrayElemAt: [
                            "$media", 
                            { $floor: { $multiply: [{ $rand: {} }, { $size: "$media" }] } }
                        ]
                    },
                    recipeId: "$_id",
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" },
                    saves: { $size: "$saves" },
                    shares: { $size: "$shares" },
                    rating: 1,
                    author: "$author.username",
                    time: 1,
                    category: "$category.name",
                    difficulty: 1
                }
            }
        );

        // Run the aggregation pipeline
        const recipes = await this.aggregate(pipeline);
        return recipes;
    } catch (error) {
        console.error('Error fetching feed:', error);
        throw error;
    }
};




recipeSchema.statics.getRecipe = async function (recipeId) {
    try {
        const recipe = await this.aggregate([
            {
                $match: { _id: mongoose.Types.ObjectId(recipeId) }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'comments.user',
                    foreignField: '_id',
                    as: 'commentUsers'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'likes',
                    foreignField: '_id',
                    as: 'likeUsers'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'saves',
                    foreignField: '_id',
                    as: 'saveUsers'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'shares',
                    foreignField: '_id',
                    as: 'shareUsers'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    media: 1,
                    ingredients: 1,
                    instructions: 1,
                    time: 1,
                    difficulty: 1,
                    rating: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    author: {
                        _id: "$author._id",
                        name: "$author.username"
                    },
                    category: {
                        _id: "$category._id",
                        name: "$category.name"
                    },
                    comments: {
                        $map: {
                            input: "$comments",
                            as: "comment",
                            in: {
                                _id: "$$comment._id",
                                user: {
                                    _id: {
                                        $arrayElemAt: [
                                            "$commentUsers._id",
                                            { $indexOfArray: ["$comments.user", "$$comment.user"] }
                                        ]
                                    },
                                    name: {
                                        $arrayElemAt: [
                                            "$commentUsers.username",
                                            { $indexOfArray: ["$comments.user", "$$comment.user"] }
                                        ]
                                    }
                                },
                                comment: "$$comment.comment",
                                createdAt: "$$comment.createdAt"
                            }
                        }
                    },
                    likes: {
                        $map: {
                            input: "$likeUsers",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                name: "$$user.username"
                            }
                        }
                    },
                    saves: {
                        $map: {
                            input: "$saveUsers",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                name: "$$user.username"
                            }
                        }
                    },
                    shares: {
                        $map: {
                            input: "$shareUsers",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                name: "$$user.username"
                            }
                        }
                    }
                }
            }
        ]);

        return recipe.length > 0 ? recipe[0] : null;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        throw error;
    }
};

recipeSchema.methods.addEngagement = async function (engagementType, userId, options = {}) {
    try {
        const validEngagementTypes = ['like', 'share', 'save', 'comment', 'rating'];

        if (!validEngagementTypes.includes(engagementType)) {
            throw new Error('Invalid engagement type');
        }

        const userObjectId = mongoose.Types.ObjectId(userId);

        switch (engagementType) {
            case 'like':
                if (!this.likes.includes(userObjectId)) {
                    this.likes.push(userObjectId);
                }
                break;

            case 'share':
                if (!this.shares.includes(userObjectId)) {
                    this.shares.push(userObjectId);
                }
                break;

            case 'save':
                if (!this.saves.includes(userObjectId)) {
                    this.saves.push(userObjectId);
                }
                break;

            case 'comment':
                if (!options.comment) {
                    throw new Error('Comment is required for commenting');
                }
                this.comments.push({
                    user: userObjectId,
                    comment: options.comment
                });
                break;

            case 'rating':
                if (!options.rating || options.rating < 1 || options.rating > 5) {
                    throw new Error('Rating must be a value between 1 and 5');
                }
                const existingRating = this.ratings.find(r => r.user.equals(userObjectId));
                if (existingRating) {
                    existingRating.rating = options.rating;
                } else {
                    this.ratings.push({
                        user: userObjectId,
                        rating: options.rating
                    });
                }
                // Recalculate average rating
                const totalRatings = this.ratings.reduce((acc, item) => acc + item.rating, 0);
                this.rating = totalRatings / this.ratings.length;
                break;

            default:
                throw new Error('Invalid engagement type');
        }

        await this.save();
        return this;
    } catch (error) {
        console.error('Error adding engagement:', error);
        throw error;
    }
};

// Static method to get featured recipes
recipeSchema.statics.getFeatured = async function () {
    try {
        const featuredRecipes = await this.aggregate([
            { $sample: { size: 5 } }, // Select 5 random recipes
            {
                $lookup: {
                    from: 'users',
                    localField: 'author',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {
                $unwind: '$author'
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'category',
                    foreignField: '_id',
                    as: 'category'
                }
            },
            {
                $unwind: '$category'
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    image: { $arrayElemAt: ["$media", { $floor: { $multiply: [{ $rand: {} }, { $size: "$media" }] } }] },
                    recipeId: "$_id",
                    author: "$author.username",
                    category: "$category.name",
                    difficulty: 1,
                    time: 1
                }
            }
        ]);

        return featuredRecipes;
    } catch (error) {
        console.error('Error fetching featured recipes:', error);
        throw error;
    }
};

recipeSchema.statics.getComments = async function (recipeId) {
    try {
        const recipe = await this.findById(recipeId).populate('comments.user', 'username');
        if (!recipe) {
            throw new Error('Recipe not found');
        }

        const comments = recipe.comments.map(comment => {
            return {
                user: comment.user,
                comment: comment.comment
            };
        });

        return comments;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
}

const Recipe = mongoose.model('Recipe', recipeSchema, 'recipes');

module.exports = Recipe;
