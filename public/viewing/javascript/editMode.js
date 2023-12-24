function createEditButton(){
    let editModeButton = document.createElement('button')
    editModeButton.setAttribute('id', 'editModeButton')
    editModeButton.setAttribute('onclick', 'enterEditMode()')
    editModeButton.appendChild(document.createTextNode('Enter Edit Mode'))
    let header = document.querySelector('header')
    header.appendChild(editModeButton)
}
function enterEditMode(){
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    if (document.getElementById('editModeButton')){
        let editModeButton = document.getElementById('editModeButton')
        editModeButton.remove()
    }
    let editPageButton = document.createElement('button')
    editPageButton.setAttribute('id', 'editPageButton')
    editPageButton.setAttribute('onclick', 'editPage()')
    editPageButton.appendChild(document.createTextNode('Edit Page'))
    editButtonsDiv.appendChild(editPageButton)
    let editNavBarButton = document.createElement('button')
    editNavBarButton.setAttribute('id', 'editNavBarButton')
    editNavBarButton.setAttribute('onclick', 'editNavBar()')
    editNavBarButton.appendChild(document.createTextNode('Edit NavBar'))
    editButtonsDiv.appendChild(editNavBarButton)
    let editNavItemsButton = document.createElement('button')
    editNavItemsButton.setAttribute('id', 'editNavItemsButton')
    editNavItemsButton.setAttribute('onclick', 'editNavOptions()')
    editNavItemsButton.appendChild(document.createTextNode('Edit Nav Options'))
    editButtonsDiv.appendChild(editNavItemsButton)
    let exitEditModeButton = document.createElement('button')
    exitEditModeButton.setAttribute('id', 'exitEditModeButton')
    exitEditModeButton.setAttribute('onclick', 'exitEditMode()')
    exitEditModeButton.appendChild(document.createTextNode('Exit Edit Mode'))
    editButtonsDiv.appendChild(exitEditModeButton)
    let editMapMarkersButton = document.createElement('button')
    editMapMarkersButton.setAttribute('id', 'editMapMarkersButton')
    editMapMarkersButton.setAttribute('onclick', 'editMapMarkers()')
    editMapMarkersButton.appendChild(document.createTextNode('Edit Map Markers'))
    editButtonsDiv.appendChild(editMapMarkersButton)
}
function exitEditMode(){
    console.log('exiting edit mode')
    let editButtonsDiv = document.getElementById('editButtonsDiv');
    while (editButtonsDiv.hasChildNodes()){
        console.log(editButtonsDiv.firstChild)
        editButtonsDiv.removeChild(editButtonsDiv.firstChild);
    }
    if (document.getElementById('addSectionButton')){
        removeMainContentAddButtons();
    }
    reloadContents(editMode=false);
}