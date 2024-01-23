function editNavOptions(){
    disableNavBar();
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    let navBar = document.getElementById('navBar');
    let ul = navBar.firstChild;
    let mainContentDiv = document.getElementById('mainContentDiv');
        while (mainContentDiv.hasChildNodes()){
            mainContentDiv.removeChild(mainContentDiv.firstChild);
        }
        let navOptionsDiv = document.createElement('div');
        navOptionsDiv.setAttribute('id', 'navOptionsDiv');
    ul.childNodes.forEach(li => {
        let select = li.firstChild
        let options = [];
        if (select.childNodes){
             options = select.childNodes;
        }
        let label = options[0]
        let navItemDiv = document.createElement('div');
        navItemDiv.setAttribute('id', label.value);
        let navItemLabel = document.createElement('label');
        navItemLabel.appendChild(document.createTextNode(label.value+': '));
        navItemDiv.appendChild(navItemLabel);
        let addNavOptionButton = document.createElement('button');
        addNavOptionButton.setAttribute('onclick', 'addNavOption(this)');
        addNavOptionButton.appendChild(document.createTextNode('Add Option'));
        navItemDiv.appendChild(addNavOptionButton);
        navOptionsDiv.appendChild(navItemDiv);
        
        options.forEach(option => {
            if (option != label){
                let navItemOption = document.createElement('input');
                navItemOption.setAttribute('type', 'text');
                navItemOption.setAttribute('value', option.value);
                navItemOption.setAttribute('id', option.value);
                navItemDiv.appendChild(navItemOption);
                let removeButton = document.createElement('button');
                removeButton.setAttribute('onclick', 'removeNavOption(this)');
                removeButton.appendChild(document.createTextNode('Remove'));
                navItemDiv.appendChild(removeButton);
            }

            
        });
    });
    mainContentDiv.appendChild(navOptionsDiv);
    let saveButton = document.createElement('button');
    saveButton.setAttribute('onclick', 'saveNavOptions()');
    saveButton.appendChild(document.createTextNode('Save Nav Options'));
    editButtonsDiv.appendChild(saveButton);
    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('onclick', 'cancelNavOptions()');
    cancelButton.appendChild(document.createTextNode('Cancel'));
   editButtonsDiv.appendChild(cancelButton);
}
function addNavOption(button){
    let navItemDiv = button.parentNode;
    let navItemOption = document.createElement('input');
    navItemOption.setAttribute('type', 'text');
    navItemOption.setAttribute('id', 'newNavOption');
    navItemDiv.appendChild(navItemOption);
    let removeButton = document.createElement('button');
    removeButton.setAttribute('onclick', 'removeNavOption(this)');
    removeButton.appendChild(document.createTextNode('Remove'));
    navItemDiv.appendChild(removeButton);


}

function removeNavOption(button){
    let navItemDiv = button.parentNode;
    navItemDiv.removeChild(button.previousSibling);
    navItemDiv.removeChild(button);

}

function saveNavOptions(){
    let navOptionsDiv = document.getElementById('navOptionsDiv');
    let editedNavItems = navOptionsDiv.childNodes;
    let newNavItems = {};
    let newPages = {};
    let newMapMarkers = {};
    editedNavItems.forEach(navItem => {
        newNavItems[navItem.id] = [];
        let navItemOptions = navItem.childNodes;
        navItemOptions.forEach(navItemOption => {
            if (navItemOption.tagName === 'INPUT'){
                newNavItems[navItem.id].push(navItemOption.value);
                if (navItemOption.id == 'newNavOption'){
                    newPages[navItemOption.value] = {content: [], imgId: null};
                    try {                                                                                       //checking for same name
                        newPages[navItemOption.value].content = pagesJSON[navItemOption.value].content;
                        newPages[navItemOption.value].imgId = pagesJSON[navItemOption.value].imgId;
                    }
                    catch (err){
                        newPages[navItemOption.value].content = [];
                        newPages[navItemOption.value].imgId = null;
                    }
                }
                else {
                    console.log(navItemOption.id)
                    newPages[navItemOption.value] = {content: [], imgId: null};
                    newPages[navItemOption.value].content = pagesJSON[navItemOption.id].content;
                    newPages[navItemOption.value].imgId = pagesJSON[navItemOption.id].imgId;
                }
            }
        });
    });
    Object.values(newNavItems).forEach(navItems => {
        navItems.forEach(navItem => {
            if (mapMarkers && mapMarkers[navItem]){
                newMapMarkers[navItem] = mapMarkers[navItem]
            }
        })  
    })
    pagesJSON = newPages;
    navItems = newNavItems;
    mapMarkers = newMapMarkers;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    fetch('/editNavBarOptions?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newNavItems, newPages }),
    }).then(response => {
        console.log(response)
        if (response.ok){
            enableNavBar();
            reloadNavBar();
        }
    })
    fetch('/saveMapMarkers?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mapMarkers: mapMarkers
        })
    }).then(response => {
        if (response.ok){
            reloadNavBar();
            reloadContents(editMode=true);
        }
    })
}
function cancelNavOptions(){
    enableNavBar();
    reloadNavBar();
    reloadContents(editMode=true);
}

