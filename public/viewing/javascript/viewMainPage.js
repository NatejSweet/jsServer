
var pagesJSON = {};
var mapMarkers = {};
var mainPageJSON = {};
var navItems = {};
var img1Id = null;
var img2Id = null;
document.addEventListener('DOMContentLoaded', function() {
    viewMainPage();
});
function viewMainPage() {
    let worldName = document.getElementById("worldName");


    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    fetch('/viewMainPage?id=' + encodeURIComponent(id))
        .then(response => {
            if (response.ok) {
                console.log(response)
                return response.json();
            }
        }).then(content => {
            pagesJSON = content.pages;
            mapMarkers = content.mapMarkers;
            worldName.innerHTML = content.worldName;
            mainPageJSON = content.mainPageJSON;
            navItems = content.navItems;
            img1Id = content.img1Id;
            img2Id = content.img2Id;
            var public = content.public;
            console.log(content.public)
            if (!document.getElementById('editModeButton') && !document.getElementById('editPageButton')&& content.editAccess){
                createEditButton(public);
            }
            fillMainContent(mainPageJSON);
            fillNavBar(navItems);
            fillMap(img1Id, img2Id);

        });
}

function reloadNavBar() { //probably want to create a specific request for this later
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('reloading nav bar')
    fetch('/viewMainPage?id=' + encodeURIComponent(id))
        .then(response => {
            if (response.ok) {
                console.log(response)
                return response.json();
            }
        }).then(content => {
            navItems = content.navItems;
            fillNavBar(navItems);
        })
}
            
function fillMainContent(mainPage, pageName) {
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
        titleDiv.appendChild(titleText);
        title[1].forEach(subTitle => {
            let subTitleDiv = document.createElement('div');
            subTitleDiv.setAttribute('class', 'subTitleDiv');
            let subTitleText = document.createElement('h3')
            subTitleText.setAttribute('class', 'subTitleText');
            subTitleText.appendChild(document.createTextNode(subTitle[0]));
            subTitleDiv.appendChild(subTitleText);
            subTitle[1].forEach(text => {
                let textDiv = document.createElement('div');
                textDiv.setAttribute('class', 'textDiv');
                let textP= document.createElement('p')
                textP.setAttribute('class', 'text');
                textP.appendChild(document.createTextNode(text));
                textDiv.appendChild(textP);
                subTitleDiv.appendChild(textDiv);
            }
            );
            titleDiv.appendChild(subTitleDiv);
        });
        mainContentDiv.appendChild(titleDiv);
    });


}

function fillNavBar(navItems){
    let list = document.createElement('ul')
    let nav = document.getElementById("navBar");
    nav.innerHTML = '';
    nav.style.display = 'block'
    Object.keys(navItems).forEach(name => {
        let li = document.createElement('li')
        let dropDownDiv = document.createElement('div')
        dropDownDiv.setAttribute('class', 'dropdown')
        let select = document.createElement('select')
        select.setAttribute('id', name)  
        select.setAttribute('class', 'dropbtn')
        select.setAttribute('onchange', 'loadHub(this.value)')
        let defaultOption = document.createElement('option')
        defaultOption.setAttribute('value', name)
        defaultOption.appendChild(document.createTextNode(name))
        defaultOption.setAttribute('selected', 'selected')
        defaultOption.setAttribute('hidden','hidden')
        select.appendChild(defaultOption)
        
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
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');       
    let mapDiv = document.getElementById("mapDiv");
    mapDiv.innerHTML = '';
    let img1 = document.createElement('img')
    img1.setAttribute('id', 'map1Img')
    img1.setAttribute('usemap', '#map1')
    let map1 = document.createElement('map')
    map1.setAttribute('name', 'map1')
    let img2 = document.createElement('img')
    img2.setAttribute('id', 'map2Img')
    let img1Button = document.createElement('button')
    img1Button.textContent = 'Main Map'
    img1Button.setAttribute('class', 'imgControlButton')
    img1Button.addEventListener('click', () =>{
        if (img1.style.display == 'block'){
            return
        }
        else{
            img1.style.display = 'block' 
            img2.style.display = 'none'
        }
    })
    let img2Button = document.createElement('button')
    img2Button.textContent = 'Secondary Map'
    img2Button.setAttribute('class','imgControlButton')
    img2Button.addEventListener('click', () =>{
        if (img2.style.display == 'block'){
            return
        }
        else{
            img2.style.display = 'block'
            img1.style.display = 'none'
        }
    })

    fetch('/viewImage?imgId=' + encodeURIComponent(img1Id))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        }).then(content => {
            img1.setAttribute('src', content.src);
        });
    if (img2Id != null){
        fetch('/viewImage?imgId=' + encodeURIComponent(img2Id))
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then(content => {
                img2.setAttribute('src', content.src);
                img2.style.display = 'none'
            });
        }
    fetch('/mapMarkers?id=' + encodeURIComponent(id))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(content => {
            mapMarkers = content.mapMarkersJSON
            Object.keys(mapMarkers).forEach(hub => {
                mapMarkers[hub].forEach(marker => {
                    let x = marker[0] *img1.width
                    let y = marker[1] * img1.height
                    let r = marker[2] *img1.width
                    let area = document.createElement('area')
                    area.setAttribute('shape', 'circle')
                    area.setAttribute('coords', x + ',' + y+ ',' + r)
                    area.setAttribute('href', '#')
                    area.setAttribute('title', hub)
                    area.setAttribute('class', 'mapMarker')
                    area.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default action
                        loadHub(hub);
                    })
                    map1.appendChild(area);
                })
            })
        });
    mapDiv.appendChild(img1Button)
    mapDiv.appendChild(img2Button)
    mapDiv.appendChild(document.createElement('br'))
    mapDiv.appendChild(img1)
    mapDiv.appendChild(map1)
    mapDiv.appendChild(img2)
}
    
function loadHub(hubName){
    console.log(pagesJSON)
    let hub = pagesJSON[hubName];
    fillMainContent(hub.content, hubName);
    fillMap(img1Id, hub.imgId);
    // if (!document.getElementById('editModeButton') && !document.getElementById('editPageButton')){
    //     createEditButton();
    // }
}

function updateMap(imgId){
    let img = document.getElementById('map2Img')
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



