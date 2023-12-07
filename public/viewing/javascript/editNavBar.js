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
    console.log(ul)
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
        console.log(content);
        let navItems = content.navItemsJSON;
        let pages = content.pages;
         let navNames = content.navNames;
        console.log(navItems)
        updateDBNavBarItems(navItems, pages,navNames, ul);
    })
    //scan IDs of inputs replacing matching Ids and removing missing ones
    //create new page items for the new navs and add them to the list
    
}
function updateDBNavBarItems(navItems, pages,navNames, ul){
    console.log(navItems)

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    let newNavBarItems = [] //array of navbar items
    let newNavItems = {} //JSON of navbar item and theor hubs
    newPages = {} //JSON of new pages
    console.log(ul)
    ul.childNodes.forEach(li => {   //scan through the list of navbar items, adding the correct names
        console.log(li)             // this might not need to sort through the ids since we just comapre the lists
        let input = li.firstChild
        console.log(input)
        let id = input.id
        console.log(id)
        if (id=='newNavBarItem'){
            newNavBarItems.push(input.value)
        }else{
            newNavBarItems.push(id)
        }   
    })
    console.log(newNavBarItems)
    newNavBarItems.forEach(newNavBarItem => {                   //for each new nav item, if the original nav items includes it, copy its info to the new nav items JSON
        if (Object.keys(navItems).includes(newNavBarItem)){
            newNavItems[newNavBarItem] = navItems[newNavBarItem]
        }else{
            newNavItems[newNavBarItem] = []    
                   }})           //if the new nav item is not a page, add it to the new nav items JSON
    Object.values(newNavItems).forEach(pages => {
        pages.forEach(page => {
            if (Object.keys(pages).includes(page)){         //if the new nav item is a page, add it to the new pages JSON
                newPages[page] = pages[page]
            }else{
                console.log(page)
                newPages[page] = []               //if the new nav item is not a page, add it to the new nav items JSON   
            }
        })})
        console.log(newPages)
    fetch('/updateNavBarItems?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            navItems: newNavItems,
            pages: newPages,
            navNames: newNavBarItems    
        })
    }).then(response => {
        console.log('a')
        console.log(response)
        return response;
    }).then(content => {
        console.log(content)
        let editButtonsDiv = document.getElementById('editButtonsDiv');
        while (editButtonsDiv.hasChildNodes()){
            editButtonsDiv.removeChild(editButtonsDiv.firstChild);
        }
        reloadNavBar();
        reloadContents(editMode=true);
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
