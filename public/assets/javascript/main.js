window.addEventListener("DOMContentLoaded", (event) => {
  const loginBtn = document.getElementById("loginBtn");
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", search);
  searchBar.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      // backspace key
      search(event);
    }
  });

  loginBtn.addEventListener("click", () => {
    showLogin();

  });
});

function search(event) {
  const query = event.target.value;
  const dropdown = document.getElementById("searchResultsMenu");
  if (query === "") {
    dropdown.classList.remove("show");
    return;
  }
  fetch("/search?query=" + encodeURIComponent(query))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((worlds) => {
      Array.from(dropdown).forEach((option) => {
        if (option.value != "Search Results") {
          option.remove();
        }
      });
      if (worlds.length > 0) {
        dropdown.size = worlds.length; // Make all options visible
      } else {
        dropdown.size = 1; // Reset size if no options
      }
      worlds.forEach((world) => {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(world.worldName));
        option.value = "./viewing/viewMainPage.html?id=" + world.id;
        dropdown.appendChild(option); // Append the <option> to the <select>
      });
      dropdown.classList.add("show");
    });

  // Listen for the change event on the dropdown
  dropdown.addEventListener('change', function() {
    // Navigate to the selected option's value
    window.location.href = this.value;
  });
}

function loadWorld(option) {
  location.assign(option.value);
}

function showLogin() {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementsByClassName("search")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "none";
  document.getElementsByClassName("login")[0].style.display = "block";
}

function showCreateAccount() {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementsByClassName("search")[0].style.display = "none";
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "block";
}
function showSearch(){
  document.getElementById("loginBtn").style.display = "block";
  document.getElementsByClassName("search")[0].style.display = "block";
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "none";
}
