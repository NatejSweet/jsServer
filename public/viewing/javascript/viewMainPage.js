
var pagesJSON = {};
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
            setPages(content.pages);
            worldName.innerHTML = content.worldName;
            fillMainContent(content.mainPageJSON);
            fillNavBar(content.navNames, content.navItems);
            fillMap(content.img1Id, content.img2Id);
        });
    createEditButton();
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
            console.log(content);
            fillNavBar(content.navNames, content.navItems);
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

function fillNavBar(navNames, navItems){
    let list = document.createElement('ul')
    let nav = document.getElementById("navBar");
    nav.innerHTML = '';
    navNames.forEach(name => {
        let li = document.createElement('li')
        let dropDownDiv = document.createElement('div')
        dropDownDiv.setAttribute('class', 'dropdown')
        let select = document.createElement('select')
        select.setAttribute('id', name)  
        select.setAttribute('class', 'dropbtn')
        select.setAttribute('onchange', 'loadHub(this.value)')
        let label = document.createElement('label')
        label.appendChild(document.createTextNode(name+': '))
        label.setAttribute('id',name)
        label.appendChild(select)
        navItems[name].forEach(item => {
            let option = document.createElement('option')
            option.setAttribute('value', item)
            option.appendChild(document.createTextNode(item))
            select.appendChild(option)
        })
        li.appendChild(label)
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
    fetch('/mapMarkers?id=' + encodeURIComponent(id))
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(content => {
            let mapMarkers = content.mapMarkersJSON
            Object.keys(mapMarkers).forEach(hub => {
                mapMarkers[hub].forEach(marker => {
                    let x = marker[0]
                    let y = marker[1]
                    let r = marker[2]
                    let area = document.createElement('area')
                    area.setAttribute('shape', 'circle')
                    area.setAttribute('coords', x + ',' + y + ',' + r)
                    area.setAttribute('href', '#')
                    area.addEventListener('click', function(event) {
                        event.preventDefault(); // Prevent the default action
                        loadHub(hub);
                    })
                    map1.appendChild(area)
                })
            })
        });
    mapDiv.appendChild(img1);
    mapDiv.appendChild(map1);
    mapDiv.appendChild(img2);
}
function setPages(pages){
    pagesJSON = pages
}
    
function loadHub(hubName){
    let hub = pagesJSON[hubName];
    fillMainContent(hub.content, hubName);
    updateMap(hub.imgId);
    if (!document.getElementById('editModeButton') && !document.getElementById('editPageButton')){
        createEditButton();
    }
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



