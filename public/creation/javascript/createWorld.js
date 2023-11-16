var mainContentStorage = [];
var mainImage = null;
var secondaryImage = null;
var mapImageStorage = [{"id":mainImage, "src":""}, {"id":secondaryImage, "src":""}];
var navItemStorage = [];
var worldName = null;
document.addEventListener("DOMContentLoaded",function(event){
    addTitle(event)
    let addTitleButton = document.getElementById('titleaddButton')
    addButton.addEventListener('click',addTitle,false)
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
    let titleLabel = document.createElement('label')
    titleLabel.textContent = 'Title: '
    let titleText = document.createElement('input')
    titleText.setAttribute("name", "title")
    titleText.setAttribute("class", "title")
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
function submitMainPage() {
    // Gather the data
    const worldName = storeWorldName();
    const navItems = storeNavItems();
    const mainImages = storeMainImages();
    const mainContent = storeMainContent();
  
    // Create the world object
    const world = {
      name: worldName,
      navItems: navItems,
      images: mainImages,
      content: mainContent
    };
  
    // Send the POST request
    fetch('/createWorld', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(world)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      location.assign('./fillNavs.html');
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }

function readURL(input,imgId){
    if (input.files && input.files[0]){
        if (input.files[0].size > 4 * 1024 * 1024) {
            alert("File size exceeds 4 MB limit.");
            return;
        }
        var reader = new FileReader();
        reader.onload=function (e){
            console.log('hi')
            img = document.getElementById(imgId)
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
function storeMainImages() {
    let mainMapImg = document.getElementById('mainImage');
    let secondaryMapImg = document.getElementById('secondaryImage');
    let mainMapImgSrc = mainMapImg.getAttribute('src');
    let secondaryMapImgSrc = secondaryMapImg.getAttribute('src');
    let mapImageSrc = {
        mainMapImgSrc: mainMapImgSrc,
        secondaryMapImgSrc: secondaryMapImgSrc
    };
    return mapImageSrc;
};

function storeWorldName(){
    worldName = document.getElementById('worldName').value
    return worldName
}

function storeNavItems(){
    let navItems = document.getElementsByName('navItem')
    navItems.forEach( item => {
        
        navItemStorage.push(item.value)
    })
    return navItemStorage;
}

// Define the data structure
const dataStructure = [
    ['Title 1', [
        ['Subtext 1', ['Text 1', 'Text 2', 'Text 3']],
        ['Subtext 2', ['Text 4', 'Text 5', 'Text 6']]
    ]],
    ['Title 2', [
        ['Subtext 3', ['Text 7', 'Text 8', 'Text 9']],
        ['Subtext 4', ['Text 10', 'Text 11', 'Text 12']]
    ]]
];

// Retrieve the main text
const mainText = dataStructure.reduce((acc, curr) => {
    const subTexts = curr[1].map(subArr => subArr[1].join(' ')).join(' ');
    return `${acc} ${curr[0]} ${subTexts}`;
}, '');

console.log(mainText); // Output: "Title 1 Text 1 Text 2 Text 3 Text 4 Text 5 Text 6 Title 2 Text 7 Text 8 Text 9 Text 10 Text 11 Text 12"
