import {createFillNavsPage} from './fillNavs.js'
var mainImage = null;
var secondaryImage = null;
var mapImageStorage = [{"id":mainImage, "src":""}, {"id":secondaryImage, "src":""}];
var navItemStorage = [];

document.addEventListener("DOMContentLoaded",function(event){
    addTitle(event)
    let addTitleButton = document.getElementById('addButton')
    addTitleButton.addEventListener('click',addTitle,false)
    let addNavButton = document.getElementById('navAddButton')
    addNavButton.addEventListener('click',createNavItem,false)
    let removeNavButton = document.getElementById('navRemoveButton')
    removeNavButton.addEventListener('click',removeNavItem,false)
})
document.addEventListener("DOMContentLoaded",function (){
    document.getElementById('submitButton').addEventListener('click',submitMainPage)
})

function addTitle(event){
    event.preventDefault();
    let form = document.getElementById('mainContentForm')
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
    form.appendChild(titleDiv)
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

function removeNavItem(event){
    event.preventDefault();
    let ul = document.getElementById('navbar')
    let li = ul.lastChild
    ul.removeChild(li)

}

function createNavItem(event){
    event.preventDefault();
    let ul = document.getElementById('navbar')
    // <li><input type='text' name='navItem'></li>
    let li = document.createElement('li')
    let input = document.createElement('input')
    input.setAttribute('name','navItem')
    li.appendChild(input)
    ul.appendChild(li)
}
function createJson(obj) {
    this.title = obj.title;
    this.text = obj.text;
    this.subtext = obj.subtext;
}
window.readURL = function(input,imgId){
    console.log('reading url')
    if (input.files && input.files[0]){
        if (input.files[0].size > 4 * 1024 * 1024) {
            alert("File size exceeds 4 MB limit.");
            return;
        }
        var reader = new FileReader();
        reader.onload=function (e){
            console.log('hi')
            let img = document.getElementById(imgId)
            img.setAttribute('src',e.target.result)
            if (imgId === 'mainImage'){
                mapImageStorage[0].name = imgId
                mapImageStorage[0].src = e.target.result
            }
            else if (imgId === 'secondaryImage'){
                mapImageStorage[1].name = imgId
                mapImageStorage[1].src = e.target.result
            }
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function submitMainPage(event) {
    event.preventDefault(); // Prevent page reload

    // Gather the data
    const worldName = storeWorldName();
    const navItems = storeNavItems();
    const mainImages = storeMainImages();
    const mainContent = storeMainContent();

    // Create the world object
    const world = {
        name: worldName,
        content: mainContent,
        images: mainImages,
        navItems: navItems
    };

    // Send the data to the server
    fetch('/createworld', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(world)
    }).then(response => {
        if (response.ok) {
            return createFillNavsPage();
        }
    })
}

function storeMainContent() {
    let form = document.getElementById('mainContentForm');
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

function storeMainImages() {
    let mainMapImg = document.getElementById('mainMapImg');
    let secondaryMapImg = document.getElementById('secondaryMapImg');
    let mainMapImgSrc = mainMapImg.getAttribute('src');
    let secondaryMapImgSrc = secondaryMapImg.getAttribute('src');
    let mapImageSrc = [mainMapImgSrc,secondaryMapImgSrc]
    return mapImageSrc;
};

function storeWorldName() {
    let worldName = document.getElementById('worldName').value;
    return worldName;
}

function storeNavItems(){
    let navItems = document.getElementsByName('navItem')
    
    navItems.forEach( item => {
        
        navItemStorage.push(item.value)
    })
    return navItemStorage;
}

