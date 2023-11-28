// const { text } = require("express");

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
                return response.json();
            }
        }).then(content => {
            console.log(content);
            worldName.innerHTML = content.worldName;
            fillMainContent(content.mainPageJSON);
            fillNavBar(content.navNames, content.navItems);
            fillMap(content.img1Id, content.img2Id);
        });
}
function fillMainContent(mainPage) {
    let mainContentDiv = document.getElementById("mainContentDiv");
    console.log(mainPage)
    mainPage.forEach(title => {
        let titleDiv = document.createElement('div');
        titleDiv.setAttribute('class', 'titleDiv');
        let titleText = document.createElement('h2')
        titleText.appendChild(document.createTextNode(title[0]));
        // titleText.setAttribute('class', 'titleText');
        titleDiv.appendChild(titleText);
        title[1].forEach(subTitle => {
            let subTitleDiv = document.createElement('div');
            subTitleDiv.setAttribute('class', 'subTitleDiv');
            let subTitleText = document.createElement('h3')
            subTitleText.appendChild(document.createTextNode(subTitle[0]));
            // subTitleText.setAttribute('class', 'subTitleText');
            subTitleDiv.appendChild(subTitleText);
            subTitle[1].forEach(text => {
                let textDiv = document.createElement('div');
                textDiv.setAttribute('class', 'textDiv');
                let textText = document.createElement('p')
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
    let img2 = document.createElement('img')
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
    
