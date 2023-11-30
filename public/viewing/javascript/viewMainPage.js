
// const { text } = require("express");
var pagesJSON = {};
document.addEventListener('DOMContentLoaded', function() {
    viewMainPage();
});
function viewMainPage() {
    let worldName = document.getElementById("worldName");
    let navBar = document.getElementById("navBarDiv");
    let mapDiv = document.getElementById("mapDiv");

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch('/viewMainPage?id=' + encodeURIComponent(id))
        .then(response => {
            if (response.ok) {
                console.log(response)
                return response.json();
            }
        }).then(content => {
            console.log(content);
            worldName.innerHTML = content.worldName;
            fillMainContent(content.mainPageJSON);
            fillNavBar(content.navNames, content.navItems);
            fillMap(content.img1Id, content.img2Id);
            setPages(content.pages);
        });
}
function fillMainContent(mainPage, pageName) {
    console.log(pageName)
    let mainContentDiv = document.getElementById("mainContentDiv");
    mainContentDiv.innerHTML = '';
    if (pageName) {
       let pageTitle = document.createElement('h1');
       pageTitle.setAttribute('id', 'pageTitle');
         pageTitle.appendChild(document.createTextNode(pageName));
            mainContentDiv.appendChild(pageTitle);
    }
    mainPage.forEach(title => {
        let titleDiv = document.createElement('div');
        titleDiv.setAttribute('class', 'titleDiv');
        let titleText = document.createElement('h2')
        titleText.setAttribute('class', 'titleText');
        titleText.appendChild(document.createTextNode(title[0]));
        // titleText.setAttribute('class', 'titleText');
        titleDiv.appendChild(titleText);
        title[1].forEach(subTitle => {
            let subTitleDiv = document.createElement('div');
            subTitleDiv.setAttribute('class', 'subTitleDiv');
            let subTitleText = document.createElement('h3')
            subTitleText.setAttribute('class', 'subTitleText');
            subTitleText.appendChild(document.createTextNode(subTitle[0]));
            // subTitleText.setAttribute('class', 'subTitleText');
            subTitleDiv.appendChild(subTitleText);
            subTitle[1].forEach(text => {
                let textDiv = document.createElement('div');
                textDiv.setAttribute('class', 'textDiv');
                let textText = document.createElement('p')
                textText.setAttribute('class', 'textText');
                textText.appendChild(document.createTextNode(text));
                // textText.setAttribute('class', 'textText');
                textDiv.appendChild(textText);
                subTitleDiv.appendChild(textDiv);
            }
            );
            titleDiv.appendChild(subTitleDiv);
        });
        mainContentDiv.appendChild(titleDiv);
    });


}

function fillNavBar(navNames, navItems){
    console.log(navItems)
    let list = document.createElement('ul')
    let nav = document.getElementById("navBar");
    navNames.forEach(name => {
        let li = document.createElement('li')
        let dropDownDiv = document.createElement('div')
        dropDownDiv.setAttribute('class', 'dropdown')
        let select = document.createElement('select')
        select.setAttribute('id', name)
        select.setAttribute('class', 'dropbtn')
        select.setAttribute('onchange', 'loadHub(this.value)')
        navItems[name].forEach(item => {
            let option = document.createElement('option')
            option.setAttribute('value', item)
            option.appendChild(document.createTextNode(item))
            select.appendChild(option)
        })
        li.appendChild(select)
        list.appendChild(li)
    });
    nav.appendChild(list)
}
function fillMap(img1Id, img2Id){
    let mapDiv = document.getElementById("mapDiv");
    let img1 = document.createElement('img')
    img1.setAttribute('id', 'map1Img')
    let img2 = document.createElement('img')
    img2.setAttribute('id', 'map2Img')
    console.log(img1Id,img2Id)
    fetch('/viewImage?imgId=' + encodeURIComponent(img1Id))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(content => {
            img1.setAttribute('src', content.src);
        });
    fetch('/viewImage?imgId=' + encodeURIComponent(img2Id))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(content => {
            img2.setAttribute('src', content.src);
        });
    mapDiv.appendChild(img1);
    mapDiv.appendChild(img2);
}
function setPages(pages){
    console.log(pages)
    pagesJSON = pages
}
    
function loadHub(hubName){
    let hub = pagesJSON[hubName];
    fillMainContent(hub.content, hubName);
    updateMap(hub.imgId);
    addEditButton();
}

function updateMap(imgId){
    let img = document.getElementById('map1Img')
    if (imgId == null){
        img.setAttribute('src', '#')
        return;
    }
    fetch('/viewImage?imgId=' + encodeURIComponent(imgId))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(content => {
            img.setAttribute('src', content.src);
        });
}
function addEditButton(){
    let editButton = document.createElement('button')
    editButton.setAttribute('id', 'editButton')
    editButton.setAttribute('onclick', 'editPage()')
    editButton.appendChild(document.createTextNode('Edit Page'))
    let header = document.querySelector('header')
    header.appendChild(editButton)

}

function removeEditButton(){
    let editButton = document.getElementById('editButton')
    editButton.remove()
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
    let hubName = document.getElementById('pageTitle').textContent;
    addEditButton();
    removeSaveButton();
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
            return reloadContents();
        }
    })
    //post function w/ event.preventDefault(), UPDATE worlds SET pages=? WHERE id = ? AND ownerId = ?
}
function reloadContents(){
    loadHub(document.getElementById('pageTitle').textContent)
}
function removeSaveButton(){
    let saveButton = document.getElementById('saveButton')
    saveButton.remove()
}
function editPage() {
    removeEditButton();
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
