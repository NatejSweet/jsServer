

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
                // return reloadContents(editMode=true);
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
                // return reloadContents(editMode=true);
            }
        })
    }
    if (document.getElementsByClassName('newImage').length > 0){
        console.log('updating images')
        let newImages = document.getElementsByClassName('newImage')
        Array.from(newImages).forEach(newImage => {
            let imgId = null;
            let imgSrc = newImage.src
            if (document.getElementById('pageTitle')){
                let hubName = document.getElementById('pageTitle').textContent
                let imgId = pages[hubName].imgId
                fetch('/updateImage?imgId=' + encodeURIComponent(imgId),{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:  JSON.stringify({src: imgSrc})
                }).then(response => {
                    if (response.ok) {
                        return reloadContents(editMode=true);
                    }
                })
            }else{
                if(newImage.id == 'map1Img'){
                    imgId = img1Id
                }else{
                    imgId = img2Id
                }
                fetch('/updateImage?imgId=' + encodeURIComponent(imgId),{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body:  JSON.stringify({src: imgSrc})
                }).then(response => {
                    if (response.ok) {
                        return reloadContents(editMode=true);
                    }
                })
            }

        })
    }else{
        reloadContents(editMode=true);
    }
}
function reloadContents(editMode){
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
    addUpdateMapImageButton();
    const titleDivs = document.querySelectorAll('.titleDiv')
    titleDivs.forEach(titleDiv => {
        let title = titleDiv.getElementsByClassName('titletext')
        let newTitleDiv = addTitle(title[0].innerHTML)
        titleDiv.replaceWith(newTitleDiv)
        let subtitleDivs = Array.from(titleDiv.getElementsByClassName('subTitleDiv'))
        subtitleDivs.forEach(subtitleDiv =>{
            let subtitle = subtitleDiv.getElementsByClassName('subTitleText')
            let newSubtitleDiv = addSubtext(subtitle[0].innerHTML)
            newTitleDiv.appendChild(newSubtitleDiv)
            let textDivs = Array.from(subtitleDiv.getElementsByClassName('textDiv'))
            textDivs.forEach(textDiv =>{
                let text = textDiv.getElementsByClassName('text')
                let newTextDiv = addText(text[0].innerHTML)
                newSubtitleDiv.appendChild(newTextDiv)
            })


        })

    })
}
function addTitle(text){        //when implimenting these in the editPage function, create an optional argument for pre-filled data
    // let contentDiv = document.getElementById('mainContentDiv')
    let titleDiv = document.createElement('div')
    titleDiv.setAttribute('class','titleDiv')
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title: '
    let titleText = document.createElement('input')
    if (text){
        titleText.value = text
    }
    titleText.setAttribute("name", "title")
    titleText.setAttribute("class", "titletext")
    titleLabel.appendChild(titleText)
    let addSubtextButton = document.createElement('button')
    addSubtextButton.setAttribute('id','subtextAddButton')
    addSubtextButton.textContent = 'Add Subtext'
    addSubtextButton.addEventListener('click',function() {
        titleDiv.appendChild(addSubtext())
    },false)
    titleDiv.appendChild(titleLabel)
    titleLabel.appendChild(addSubtextButton)
    // contentDiv.appendChild(titleDiv)
    let removeTitleButton = document.createElement('button');
    removeTitleButton.textContent = 'Remove Title/Section';
    removeTitleButton.addEventListener('click', removeItem);
    titleDiv.appendChild(removeTitleButton);
    return titleDiv 
}

function addSubtext(text) {
    // let addButton = event.target;
    // let titleLabel = addButton.parentNode;
    // let parentDiv = titleLabel.parentNode;
    let subtextDiv = document.createElement('div');
    subtextDiv.setAttribute('class', 'subTitleDiv');
    let subtextLabel = document.createElement('label');
    subtextLabel.textContent = 'Subtext: ';
    let subtext = document.createElement('input');
    if (text){
        subtext.value = text
    }
    subtext.setAttribute("name", "subtext");
    subtext.setAttribute("class", "subtext");
    subtextLabel.appendChild(subtext);
    subtextDiv.appendChild(subtextLabel);
    // parentDiv.appendChild(subtextDiv);
    let addTextButton = document.createElement('button');
    addTextButton.setAttribute('class', 'addTextButton');
    addTextButton.textContent = 'Add Text';
    addTextButton.addEventListener('click', function() {
        subtextDiv.appendChild(addText());
    }, false);
    subtextDiv.appendChild(addTextButton);
    let removeSubtextButton = document.createElement('button');
    removeSubtextButton.textContent = 'Remove Subtext/Section';
    removeSubtextButton.addEventListener('click', removeItem);
    subtextLabel.appendChild(removeSubtextButton);
    return subtextDiv

}

function addText(inputText) {
    let textDiv = document.createElement('div');
    textDiv.setAttribute('class', 'textDiv');
    let textLabel = document.createElement('label');
    textLabel.textContent = 'Text: ';
    let text = document.createElement('input');
    if (inputText){
        text.value = inputText
    }
    text.setAttribute("name", "text");
    text.setAttribute("class", "text");
    textLabel.appendChild(text);
    textDiv.appendChild(textLabel);
    let removeTextButton = document.createElement('button');
    removeTextButton.textContent = 'Remove Text';
    removeTextButton.addEventListener('click', removeItem);
    textDiv.appendChild(removeTextButton);
    return textDiv
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
    addSectionButton.addEventListener('click',function() {
        let mainContentDiv = document.getElementById('mainContentDiv')
        mainContentDiv.appendChild(addTitle())
    },false)
    addSectionButton.appendChild(document.createTextNode('Add Section'))
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.appendChild(addSectionButton)
}

function addUpdateMapImageButton(){
    let updateMapImageButton = document.createElement('button')
    updateMapImageButton.setAttribute('id', 'updateMapImageButton')
    updateMapImageButton.setAttribute('class', 'updateMapImageButton')
    updateMapImageButton.setAttribute('onclick', 'updateMapImage()')
    updateMapImageButton.appendChild(document.createTextNode('Update Map Image'))
    let editButtonsDiv = document.getElementById('editButtonsDiv')
    editButtonsDiv.appendChild(updateMapImageButton)
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
// var mapImageStorage = [{"id":mainImage, "src":""}, {"id":secondaryImage, "src":""}];

function updateMapImage(){
    let mapDiv = document.getElementById('mapDiv')
    let mainContentDiv = document.getElementById('mainContentDiv')
    if (document.getElementById('pageTitle')){   //if updating image on a hub
        //disable main image
        //enable secondary image
        let inputButton = document.createElement('input')
        inputButton.setAttribute('id', 'secondaryMap')
        inputButton.setAttribute('type', 'file')
        inputButton.setAttribute('accept', '.img,.jpg,.jpeg')
        inputButton.setAttribute('onchange', 'readURL(this,map2Img);')
        mapDiv.appendChild(inputButton)
        //access pages[hubName].imgId
    }
    else{       //if updating an image on main page
        //disable secondary image
        //enable main image
        let inputButton = document.createElement('input')
        inputButton.setAttribute('id', 'mainMap')
        inputButton.setAttribute('type', 'file')
        inputButton.setAttribute('accept', '.img,.jpg,.jpeg')
        inputButton.setAttribute('onchange', 'readURL(this,"map1Img");')
        mapDiv.appendChild(inputButton)
        //create buttons to allow user to choose which image to update
    }
}

window.readURL = function(input,imgId){
    if (input.files && input.files[0]){
        if (input.files[0].size > 4 * 1024 * 1024) {
            alert("File size exceeds 4 MB limit.");
            return;
        }
        var reader = new FileReader();
        reader.onload=function (e){
            let img = document.getElementById(imgId)
            img.setAttribute('src',e.target.result)
            img.setAttribute('class','newImage')
        };
        reader.readAsDataURL(input.files[0]);
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

