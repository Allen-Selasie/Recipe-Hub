const body = document.querySelector("body"),
      sidebar = body.querySelector(".sidebar"),
      toggle = body.querySelector(".toggle"),
      searchBtn = body.querySelector(".search-box"),
      modeSwitch = body.querySelector(".toggle-switch"),
      modeText = body.querySelector(".mode-text");

      toggle.addEventListener("click", () =>{
        sidebar.classList.toggle("close");
      });

      searchBtn.addEventListener("click",() =>{
        sidebar.classList.remove("close");
      });


      modeSwitch.addEventListener("click", () =>{
        body.classList.toggle("dark");

        if(body.classList.contains("dark")){
            modeText.innerText = "Light Mode"
        } else{
            modeText.innerText = "Dark Mode"
        }
      });
    
   // Function to handle tab switching
function togs(index) {
  // Get all tab content elements
  var tabs = document.querySelectorAll('.tog');

  // Get all tab buttons
  var tabButtons = document.querySelectorAll('.nav ul li');

  // Loop through each tab content and hide them all
  tabs.forEach(function(tab) {
      tab.style.display = 'none';
  });

  // Remove active class from all tab buttons
  tabButtons.forEach(function(button) {
      button.classList.remove('active');
  });

  // Display the selected tab content
  tabs[index].style.display = 'block';

  // Add active class to the selected tab button
  tabButtons[index].classList.add('active');
}

// Initialize the first tab as active
document.addEventListener('DOMContentLoaded', function() {
  togs(0); // Display the first tab by default
});


let bio = document.querySelector('.bio');
function bioText(){
    bio.oldText = bio.innerText;
    bio.innerText = bio.innerText.substring(0,100)+"...";
    bio.innerHTML += "&nbsp;" +`<span onclick='addLength()' id = 'see-more-bio'> See More</span>`;
    bio.original = bio.innerHTML;
}
bioText();

function addLength(){
    bio.innerHTML = bio.oldText;
    bio.innerHTML +="&nbsp;" +`<span onclick='removeLength()' id = 'see-less-bio'> See Less</span>`;
}
function removeLength(){
    bio.innerHTML = bio.original
}


// Function to handle tab switching
function Tabs(tabIndex) {
  // Get all sections
  const sections = document.querySelectorAll('.all-section');

  // Hide all sections
  sections.forEach((section) => {
      section.style.display = 'none';
  });

  // Show the selected section based on the tab index
  sections[tabIndex].style.display = 'block';
}

// Set default visibility (optional)
document.addEventListener('DOMContentLoaded', function () {
  // Initially display the Discover section
  Tabs(0);
});

// Attach event listeners to the sidebar icons
document.querySelector('.bx-home-alt').addEventListener('click', function () {
  window.location.href = "index.html";
});

document.querySelector('.bxs-dish').addEventListener('click', function () {
  Tabs(0); // Show Discover section
});

document.querySelector('.bx-user-circle').addEventListener('click', function () {
  Tabs(1); // Show Profile section
});

document.querySelector('.bx-cog').addEventListener('click', function () {
  Tabs(2); // Show Settings section
});

document.querySelector('.bx-help-circle').addEventListener('click', function () {
  Tabs(3); // Show Help section
});


