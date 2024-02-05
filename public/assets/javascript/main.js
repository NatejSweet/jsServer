window.addEventListener("DOMContentLoaded", (event) => {
  const loginBtn = document.getElementById("loginBtn");
  const searchBar = document.getElementById("searchBar");

  searchBar.addEventListener("input", search);
  searchBar.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      // backspace key
      if (searchBar.value.length <= 1) {
        const searchResultsDiv = document.getElementById("searchResults");
        searchResultsDiv.innerHTML = ""; // Empty the search results
      } else {
        search(event);
      }
    }
  });

  loginBtn.addEventListener("click", () => {
    showLogin();
  });
});

function search(event) {
  const query = event.target.value;
  const searchResultsDiv = document.getElementById("searchResults");
  fetch("/search?query=" + encodeURIComponent(query))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((worlds) => {
      console.log(worlds);
      Array.from(searchResultsDiv.children).forEach((option) => {
        option.remove();
      });
      console.log(worlds);
      worlds.forEach((world) => {
        var option = document.createElement("button");
        option.appendChild(document.createTextNode(world.worldName));
        option.onclick = function () {
          window.location.href = "./viewing/viewMainPage.html?id=" + world.id;
        };
        console.log(option);
        searchResultsDiv.appendChild(option); // Append the <option> to the <select>
        console.log(searchResultsDiv);
      });
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
function showSearch() {
  document.getElementById("loginBtn").style.display = "block";
  document.getElementsByClassName("search")[0].style.display = "block";
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "none";
}
