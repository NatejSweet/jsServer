const e = require("express")

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
    editNavItemsButton.setAttribute('onclick', 'editNavItems()')
    editNavItemsButton.appendChild(document.createTextNode('Edit NavItems'))
    editButtonsDiv.appendChild(editNavItemsButton)
    let exitEditModeButton = document.createElement('button')
    exitEditModeButton.setAttribute('id', 'exitEditModeButton')
    exitEditModeButton.setAttribute('onclick', 'exitEditMode()')
    exitEditModeButton.appendChild(document.createTextNode('Exit Edit Mode'))
    editButtonsDiv.appendChild(exitEditModeButton)

}
function addSaveButton(){
    let saveButton = document.createElement('button')
    saveButton.setAttribute('id', 'saveButton')
    saveButton.setAttribute('onclick', 'savePage()')
    saveButton.appendChild(document.createTextNode('Save Page'))
    let header = document.querySelector('header')
    header.appendChild(saveButton)
}
function savePage(){
    enableNavBar();
    if (document.getElementById('pageTitle')){
        let hubName = document.getElementById('pageTitle').textContent;
        removeSaveButton();
        removeMainContentAddButtons();
        let content = storeMainContent();
        pagesJSON[hubName].content = content;
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch('/updatePage?id=' + encodeURIComponent(id),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pagesJSON)
        }).then(response => {
            if (response.ok) {
                return reloadContents(editMode=true);
            }
        })
    }else{
        removeSaveButton();
        removeMainContentAddButtons();
        let content = storeMainContent();
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        fetch('/updateMainPage?id=' + encodeURIComponent(id),{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(content)
        }).then(response => {
            if (response.ok) {
                return reloadContents(editMode=true);
            }
        })
    }
    //post function w/ event.preventDefault(), UPDATE worlds SET pages=? WHERE id = ? AND ownerId = ?
}function reloadContents(editMode){
    if (document.getElementById('pageTitle')){
        loadHub(document.getElementById('pageTitle').textContent)
    }else{
        reloadMainPage()
    }
    if (editMode){
        enterEditMode();
    }
}
function removeSaveButton(){
    let saveButton = document.getElementById('saveButton')
    saveButton.remove()
}
function editPage() {
    disableNavBar();
    console.log('edit page')
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.innerHTML = ''
    addSaveButton();
    addAddSectionButton();
    const titleDivs = document.querySelectorAll('.titleDiv');
    const titles = document.querySelectorAll('.titleText');
    const subtitles = document.querySelectorAll('.subTitleText');
    const texts = document.querySelectorAll('.textText');

    titleDivs.forEach(titleDiv => {
        let title = titleDiv.getElementsByClassName('titletext')
        let titleLabel = document.createElement('label')
        titleLabel.textContent = 'Title: '
        let titleText = document.createElement('input')
        titleText.setAttribute("name", "title")
        titleText.setAttribute("class", "titletext")
        titleText.value = title[0].textContent
        titleLabel.appendChild(titleText)
        title[0].replaceWith(titleLabel)
        let addSubtextButton = document.createElement('button')
        addSubtextButton.setAttribute('id','subtextAddButton')
        addSubtextButton.textContent = 'Add Subtext'
        addSubtextButton.addEventListener('click',addSubtext,false)
        titleDiv.appendChild(addSubtextButton)
        let removeTitleButton = document.createElement('button');
        removeTitleButton.textContent = 'Remove Title/Section';
        removeTitleButton.addEventListener('click', removeItem);
        titleDiv.appendChild(removeTitleButton);
        let subtitleDivs = titleDiv.getElementsByClassName('subTitleDiv')
        subtitleDivs.forEach(subtitleDiv =>{
            let subtitle = subtitleDiv.getElementsByClassName('subTitleText')
            let subtitleLabel = document.createElement('label')
            subtitleLabel.textContent = 'Subtitle: '
            let subtitleText = document.createElement('input')
            subtitleText.setAttribute("name", "subtitle")
            subtitleText.setAttribute('class', 'subtext')
            subtitleText.value = subtitle[0].textContent
            subtitleLabel.appendChild(subtitleText)

        })

    })

    titles.forEach(title => {
        const input = document.createElement('input');
        input.setAttribute('class', 'titletext')
        input.value = title.textContent;
        title.replaceWith(input);
        
    });

    subtitles.forEach(subtitle => {
        const input = document.createElement('input');
        input.value = subtitle.textContent;
        input.setAttribute('class', 'subtext')
        subtitle.replaceWith(input);
    });

    texts.forEach(text => {
        const input = document.createElement('input');
        input.value = text.textContent;
        input.setAttribute('class', 'text')
        text.replaceWith(input);
    });
}
function addAddSectionButton(){
    let header = document.querySelector('header')
    let addSectionButton = document.createElement('button')
    addSectionButton.setAttribute('id', 'addSectionButton')
    addSectionButton.setAttribute('class', 'addSectionButton')
    addSectionButton.setAttribute('onclick', 'addTitle()')
    addSectionButton.appendChild(document.createTextNode('Add Section'))
    header.appendChild(addSectionButton)
}

function addTitle(){
    let contentDiv = document.getElementById('mainContentDiv')
    let titleDiv = document.createElement('div')
    titleDiv.setAttribute('class','titleDiv')
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title: '
    let titleText = document.createElement('input')
    titleText.setAttribute("name", "title")
    titleText.setAttribute("class", "titletext")
    titleLabel.appendChild(titleText)
    let addSubtextButton = document.createElement('button')
    addSubtextButton.setAttribute('id','subtextAddButton')
    addSubtextButton.textContent = 'Add Subtext'
    addSubtextButton.addEventListener('click',addSubtext,false)
    titleDiv.appendChild(titleLabel)
    titleDiv.appendChild(addSubtextButton)
    contentDiv.appendChild(titleDiv)
    let removeTitleButton = document.createElement('button');
    removeTitleButton.textContent = 'Remove Title/Section';
    removeTitleButton.addEventListener('click', removeItem);
    titleDiv.appendChild(removeTitleButton);


}



function addSubtext(event) {
    event.preventDefault();
    let addButton = event.target;
    let parentDiv = addButton.parentNode;
    let subtextDiv = document.createElement('div');
    subtextDiv.setAttribute('class', 'subDiv');
    let subtextLabel = document.createElement('label');
    subtextLabel.textContent = 'Subtext: ';
    let subtextText = document.createElement('input');
    subtextText.setAttribute("name", "subtext");
    subtextText.setAttribute("class", "subtext");
    subtextLabel.appendChild(subtextText);
    subtextDiv.appendChild(subtextLabel);
    parentDiv.appendChild(subtextDiv);
    let addTextButton = document.createElement('button');
    addTextButton.setAttribute('class', 'addTextButton');
    addTextButton.textContent = 'Add Text';
    addTextButton.addEventListener('click', addText, false);
    subtextDiv.appendChild(addTextButton);
    let removeSubtextButton = document.createElement('button');
  removeSubtextButton.textContent = 'Remove Subtext/Section';
  removeSubtextButton.addEventListener('click', removeItem);
  subtextDiv.appendChild(removeSubtextButton);

}

function addText(event) {
    event.preventDefault();
    let addButton = event.target;
    let parentDiv = addButton.parentNode;
    let textDiv = document.createElement('div');
    textDiv.setAttribute('class', 'textDiv');
    let textLabel = document.createElement('label');
    textLabel.textContent = 'Text: ';
    let textText = document.createElement('input');
    textText.setAttribute("name", "text");
    textText.setAttribute("class", "text");
    textLabel.appendChild(textText);
    textDiv.appendChild(textLabel);
    parentDiv.appendChild(textDiv);
    let removeTextButton = document.createElement('button');
  removeTextButton.textContent = 'Remove Text';
  removeTextButton.addEventListener('click', removeItem);
  textDiv.appendChild(removeTextButton);

}

function removeItem(event) {
    event.preventDefault();
    let removeButton = event.target;
    let parentDiv = removeButton.parentNode;
    parentDiv.remove();
}

function storeMainContent() {
    let form = document.getElementById('mainContentDiv');
    let titleDivs = form.getElementsByClassName('titleDiv');
    let mainContent = [];

    Array.from(titleDivs).forEach(titleDiv => {
        let title = titleDiv.getElementsByClassName('titletext')[0].value;
        let subDivs = titleDiv.getElementsByClassName('subDiv');
        let subContent = [];

        Array.from(subDivs).forEach(subDiv => {
            let subText = subDiv.getElementsByClassName('subtext')[0].value;
            let textDivs = subDiv.getElementsByClassName('textDiv');
            let textContent = [];

            Array.from(textDivs).forEach(textDiv => {
                let text = textDiv.getElementsByClassName('text')[0].value;
                textContent.push(text);
            });

            subContent.push([subText, textContent]);
        });

        mainContent.push([title, subContent]);
    });

    return mainContent;
}
function removeMainContentAddButtons(){
    let addSectionButton = document.getElementById('addSectionButton')
    addSectionButton.remove()
    let addSubtextButtons = document.getElementsByClassName('addSubtextButton')
    while (addSubtextButtons.length > 0){
        addSubtextButtons[0].remove()
    }
    let addTextButtons = document.getElementsByClassName('addTextButton')
    while (addTextButtons.length > 0){
        addTextButtons[0].remove()
    }
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

function disableNavBar(){
    let navBarDiv = document.getElementById('navBar')
    navBarDiv.style.display = "none";
}
function enableNavBar(){
    let navBarDiv = document.getElementById('navBar')
    navBarDiv.style.display = "block";
}

