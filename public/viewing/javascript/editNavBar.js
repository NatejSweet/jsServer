function editNavBar(){
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    let navBar = document.getElementById('navBar');
    if (navBar.firstChild){
        let ul = navBar.firstChild;
        ul.childNodes.forEach(li => {
            let input = document.createElement('input')
            input.setAttribute('type', 'text')
            input.setAttribute('value', li.firstChild.id)
            input.setAttribute('id', li.firstChild.id)
            li.replaceChild(input, li.firstChild)
            let removeButton = document.createElement('button')
            removeButton.setAttribute('onclick', 'removeNavBarItem(this)')
            removeButton.appendChild(document.createTextNode('Remove'))
            li.appendChild(removeButton)
        })
    }else{
        let ul = document.createElement('ul')
        navBar.appendChild(ul)
    }
    createAddNavBarItemButton();
    createSaveNavBarButton();
    createCancelNavBarEditButton();
}
function createAddNavBarItemButton(){
    let addNavBarItemButton = document.createElement('button')
    addNavBarItemButton.setAttribute('id', 'addNavBarItemButton')
    addNavBarItemButton.setAttribute('onclick', 'addNavBarItem()')
    addNavBarItemButton.appendChild(document.createTextNode('Add NavBar Item'))
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    editButtonsDiv.appendChild(addNavBarItemButton)
}

function createSaveNavBarButton(){
    let saveNavBarButton = document.createElement('button')
    saveNavBarButton.setAttribute('id', 'saveNavBarButton')
    saveNavBarButton.setAttribute('onclick', 'saveNavBar()')
    saveNavBarButton.appendChild(document.createTextNode('Save NavBar'))
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    editButtonsDiv.appendChild(saveNavBarButton)
}

function createCancelNavBarEditButton(){
    let cancelNavBarEditButton = document.createElement('button')
    cancelNavBarEditButton.setAttribute('id', 'cancelNavBarEditButton')
    cancelNavBarEditButton.setAttribute('onclick', 'cancelNavBarEdit()')
    cancelNavBarEditButton.appendChild(document.createTextNode('Cancel'))
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    editButtonsDiv.appendChild(cancelNavBarEditButton)
}

function addNavBarItem(){
    let navBar = document.getElementById('navBar');
    let ul = navBar.firstChild
    let li = document.createElement('li')
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('id', 'newNavBarItem')
    li.appendChild(input)
    let removeButton = document.createElement('button')
    removeButton.setAttribute('onclick', 'removeNavBarItem(this)')
    removeButton.appendChild(document.createTextNode('Remove'))
    li.appendChild(removeButton)
    ul.appendChild(li)
}

function removeNavBarItem(button){
    let li = button.parentNode
    let ul = li.parentNode
    ul.removeChild(li)
}

function saveNavBar(){  
    console.log(pagesJSON)
    console.log(mapMarkers)
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let navBar = document.getElementById('navBar');
    let ul = navBar.firstChild
    let newNavItems = {} //JSON of navbar item and their hubs
    let newMapMarkers = {}
    ul.childNodes.forEach(li => {
        let input = li.firstChild
        let id = input.id
        if (id=='newNavBarItem'){           //if is new item
            newNavItems[input.value] = []
        }else if (id!=input.value){         //if we rename a nav Item
            newNavItems[input.value] = navItems[id]
        }else{                              //if remains the same
            newNavItems[id] = navItems[id]  
        }
        
    })
    navItems = newNavItems
    Object.values(navItems).forEach(navItems => {
            navItems.forEach(navItem => {
            console.log(navItem)
            console.log(mapMarkers)
            console.log(mapMarkers[navItem])
            if (mapMarkers[navItem]){
                newMapMarkers[navItem] = mapMarkers[navItem]
            }
            console.log(newMapMarkers)
        })       
    })                
    fetch('/updateNavBarItems?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            navItems: newNavItems, 
        })
    }).then(response => {
        if (response.ok){
            reloadNavBar();
            reloadContents(editMode=true);
        }
    })
    fetch('/saveMapMarkers?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mapMarkers: newMapMarkers
        })
    }).then(response => {
        if (response.ok){
            console.log('aved map markers')
            reloadNavBar();
            reloadContents(editMode=true);
        }
    })
}


function cancelNavBarEdit(){
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    reloadNavBar();
    reloadContents(editMode=true);
}
