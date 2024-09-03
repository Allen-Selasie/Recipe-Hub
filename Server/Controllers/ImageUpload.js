const axios = require('axios');
const FormData = require('form-data');

const uploadImage = async (files) => {
    if (!files || (Array.isArray(files) && files.length === 0)) {
        throw new Error('No file uploaded');
    }

    const filesArray = Array.isArray(files) ? files : [files]; // Ensure files is always an array
    const uploadPromises = filesArray.map(async (file) => {
        const form = new FormData();
        form.append('key', '6d207e02198a847aa98d0a2a901485a5');
        form.append('action', 'upload');
        form.append('source', file.buffer, file.originalname);
        form.append('format', 'json');

        const response = await axios.post('https://freeimage.host/api/1/upload', form, {
            headers: form.getHeaders()
        });

        if (response.data.status_code !== 200) {
            throw new Error('Image upload failed');
        }

        return response.data.image.url;
    });

    // Wait for all uploads to finish and return the array of URLs
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
};

module.exports = uploadImage;
