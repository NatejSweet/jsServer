function editNavBar(){
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    let navBar = document.getElementById('navBar');
    let ul = navBar.firstChild
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let navBar = document.getElementById('navBar');
    let ul = navBar.firstChild
    //Need to fetch pages and navItems
    fetch('/navItems?id=' + encodeURIComponent(id), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        console.log(response)
        return response.json();
    }).then(content => {
        let navItems = content.navItemsJSON;
        let pages = content.pages;
        updateDBNavBarItems(navItems, pages, ul);
    })
    //scan IDs of inputs replacing matching Ids and removing missing ones
    //create new page items for the new navs and add them to the list
    
}
function updateDBNavBarItems(navItems, pages, ul){  //could be rewritten to identify id of a nav item to see if a user is renaming
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let newNavItems = {} //JSON of navbar item and their hubs
    newPages = {} //JSON of new pages
    let newMapMarkers = {}
    ul.childNodes.forEach(li => {
        let input = li.firstChild
        let id = input.id
        if (id=='newNavBarItem'){           //if is new item
            newNavItems[input.value] = []
        }else if (id!=input.value){         //if we rename a nav Item
            newNavItems[input.value] = navItems[id]
            newPages[input.value] = pages[id]
        }else{                              //if remains the same
            newNavItems[id] = navItems[id]  
            newPages[id] = pages[id]
        }
        
    })   
    Object.values(newNavItems).forEach(navItem => {
        if (mapMarkers[navItem]){
            newMapMarkers[navItem] = mapMarkers[navItem]
        }
    })                                
    fetch('/updateNavBarItems?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            navItems: newNavItems,
            pages: newPages   
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
