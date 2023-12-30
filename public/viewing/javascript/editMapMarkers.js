function editMapMarkers(){
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    let saveButton = document.createElement('button');
    saveButton.setAttribute('onclick', 'saveMapMarkers()');
    saveButton.appendChild(document.createTextNode('Save'));
    editButtonsDiv.appendChild(saveButton);
    if (document.getElementById('addSectionButton')){
        removeMainContentAddButtons();
    }
    let mainContentDiv = document.getElementById('mainContentDiv');
    while (mainContentDiv.hasChildNodes()){
        mainContentDiv.removeChild(mainContentDiv.firstChild);
    }
    let mapDiv = document.getElementById('mapDiv');
    let img = mapDiv.firstChild;
    let map = img.nextSibling
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch('/navItems?id=' + encodeURIComponent(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(content => {
        let navItems = content.navItemsJSON;
        Object.keys(navItems).forEach(navName => {
            let navNameDiv = document.createElement('div');
            navNameDiv.setAttribute('class', navName+'Div');
            let navNameText = document.createElement('h2');
            navNameText.setAttribute('class', 'navNameText');
            navNameText.appendChild(document.createTextNode(navName));
            navNameDiv.appendChild(navNameText);
            navItems[navName].forEach(navItem => {
                let navItemDiv = document.createElement('div');
                navItemDiv.setAttribute('class', navItem+'Div');
                navItemDiv.setAttribute('id', navItem+'Div');
                navItemDiv.appendChild(document.createTextNode(navItem));
                let addMarkerButton = document.createElement('button');
                addMarkerButton.setAttribute('onclick', 'addMarker(this)');
                addMarkerButton.appendChild(document.createTextNode('Add Marker'));
                navItemDiv.appendChild(addMarkerButton);
                navNameDiv.appendChild(navItemDiv);
            })
            mainContentDiv.appendChild(navNameDiv);
        })
    })
    placeExistingMarkers();
    //next click on map adds hub
    //this click will add a object next to the hubname showing the size of the dot and a radius slider
    //retain add hub button, every marker made will have a delete button
    //delete button will only dfelete marker, not hub
}
function placeExistingMarkers(){
    let mapDiv = document.getElementById('mapDiv');
    let img = mapDiv.firstChild;
    let map = img.nextSibling
    mapDiv.removeChild(map);
    //TO-DO: disable other image

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch('/mapMarkers?id=' + encodeURIComponent(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        return response.json();
    }).then(content => {
        let mapMarkers = content.mapMarkersJSON;
        Object.keys(mapMarkers).forEach(navItem => {
            let navItemDiv = document.getElementById(navItem+'Div');
            console.log(navItem+'Div')
            mapMarkers[navItem].forEach(marker=> {
            

                    let dot = document.createElement('div');
                    dot.setAttribute('class', 'dot');
                    dot.setAttribute('id', navItem);
                    dot.style.position = 'absolute';
                    dot.style.left = marker[0] + 'px'; // Adjust left position
                    dot.style.top = marker[1] + 'px'; // Adjust top position
                    dot.style.width = marker[2]+ 'px';
                    dot.style.height = marker[2] + 'px';
                    dot.style.borderRadius = '50%';
                    dot.style.backgroundColor = 'green';
                    mapDiv.style.position = 'relative'; // Set parent element position
                    mapDiv.appendChild(dot);

                    let slider = document.createElement('input');
                    slider.setAttribute('type', 'range');
                    slider.setAttribute('min', '0');
                    slider.setAttribute('max', '100');
                    slider.setAttribute('value', '50');
                    navItemDiv.appendChild(slider);

                    slider.addEventListener('input', function() {
                        dot.style.width = this.value + 'px';
                        dot.style.height = this.value + 'px';
                        dot.style.left = (x - this.value / 2) + 'px'; // Adjust left position
                        dot.style.top = (y - this.value / 2) + 'px'; // Adjust top position
                    });

                    let removeButton = document.createElement('button');
                    removeButton.textContent = 'Remove';
                    navItemDiv.appendChild(removeButton);

                    removeButton.addEventListener('click', function() {
                        navItemDiv.removeChild(slider);
                        navItemDiv.removeChild(removeButton);
                        mapDiv.removeChild(dot);
                    })
                });
            });
    })
}



let activeButton = null; // global variable to keep track of the active button
let handleClickWrapper = null; // global variable to keep track of the click handler
function addMarker(button) {
    let navItemDiv = button.parentNode;
    let navItem = navItemDiv.firstChild.textContent;
    let mapDiv = document.getElementById('mapDiv');
    let img = mapDiv.firstChild;

    if (activeButton) {
        // If the clicked button is the active button, toggle it off
        if (activeButton === button) {
            img.removeEventListener('click', handleClickWrapper);
            console.log(img.eventListeners)
            toggleButtons(true); // Enable all buttons
            activeButton = null;
        } else {
            // Swap the active button to the new button
            activeButton = button;
            img.removeEventListener('click', handleClickWrapper);
            handleClickWrapper = function(event) {
                handleClick(event, navItemDiv, navItem);
            };
            img.addEventListener('click', handleClickWrapper);
            
            return;
        }
    } else {
        // If no button is active, toggle the clicked button on
        handleClickWrapper = function(event) {
            handleClick(event, navItemDiv, navItem);
        };
        
        img.addEventListener('click', handleClickWrapper);
        
        toggleButtons(false, button); // Disable all other buttons
        activeButton = button;
    }
}

function toggleButtons(enable, excludeButton) {
    let buttons = document.querySelectorAll('.addMarkerButtonClass'); // Replace with the actual class of your buttons
    buttons.forEach(button => {
        if (button !== excludeButton) {
            button.disabled = enable ? false : true;
        }
    });
}
function handleClick(event, navItemDiv, navItem) {
    let x = event.offsetX;
    let y = event.offsetY;
    console.log('Clicked location:', x, y);

    // Create a slider in the navItemDiv
    let slider = document.createElement('input');
    slider.setAttribute('type', 'range');
    slider.setAttribute('min', '0');
    slider.setAttribute('max', '100');
    slider.setAttribute('value', '50');
    navItemDiv.appendChild(slider);

    // Create a remove button
    let removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    navItemDiv.appendChild(removeButton);

    // Create a dot on the map
    let dot = document.createElement('div');
    dot.setAttribute('class', 'dot');
    dot.setAttribute('id', navItem);
    dot.style.position = 'absolute';
    dot.style.left = (x - slider.value / 2) + 'px'; // Adjust left position
    dot.style.top = (y - slider.value / 2) + 'px'; // Adjust top position
    dot.style.width = slider.value + 'px';
    dot.style.height = slider.value + 'px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = 'red';
    mapDiv.style.position = 'relative'; // Set parent element position
    mapDiv.appendChild(dot);

    // Update the dot size and position based on the slider value
    slider.addEventListener('input', function() {
        dot.style.width = this.value + 'px';
        dot.style.height = this.value + 'px';
        dot.style.left = (x - this.value / 2) + 'px'; // Adjust left position
        dot.style.top = (y - this.value / 2) + 'px'; // Adjust top position
    });

    // Remove the slider and dot when the remove button is clicked
    removeButton.addEventListener('click', function() {
        navItemDiv.removeChild(slider);
        navItemDiv.removeChild(removeButton);
        mapDiv.removeChild(dot);
    });
}
function saveMapMarkers(){
    let mapDiv = document.getElementById('mapDiv');
    let img = mapDiv.firstChild;
    let map = img.nextSibling
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let mapMarkers = {};
    let dotDivs = document.getElementsByClassName('dot');
    for (let i = 0; i < dotDivs.length; i++){
        let dotDiv = dotDivs[i];
        let navItem = dotDiv.id;
        let x = dotDiv.offsetLeft;
        let y = dotDiv.offsetTop;
        let radius = parseInt(dotDiv.style.width);
        if (!mapMarkers[navItem]){
            mapMarkers[navItem] = [];
        }
        mapMarkers[navItem].push([x, y, radius])
    }
    fetch('/saveMapMarkers?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mapMarkers: mapMarkers
        })
    }).then(response => {
        if (response.ok) {
            reloadContents(editMode = true)
        } else {
            return Promise.reject('something went wrong!');
        }
    })
}
    