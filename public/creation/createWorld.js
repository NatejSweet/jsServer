var mainContentStorage = [];
var mainImage = null;
var secondaryImage = null;
var mapImageStorage = [{"id":mainImage, "src":""}, {"id":secondaryImage, "src":""}];
var navItemStorage = [];
var worldName = null;
// In main.js
if (window.location.pathname === '/') {
    // Your main.js code here
document.addEventListener("DOMContentLoaded",function(event){
    generateForm(event)
    let addButton = document.getElementById('addButton')
    addButton.addEventListener('click',generateForm,false)
    let addNavButton = document.getElementById('navAddButton')
    addNavButton.addEventListener('click',createNavItem,false)
})
document.addEventListener("DOMContentLoaded",function (){
    document.getElementById('submitButton').addEventListener('click',submitMainPage)
    
})

}



function generateForm(){
    let form = document.createElement('div')
    form.setAttribute('name','form')
    let titleDiv = document.createElement('div')
    let titleText = document.createElement('input')
    titleText.setAttribute("name","title")
    titleText.setAttribute("class","title")
    titleDiv.appendChild(titleText);
    let textDiv = document.createElement('div')
    let textText = document.createElement('input')
    textText.setAttribute("name","text")
    textText.setAttribute("class","text")
    textDiv.appendChild(textText);
    let subtextDiv = document.createElement('div')
    let subtextText = document.createElement('input')
    subtextText.setAttribute("name","subtext")
    subtextText.setAttribute("class","subtext")
    subtextDiv.appendChild(subtextText)
    form.appendChild(titleDiv)
    form.appendChild(textDiv)
    form.appendChild(subtextDiv)
    let main= document.querySelector('main')
    if (main){
    main.appendChild(form)
    }

}
function createNavItem(){
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
function submitMainPage(){
    storeWorldName()
    storeNavItems()
    storeMainImages()
    storeMainContent()
    // location.assign('./fillNavs.html')

}

function readURL(input,imgId){
    if (input.files && input.files[0]){
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
    dbVersion = 1;
    const request = window.indexedDB.open("mapDatabase", dbVersion);
    request.onerror = (event) => {
        console.log("database open error");
    };
    request.onupgradeneeded = (event) => {
        console.log("database upgraded");
        db = event.target.result;
        const objectStore = db.createObjectStore("mapStore", { keyPath: "id" });
        objectStore.createIndex("src","src", { unique: false });
    };
    request.onsuccess = (event) => {
        console.log("database opened")
        db = event.target.result;
        const mapStore = db
            .transaction("mapStore", "readwrite")
            .objectStore("mapStore");
        mapImageStorage.forEach((map) => {
            mapStore.add(map);
        });
    };
};

function storeWorldName(){
    worldName = document.getElementById('worldName').value
    localStorage.setItem('worldName', JSON.stringify(worldName))
}

function storeNavItems(){
    let navItems = document.getElementsByName('navItem')
    navItems.forEach( item => {
        
        navItemStorage.push(item.value)
    })
    localStorage.setItem('navItemStorage', JSON.stringify(navItemStorage));
}

function storeMainContent(){
    let mainContent = document.getElementsByName('form')
    
    mainContent.forEach(content => {
        var visit = new createJson({//broken here, need to access title,text and subtext in the div
            title: content.querySelector('.title').value,
        text: content.querySelector('.text').value,
        subtext: content.querySelector('.subtext').value
            
    });
    mainContentStorage.push(visit)
    localStorage.setItem('mainContentStorage', JSON.stringify(mainContentStorage));
    
    
})
}
