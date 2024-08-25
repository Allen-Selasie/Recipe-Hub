document.addEventListener('DOMContentLoaded', function () {
    const recipeForm = document.getElementById('recipeForm');
    const recipeList = document.getElementById('recipeList');
    const recipeTemplate = document.getElementById('recipeTemplate').content;

    recipeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const formData = new FormData(recipeForm);
        const recipeItem = document.importNode(recipeTemplate, true);

        recipeItem.querySelector('.recipe-title').textContent = formData.get('title');
        recipeItem.querySelector('.recipe-ingredients').textContent = formData.get('ingredients');
        recipeItem.querySelector('.recipe-instructions').textContent = formData.get('instructions');
        recipeItem.querySelector('.recipe-prepTime').textContent = formData.get('prepTime');
        recipeItem.querySelector('.recipe-difficulty').textContent = formData.get('difficulty');
        recipeItem.querySelector('.recipe-tags').textContent = formData.get('tags');

        const mediaContainer = recipeItem.querySelector('.recipe-media');
        const mediaFiles = formData.getAll('media');
        mediaFiles.forEach(file => {
            const fileURL = URL.createObjectURL(file);
            let mediaElement;

            if (file.type.startsWith('image/')) {
                mediaElement = document.createElement('img');
                mediaElement.src = fileURL;
            } else if (file.type.startsWith('video/')) {
                mediaElement = document.createElement('video');
                mediaElement.src = fileURL;
                mediaElement.controls = true;
            }

            mediaContainer.appendChild(mediaElement);
        });

        recipeList.appendChild(recipeItem);

        recipeForm.reset();
    });

    recipeList.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-recipe')) {
            e.target.closest('.recipe-item').remove();
        } else if (e.target.classList.contains('submit-review')) {
            const reviewTextarea = e.target.closest('.rating-review').querySelector('.review');
            const rating = e.target.closest('.rating-review').querySelector('.rating').value;
            const reviewText = reviewTextarea.value;
            const reviewsList = e.target.closest('.recipe-item').querySelector} 
    }   )
}  )        
