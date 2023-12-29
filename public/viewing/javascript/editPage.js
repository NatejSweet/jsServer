

function savePage(){
    enableNavBar();
    if (document.getElementById('pageTitle')){
        let hubName = document.getElementById('pageTitle').textContent;
        removeSaveButton();
        removeCancelButton();
        removeMainContentAddButtons();
        let content = storeMainContent();
        pagesJSON[hubName] = content;
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
        removeCancelButton();
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
        viewMainPage()
    }
    if (editMode){
        enterEditMode();
    }
}
function removeSaveButton(){
    let saveButton = document.getElementById('saveButton')
    saveButton.remove()
}

function removeCancelButton(){
    let cancelButton = document.getElementById('cancelButton')
    cancelButton.remove()
}
function editPage() {       // this function can be optimized, at least reduce the length of function
    disableNavBar();
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.innerHTML = ''
    addSaveButton();
    addCancelButton();
    addAddSectionButton();
    const titleDivs = document.querySelectorAll('.titleDiv')
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
        titleLabel.appendChild(addSubtextButton)
        let removeTitleButton = document.createElement('button');
        removeTitleButton.textContent = 'Remove Title/Section';
        removeTitleButton.addEventListener('click', removeItem);
        titleLabel.appendChild(removeTitleButton);
        let subtitleDivs = Array.from(titleDiv.getElementsByClassName('subTitleDiv'))
        subtitleDivs.forEach(subtitleDiv =>{
            console.log('subdiv')
            let subtitle = subtitleDiv.getElementsByClassName('subTitleText')
            let subtitleLabel = document.createElement('label')
            subtitleLabel.textContent = 'Subtitle: '
            let subtitleText = document.createElement('input')
            subtitleText.setAttribute("name", "subtitle")
            subtitleText.setAttribute('class', 'subtext')
            subtitleText.value = subtitle[0].textContent
            subtitleLabel.appendChild(subtitleText)
            subtitle[0].replaceWith(subtitleLabel)
            let addTextButton = document.createElement('button')
            addTextButton.setAttribute('class', 'addTextButton')
            addTextButton.textContent = 'Add Text'
            addTextButton.addEventListener('click', addText, false);
            subtitleLabel.appendChild(addTextButton)
            let removeSubtitleButton = document.createElement('button');
            removeSubtitleButton.textContent = 'Remove Subtitle/Section';
            removeSubtitleButton.addEventListener('click', removeItem);
            subtitleLabel.appendChild(removeSubtitleButton);
            let textDivs = Array.from(subtitleDiv.getElementsByClassName('textDiv'))
            
            textDivs.forEach(textDiv =>{
                let text = textDiv.getElementsByClassName('text')
                console.log(text)
                let textLabel = document.createElement('label')
                textLabel.textContent = 'Text: '
                let textInput = document.createElement('input')
                textInput.setAttribute("name", "text")
                textInput.setAttribute('class', 'text')
                textInput.value = text[0].textContent
                console.log(textInput)
                console.log(text[0])
                textLabel.appendChild(textInput)
                text[0].replaceWith(textLabel)
                let removeTextButton = document.createElement('button');
                removeTextButton.textContent = 'Remove Text';
                removeTextButton.addEventListener('click', removeItem);
                textLabel.appendChild(removeTextButton);
            })


        })

    })
}

function cancelEdit(){
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.innerHTML = ''
    enableNavBar();
    reloadContents(editMode=true);
}

function addSaveButton(){
    let saveButton = document.createElement('button')
    saveButton.setAttribute('id', 'saveButton')
    saveButton.setAttribute('onclick', 'savePage()')
    saveButton.appendChild(document.createTextNode('Save Page'))
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.appendChild(saveButton)
}

function addCancelButton(){
    let cancelButton = document.createElement('button')
    cancelButton.setAttribute('id', 'cancelButton')
    cancelButton.setAttribute('onclick', 'cancelEdit()')
    cancelButton.appendChild(document.createTextNode('Cancel'))
    let header = document.querySelector('header')
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.appendChild(cancelButton)
}

function addAddSectionButton(){
    let addSectionButton = document.createElement('button')
    addSectionButton.setAttribute('id', 'addSectionButton')
    addSectionButton.setAttribute('class', 'addSectionButton')
    addSectionButton.setAttribute('onclick', 'addTitle()')
    addSectionButton.appendChild(document.createTextNode('Add Section'))
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.appendChild(addSectionButton)
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
    titleLabel.appendChild(addSubtextButton)
    contentDiv.appendChild(titleDiv)
    let removeTitleButton = document.createElement('button');
    removeTitleButton.textContent = 'Remove Title/Section';
    removeTitleButton.addEventListener('click', removeItem);
    titleDiv.appendChild(removeTitleButton);


}



function addSubtext(event) {
    event.preventDefault();
    let addButton = event.target;
    let titleLabel = addButton.parentNode;
    let parentDiv = titleLabel.parentNode;
    let subtextDiv = document.createElement('div');
    subtextDiv.setAttribute('class', 'subTitleDiv');
    let subtextLabel = document.createElement('label');
    subtextLabel.textContent = 'Subtext: ';
    let subtext = document.createElement('input');
    subtext.setAttribute("name", "subtext");
    subtext.setAttribute("class", "subtext");
    subtextLabel.appendChild(subtext);
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
  subtextLabel.appendChild(removeSubtextButton);

}

function addText(event) {
    event.preventDefault();
    let addButton = event.target;
    let parentDiv = addButton.parentNode
    let textDiv = document.createElement('div');
    textDiv.setAttribute('class', 'textDiv');
    let textLabel = document.createElement('label');
    textLabel.textContent = 'Text: ';
    let text = document.createElement('input');
    text.setAttribute("name", "text");
    text.setAttribute("class", "text");
    textLabel.appendChild(text);
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
    let parentDiv = removeButton.parentNode.parentNode;
    parentDiv.remove();
}

function storeMainContent() {
    let form = document.getElementById('mainContentDiv');
    let titleDivs = form.getElementsByClassName('titleDiv');
    let mainContent = [];

    Array.from(titleDivs).forEach(titleDiv => {
        let title = titleDiv.getElementsByClassName('titletext')[0].value;
        let subDivs = titleDiv.getElementsByClassName('subTitleDiv');
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

function disableNavBar(){
    let navBarDiv = document.getElementById('navBar')
    navBarDiv.style.display = "none";
}
function enableNavBar(){
    let navBarDiv = document.getElementById('navBar')
    navBarDiv.style.display = "block";
}

