document.getElementById('recipeForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent traditional form submission
    document.getElementById('recipeUp').disabled = true; // Disable the submit button
    const formData = new FormData();

    // Collecting form data
    formData.append('title', document.getElementById('title').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('category', document.getElementById('categories').value);
    formData.append('ingredients', document.getElementById('ingredients').value);
    formData.append('instructions', document.getElementById('instructions').value);

    // Combine prep time into one string
    const prepTime = `${document.getElementById('prepHours').value} hours ${document.getElementById('prepMinutes').value} minutes`;
    formData.append('time', prepTime);

    formData.append('difficulty', document.getElementById('difficulty').value);

    // Collecting and appending files
    const mediaFiles = document.getElementById('media').files;
    for (let i = 0; i < mediaFiles.length; i++) {
        formData.append('file', mediaFiles[i]);
    }

    // Debugging: Log the form data (not possible with FormData directly, but for files count)
    console.log('Files:', mediaFiles.length);

    // Sending the form data via fetch
    fetch('/u/add-recipe', {
        method: 'POST',
        body: formData // FormData is automatically set to 'multipart/form-data'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        if (data.success) {
            alert('Recipe added successfully!');
            location.reload();
        } else {
            alert('An error occurred. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
