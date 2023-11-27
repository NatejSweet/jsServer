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
            fillMap(content.navNames);
        });
}
function fillMainContent(mainPage) {
    let mainContentDiv = document.getElementById("mainContentDiv");
    console.log(mainPage)
    mainPage.forEach(title => {
        let [, ...subtitles] = title; // Skip the first item in the title array
        console.log(subtitles);
        subtitles.forEach(subtitle => {
            subtitle.forEach(text => {
                let textDiv = document.createElement("div");
                textDiv.setAttribute("class", "textDiv");
                let textP = document.createElement("p");
                textP.setAttribute("class", "text");
                textP.textContent = text;
                textDiv.appendChild(textP);
                subDiv.appendChild(textDiv);
            });

            let subDiv = document.createElement("div");
            subDiv.setAttribute("class", "subDiv");
            let subText = document.createElement("h3");
            subText.setAttribute("class", "subtext");
            subText.textContent = subtitle[0];
            subDiv.appendChild(subText);
            titleDiv.appendChild(subDiv);
        });

        let titleDiv = document.createElement("div");
        titleDiv.setAttribute("class", "titleDiv");
        let titleText = document.createElement("h2");
        titleText.setAttribute("class", "titletext");
        titleText.textContent = title[0];
        titleDiv.appendChild(titleText);
        mainContentDiv.appendChild(titleDiv);
    });
}

function fillNavBar(){

}
function fillMap(){

}
