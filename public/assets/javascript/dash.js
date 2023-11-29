document.addEventListener('DOMContentLoaded', (event) => {
    dropdown('myWorldsMenu');
    const searchBar = document.getElementById('searchBar');
    searchBar.addEventListener('input', search);
    searchBar.addEventListener('keydown', (event) => {
        if (event.keyCode === 8) { // backspace key
            search(event);
        }
    });
})
  
  function dropdown(id) {
    document.getElementById(id).classList.toggle("show");
    var dropdown = document.getElementById(id); // Get the <select> element
    fetch('/myWorlds').then((response) => {
      if (response.ok) {
        return response.json();
      }
    }).then(worlds => {
      worlds.forEach(world => {
        var option = document.createElement("option");
        option.appendChild(document.createTextNode(world.worldName));
        option.value =  "./viewing/viewMainPage.html?id=" + world.id;
        dropdown.appendChild(option); // Append the <option> to the <select>
      });
    });
  }

function search(event) {
    const query = event.target.value;
    const dropdown = document.getElementById('searchResultsMenu');
    if (query === '') {
        dropdown.classList.remove('show');
        return;
    }
    fetch('/search?query=' + encodeURIComponent(query))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(worlds => {
            dropdown.innerHTML = ''; // Clear the dropdown menu
            if (worlds.length > 0) {
                dropdown.size = worlds.length; // Make all options visible
            } else {
                dropdown.size = 1; // Reset size if no options
            }
            worlds.forEach(world => {
                var option = document.createElement("option");
                // option.appendChild(document.createTextNode(world.worldName));
                // link.href =
                dropdown.appendChild(option); // Append the <option> to the <select>
            });
            dropdown.classList.add('show');
        });
}

function loadWorld(option){
  location.assign(option.value);
}

