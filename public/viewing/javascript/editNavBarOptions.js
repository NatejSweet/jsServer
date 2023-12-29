const { response } = require("express");

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
        console.log(li);
        let label = li.firstChild;
        let labelText = label.firstChild;
        let select = labelText.nextSibling;
        let options = select.childNodes;
        let navItemDiv = document.createElement('div');
        navItemDiv.setAttribute('id', label.id);
        let navItemLabel = document.createElement('label');
        navItemLabel.appendChild(document.createTextNode(label.id+': '));
        navItemDiv.appendChild(navItemLabel);
        let addNavOptionButton = document.createElement('button');
        addNavOptionButton.setAttribute('onclick', 'addNavOption(this)');
        addNavOptionButton.appendChild(document.createTextNode('Add Option'));
        navItemDiv.appendChild(addNavOptionButton);
        navOptionsDiv.appendChild(navItemDiv);
        
        options.forEach(option => {
            let navItemOption = document.createElement('input');
            navItemOption.setAttribute('type', 'text');
            navItemOption.setAttribute('value', option.value);
            navItemOption.setAttribute('id', option.value);
            navItemDiv.insertBefore(navItemOption, addNavOptionButton);
            let removeButton = document.createElement('button');
            removeButton.setAttribute('onclick', 'removeNavOption(this)');
            removeButton.appendChild(document.createTextNode('Remove'));
            navItemDiv.insertBefore(removeButton, addNavOptionButton);

            
        });
    });
    mainContentDiv.appendChild(navOptionsDiv);
    let saveButton = document.createElement('button');
    saveButton.setAttribute('onclick', 'saveNavOptions()');
    saveButton.appendChild(document.createTextNode('Save Nav Options'));
    mainContentDiv.appendChild(saveButton);
    let cancelButton = document.createElement('button');
    cancelButton.setAttribute('onclick', 'cancelNavOptions()');
    cancelButton.appendChild(document.createTextNode('Cancel'));
    mainContentDiv.appendChild(cancelButton);
}
function addNavOption(button){
    let navItemDiv = button.parentNode;
    let navItemOption = document.createElement('input');
    navItemOption.setAttribute('type', 'text');
    navItemOption.setAttribute('id', 'newNavOption');
    navItemDiv.insertBefore(navItemOption, button);
    let removeButton = document.createElement('button');
    removeButton.setAttribute('onclick', 'removeNavOption(this)');
    removeButton.appendChild(document.createTextNode('Remove'));
    navItemDiv.insertBefore(removeButton, button);


}

function removeNavOption(button){
    let navItemDiv = button.parentNode;
    navItemDiv.removeChild(button.previousSibling);
    navItemDiv.removeChild(button);

}

function saveNavOptions(){
    let navOptionsDiv = document.getElementById('navOptionsDiv');
    let navItems = navOptionsDiv.childNodes;
    let navOptions = {};
    let pages = {};
    navItems.forEach(navItem => {
        let navItemOptions = navItem.childNodes;
        let navItemOptionValues = [];
        navItemOptions.forEach(navItemOption => {
            if (navItemOption.tagName === 'INPUT'){
                navItemOptionValues.push(navItemOption.value);
                pages[navItemOption.value] = [];
            }
        });
        navOptions[navItem.id] = navItemOptionValues;
    });
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log(pages)
    fetch('/editNavBarOptions?id=' + encodeURIComponent(id), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ navOptions, pages }),
    }).then(response => {
        if (response.ok){
            enableNavBar();
            reloadNavBar();
            return reloadContents(editMode=true);
        }
    })
}
