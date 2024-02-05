function editMapMarkers() {
  let editButtonsDiv = document.getElementById("editButtonsDiv");
  while (editButtonsDiv.hasChildNodes()) {
    editButtonsDiv.removeChild(editButtonsDiv.firstChild);
  }
  let saveButton = document.createElement("button");
  saveButton.setAttribute("onclick", "saveMapMarkers()");
  saveButton.appendChild(document.createTextNode("Save"));
  editButtonsDiv.appendChild(saveButton);
  let cancelButton = document.createElement("button");
  cancelButton.setAttribute("onclick", "reloadContents(editMode = true)");
  cancelButton.appendChild(document.createTextNode("Cancel"));
  editButtonsDiv.appendChild(cancelButton);
  if (document.getElementById("addSectionButton")) {
    removeMainContentAddButtons();
  }
  let mainContentDiv = document.getElementById("mainContentDiv");
  while (mainContentDiv.hasChildNodes()) {
    mainContentDiv.removeChild(mainContentDiv.firstChild);
  }
  let mapDiv = document.getElementById("mapDiv");
  let img = document.getElementById("map1Img");
  img.style.display = "block";
  mapDiv.innerHTML = "";
  mapDiv.appendChild(img);
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  Object.keys(navItems).forEach((navName) => {
    let navNameDiv = document.createElement("div");
    navNameDiv.setAttribute("class", navName + "Div");
    let navNameText = document.createElement("h2");
    navNameText.setAttribute("class", "navNameText");
    navNameText.appendChild(document.createTextNode(navName));
    navNameDiv.appendChild(navNameText);
    navItems[navName].forEach((navItem) => {
      let navItemDiv = document.createElement("div");
      navItemDiv.setAttribute("class", navItem + "Div");
      navItemDiv.setAttribute("id", navItem + "Div");
      navItemDiv.appendChild(document.createTextNode(navItem));
      let addMarkerButton = document.createElement("button");
      addMarkerButton.setAttribute("onclick", "addMarker(this)");
      addMarkerButton.setAttribute("class", "addMarkerButton");
      addMarkerButton.appendChild(document.createTextNode("Add Marker"));
      navItemDiv.appendChild(addMarkerButton);
      navNameDiv.appendChild(navItemDiv);
    });
    mainContentDiv.appendChild(navNameDiv);
  });
  placeExistingMarkers();
  //next click on map adds hub
  //this click will add a object next to the hubname showing the size of the dot and a radius slider
  //retain add hub button, every marker made will have a delete button
  //delete button will only dfelete marker, not hub
}
function placeExistingMarkers() {
  console.log("placing markers");
  let mapDiv = document.getElementById("mapDiv");
  let img = document.getElementById("map1Img");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  Object.keys(mapMarkers).forEach((navItem) => {
    let navItemDiv = document.getElementById(navItem + "Div");
    mapMarkers[navItem].forEach((marker) => {
      let slider = document.createElement("input");
      slider.setAttribute("type", "range");
      slider.setAttribute("min", "0");
      slider.setAttribute("max", "100");
      slider.setAttribute("value", (marker[2] * img.width).toString()); // Use marker[2] as the initial value
      navItemDiv.appendChild(slider);

      let dot = document.createElement("div");
      let r = marker[2] * img.width;
      let x = marker[0] * img.width - r;
      let y = marker[1] * img.height - r;
      dot.setAttribute("class", "dot");
      dot.setAttribute("id", navItem);
      dot.style.position = "absolute";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      dot.style.width = r * 2 + "px";
      dot.style.height = r * 2 + "px";
      dot.style.borderRadius = "50%";
      dot.style.backgroundColor = "green";
      dot.style.zIndex = "999";
      dot.style.display = "block";
      mapDiv.appendChild(dot);
      window.addEventListener("resize", function () {
        let r = marker[2] * img.width;
        let x = marker[0] * img.width - r;
        let y = marker[1] * img.height - r;
        dot.style.left = x + "px";
        dot.style.top = y + "px";
      });

      slider.addEventListener("input", function () {
        dot.style.width = this.value + "px";
        dot.style.height = this.value + "px";
        dot.style.left = x - (parseInt(this.value) - r * 2) / 2 + "px";
        dot.style.top = y - (parseInt(this.value) - r * 2) / 2 + "px";
      });

      let removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      navItemDiv.appendChild(removeButton);

      removeButton.addEventListener("click", function () {
        navItemDiv.removeChild(slider);
        navItemDiv.removeChild(removeButton);
        mapDiv.removeChild(dot);
      });
    });
  });
}

let activeButton = null; // global variable to keep track of the active button
let handleClickWrapper = null; // global variable to keep track of the click handler
function addMarker(button) {
  console.log("addMarker");
  let navItemDiv = button.parentNode;
  let navItem = navItemDiv.firstChild.textContent;
  let mapDiv = document.getElementById("mapDiv");
  let img = mapDiv.firstChild;

  if (activeButton) {
    console.log(activeButton);
    // If the clicked button is the active button, toggle it off
    if (activeButton === button) {
      img.removeEventListener("click", handleClickWrapper);
      console.log(img.eventListeners);
      activeButton = null;
    } else {
      // Swap the active button to the new button
      activeButton = button;
      img.removeEventListener("click", handleClickWrapper);
      handleClickWrapper = function (event) {
        console.log("clicked");
        handleClick(event, navItemDiv, navItem);
      };
      img.addEventListener("click", handleClickWrapper);

      return;
    }
  } else {
    console.log("button activated");
    // If no button is active, toggle the clicked button on
    handleClickWrapper = function (event) {
      console.log("clicked");
      handleClick(event, navItemDiv, navItem);
    };

    img.addEventListener("click", handleClickWrapper);

    activeButton = button;
  }
}

function handleClick(event, navItemDiv, navItem) {
  let mapDiv = document.getElementById("mapDiv");
  let rect = mapDiv.getBoundingClientRect();
  let img = mapDiv.firstChild;
  let x = event.pageX - rect.left - window.scrollX;
  let y = event.pageY - rect.top - window.scrollY;
  let coords = [];
  console.log("Clicked location:", x, y);
  coords[0] = x / img.width;
  coords[1] = y / img.height;

  // Create a slider in the navItemDiv
  let slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "0");
  slider.setAttribute("max", "100");
  slider.setAttribute("value", "50");
  coords[2] = slider.value / 2 / img.width;
  navItemDiv.appendChild(slider);

  // Create a remove button
  let removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  navItemDiv.appendChild(removeButton);

  // Create a dot on the map
  let dot = document.createElement("div");
  dot.setAttribute("class", "dot");
  dot.setAttribute("id", navItem);
  dot.style.position = "absolute";
  dot.style.left = coords[0] * img.width - coords[2] * img.width + "px"; // Adjust left position
  dot.style.top = coords[1] * img.height - coords[2] * img.width + "px"; // Adjust top position
  dot.style.width = coords[2] * 2 * img.width + "px";
  dot.style.height = coords[2] * 2 * img.width + "px";
  dot.style.borderRadius = "50%";
  dot.style.backgroundColor = "red";
  dot.style.zIndex = "999";
  dot.style.display = "block";
  mapDiv.appendChild(dot);

  // Update the dot size and position based on the slider value
  slider.addEventListener("input", function () {
    dot.style.width = this.value + "px";
    dot.style.height = this.value + "px";
    dot.style.left = coords[0] * img.width - this.value / 2 + "px"; // Adjust left position
    dot.style.top = coords[1] * img.height - this.value / 2 + "px"; // Adjust top position
    coords[2] = this.value / 2 / img.width;
  });

  // Remove the slider and dot when the remove button is clicked
  removeButton.addEventListener("click", function () {
    navItemDiv.removeChild(slider);
    navItemDiv.removeChild(removeButton);
    mapDiv.removeChild(dot);
  });

  window.addEventListener("resize", function () {
    let x = coords[0] * img.width;
    let y = coords[1] * img.height;
    let r = coords[2] * img.width;
    dot.style.left = x - r + "px"; // Adjust left position
    dot.style.top = y - r + "px"; // Adjust top position
    dot.style.width = r * 2 + "px";
    dot.style.height = r * 2 + "px";
  });
}
function saveMapMarkers() {
  let mapDiv = document.getElementById("mapDiv");
  let img = mapDiv.firstChild;
  let map = img.nextSibling;
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  mapMarkers = {};
  let dotDivs = document.getElementsByClassName("dot");
  for (let i = 0; i < dotDivs.length; i++) {
    let dotDiv = dotDivs[i];
    let navItem = dotDiv.id;
    let radius = parseInt(dotDiv.style.width) / 2 / img.width;
    let dotRect = dotDiv.getBoundingClientRect();
    let mapRect = mapDiv.getBoundingClientRect();
    let x = (dotRect.left - mapRect.left + radius * img.width) / img.width;
    let y = (dotRect.top - mapRect.top + radius * img.width) / img.height;
    if (!mapMarkers[navItem]) {
      mapMarkers[navItem] = [];
    }
    mapMarkers[navItem].push([x, y, radius]);
  }
  fetch("/saveMapMarkers?id=" + encodeURIComponent(id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      mapMarkers: mapMarkers,
    }),
  }).then((response) => {
    if (response.ok) {
      reloadContents((editMode = true));
    } else {
      return Promise.reject("something went wrong!");
    }
  });
}
