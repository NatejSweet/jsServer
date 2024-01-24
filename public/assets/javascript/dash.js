document.addEventListener("DOMContentLoaded", (event) => {
  dropdown("myWorldsMenu");
  const searchBar = document.getElementById("searchBar");
  searchBar.addEventListener("input", search);
  searchBar.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      // backspace key
      search(event);
    }
  });
});

function dropdown(id) {
  document.getElementById(id).classList.toggle("show");
  var dropdown = document.getElementById(id); // Get the <select> element
  fetch("/myWorlds")
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((worlds) => {
      worlds.forEach((world) => {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(world.worldName));
        option.value = "./viewing/viewMainPage.html?id=" + world.id;
        dropdown.appendChild(option); // Append the <option> to the <select>
      });
    });
}

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
