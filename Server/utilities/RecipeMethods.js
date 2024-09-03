const Recipe = require('../models/recipe');
const getFeed = async () => {
    try {
        const recipes = await Recipe.aggregate([
            {
                $project: {
                    title: 1,
                    description: 1,
                    image: 1,
                    likes: { $size: "$likes" },
                    comments: { $size: "$comments" },
                    saves: { $size: "$saves" },
                    shares: { $size: "$shares" },
                    rating: "$rating" // Change this line
                }
            }
        ]);

        return recipes;
    } catch (error) {
        console.error('Error fetching feed:', error);
        throw error;
    }
};
