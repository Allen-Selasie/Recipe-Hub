document.addEventListener("DOMContentLoaded", function () {

    // Example of toggling visibility of extra content
    const extraContentSection = document.querySelector('.extra-content');
    const ctaButton = document.querySelector('.cta-button');

    ctaButton.addEventListener('click', function (e) {
        e.preventDefault();
        // Toggle the visibility of extra content
        if (extraContentSection.style.display === "none" || extraContentSection.style.display === "") {
            extraContentSection.style.display = "grid";
            ctaButton.textContent = "Show Less";
        } else {
            extraContentSection.style.display = "none";
            ctaButton.textContent = "Get Started";
        }
    });

    // Handle login and sign up button clicks
    const loginButton = document.querySelectorAll('.auth-button')[0];
    const signupButton = document.querySelectorAll('.auth-button')[1];

    loginButton.addEventListener('click', function () {
        alert('Login functionality not yet implemented.');
    });

    signupButton.addEventListener('click', function () {
        alert('Sign-up functionality not yet implemented.');
    });

    // Example for handling hover effect on recipe cards (if needed)
    const recipeCards = document.querySelectorAll('.recipe-card');

    recipeCards.forEach(function (card) {
        card.addEventListener('mouseover', function () {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });

        card.addEventListener('mouseout', function () {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });
    });

    // Handle the social media icon clicks
    const socialMediaLinks = document.querySelectorAll('.social-media a');

    socialMediaLinks.forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            alert('This would open the social media page.');
        });
    });
});
