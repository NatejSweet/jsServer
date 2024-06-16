function editMapMarkers() {
  let mapDiv = document.getElementById("mapDiv");
  let img = document.getElementById("map1Img");
  mapDiv.style.height = img.height + "px";
  let editButtonsDiv = document.getElementById("editButtonsDiv");
  while (editButtonsDiv.hasChildNodes()) {
    editButtonsDiv.removeChild(editButtonsDiv.firstChild);
  }
  let saveButton = document.createElement("button");
  saveButton.setAttribute("onclick", "saveMapMarkers(mapDiv)");
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
  placeExistingMarkers(mapDiv, img);
}
function placeExistingMarkers(mapDiv, img) {
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
      console.log("mapDiv: ", mapDiv);
      handleClick(event, navItemDiv, navItem, mapDiv);
    };

    img.addEventListener("click", handleClickWrapper);

    activeButton = button;
  }
}

function handleClick(event, navItemDiv, navItem, mapDiv) {
  let img = mapDiv.firstChild;
  let rect = img.getBoundingClientRect();
  console.log("rect: ", rect.left, rect.top);
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;
  let coords = [];
  console.log("Clicked location:", x, y);
  coords[0] = x / img.width;
  coords[1] = y / img.height;
  console.log("Coords:", coords);

  // Create a slider in the navItemDiv
  let slider = document.createElement("input");
  slider.setAttribute("type", "range");
  slider.setAttribute("min", "0");
  slider.setAttribute("max", "100");
  slider.setAttribute("value", "50");
  coords[2] = slider.value / 2 / img.width; //radius as decimal percentage of image width
  coords[3] = slider.value / 2 / img.height; //radius as decimal percentage of image height
  navItemDiv.appendChild(slider);
  console.log("radiai: ", coords[2], coords[3]);

  // Create a remove button
  let removeButton = document.createElement("button");
  removeButton.textContent = "Remove";
  navItemDiv.appendChild(removeButton);

  // Create a dot on the map
  let dot = document.createElement("div");
  dot.setAttribute("class", "dot");
  dot.setAttribute("id", navItem);
  dot.style.position = "absolute";
  console.log(
    "new cords:",
    (coords[0] - coords[2]) * 100,
    (coords[1] - coords[3]) * 100
  );
  dot.style.left = (coords[0] - coords[2]) * 100 + "%"; // Adjust left position
  dot.style.top = (coords[1] - coords[3]) * 100 + "%"; // Adjust top position
  dot.style.width = coords[2] * 2 * 100 + "%"; // Adjust width
  dot.style.height = coords[3] * 2 * 100 + "%"; // Adjust height
  dot.style.borderRadius = "50%";
  dot.style.backgroundColor = "red";
  dot.style.zIndex = "999";
  dot.style.display = "block";
  console.log(
    "dot: ",
    dot.style.left,
    dot.style.top,
    dot.style.width,
    dot.style.height
  );
  mapDiv.appendChild(dot);

  // Update the dot size and position based on the slider value
  slider.addEventListener("input", function () {
    dot.style.width = this.value + "px";
    dot.style.height = this.value + "px";
    dot.style.left = coords[0] * 100 - this.value / 2 + "%"; // Adjust left position
    dot.style.top = coords[1] * 100 - this.value / 2 + "%"; // Adjust top position
    coords[2] = this.value / 2 / img.width;
  });

  // Remove the slider and dot when the remove button is clicked
  removeButton.addEventListener("click", function () {
    navItemDiv.removeChild(slider);
    navItemDiv.removeChild(removeButton);
    mapDiv.removeChild(dot);
  });

  window.addEventListener("resize", function () {
    let x = coords[0] * 100; // Convert to percentage
    let y = coords[1] * 100; // Convert to percentage
    let r = coords[2] * 100; // Convert to percentage
    dot.style.left = x - r + "%"; // Adjust left position
    dot.style.top = y - r + "%"; // Adjust top position
    dot.style.width = r * 2 + "%";
    dot.style.height = r * 2 + "%";
  });
}
function saveMapMarkers(mapDiv) {
  let img = mapDiv.firstChild;
  mapDiv.style.height = "auto";
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  mapMarkers = {};
  let dotDivs = document.getElementsByClassName("dot");
  for (let i = 0; i < dotDivs.length; i++) {
    let dotDiv = dotDivs[i];
    let navItem = dotDiv.id;
    console.log("width: ", parseInt(dotDiv.style.width));
    console.log("height: ", parseInt(dotDiv.style.height));
    let radXPercent = parseInt(dotDiv.style.width);
    let radiusX = (parseInt(dotDiv.style.width) / 2 / 100) * img.width;
    let radiusY = (parseInt(dotDiv.style.height) / 2 / 100) * img.height;
    let dotRect = dotDiv.getBoundingClientRect();
    let mapRect = mapDiv.getBoundingClientRect();
    console.log("dotRect: ", dotRect.left, dotRect.top);
    console.log("mapRect: ", mapRect.left, mapRect.top);
    let x = (dotRect.left - mapRect.left + radiusX * img.width) / img.width;
    let y = (dotRect.top - mapRect.top + radiusY * img.height) / img.height;
    console.log("x, y, radiusX:", x, y, radiusX);
    if (!mapMarkers[navItem]) {
      mapMarkers[navItem] = [];
    }
    mapMarkers[navItem].push([x, y, radXPercent]);
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
