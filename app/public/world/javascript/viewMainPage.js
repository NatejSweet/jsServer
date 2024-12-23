// const { doc } = require("firebase/firestore");

var pagesJSON = {};
var mapMarkers = {};
var mainPageJSON = {};
var navItems = {};
var mainImgUrl = "";
var altImgUrl = "";
var savedWorlds = {};
document.addEventListener("DOMContentLoaded", function () {
  savedWorlds = JSON.parse(localStorage.getItem("savedWorlds"));
  token = localStorage.getItem("token");
  viewMainPage();
});
window.addEventListener("resize", function () {
  console.log("resize");
  let map1 = document.getElementById("map1");
  let img1 = document.getElementById("map1Img");
  placeMapMarkers(map1, img1);
});

function viewMainPage() {
  let worldName = document.getElementById("worldName");

  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log(id);
  fetch("/world/" + encodeURIComponent(id), {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch world data");
      }
    })
    .then((content) => {
      try {
        if (!content) {
          throw new Error("Content is undefined");
        }
        console.log(content);
        mainPageJSON = JSON.parse(content.mainPageJSON);
        console.log(mainPageJSON);
        pagesJSON = JSON.parse(content.pagesJSON);
        console.log(pagesJSON);
        mapMarkers = JSON.parse(content.mapMarkers);
        console.log(mapMarkers);
        navItems = JSON.parse(content.navItems);
        mainImgUrl = content.mainImgUrl;
        console.log(mainImgUrl);
        altImgUrl = content.altImgUrl;

        worldName.innerHTML = content.worldName;
        const isPublic = content.public === "true";
        if (content.editAccess) {
          if (document.getElementById("editModeButton")) {
            document.getElementById("editModeButton").remove();
          }
          if (document.getElementById("editPageButton")) {
            document.getElementById("editPageButton").remove();
          }
          createEditButton(isPublic);
        } else {
          console.log("no edit access");
          createSaveWorldButton(id);
        }
        fillMainContent(mainPageJSON);
        fillNavBar(navItems);
        console.log("mainImgUrl:", mainImgUrl);
        fillMap(mainImgUrl, altImgUrl);
      } catch (error) {
        console.log(error);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function reloadMainPage(editAccess) {
  if (!editAccess) {
    createSaveWorldButton();
  }
  fillMainContent(mainPageJSON);
  fillNavBar(navItems);
  fillMap(img1Id, img2Id);
}

function createSaveWorldButton(worldId) {
  console.log(savedWorlds);

  if (!Object.keys(savedWorlds).includes(worldId)) {
    let editButtonsDiv = document.getElementById("editButtonsDiv");
    let saveWorldButton = document.createElement("button");
    saveWorldButton.setAttribute("id", "saveWorldButton");
    saveWorldButton.setAttribute("onclick", "saveWorld()");
    saveWorldButton.appendChild(document.createTextNode("Save World"));
    editButtonsDiv.appendChild(saveWorldButton);
  } else {
    createUnsaveWorldButton();
  }
}

function saveWorld() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  let savedWorlds = JSON.parse(sessionStorage.getItem("savedWorlds"));
  console.log(savedWorlds);
  console.log("id:", id);
  console.log("worldName.innerHTML:", worldName.innerHTML);
  if (savedWorlds == "{}" || savedWorlds == null) {
    savedWorlds = {};
  }
  savedWorlds[id] = worldName.innerHTML;
  console.log("savedWorlds:", savedWorlds);
  sessionStorage.setItem("savedWorlds", JSON.stringify(savedWorlds));
  fetch("/updateSavedWorlds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(savedWorlds),
  }).then((response) => {
    if (response.ok) {
      let saveWorldButton = document.getElementById("saveWorldButton");
      saveWorldButton.remove();
      createUnsaveWorldButton();
    }
  });
}

function createUnsaveWorldButton() {
  let editButtonsDiv = document.getElementById("editButtonsDiv");
  let unsaveWorldButton = document.createElement("button");
  unsaveWorldButton.setAttribute("id", "unsaveWorldButton");
  unsaveWorldButton.setAttribute("onclick", "unsaveWorld()");
  unsaveWorldButton.appendChild(document.createTextNode("Unsave World"));
  editButtonsDiv.appendChild(unsaveWorldButton);
}

function unsaveWorld() {
  let urlParams = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");
  delete savedWorlds[id];
  console.log(savedWorlds);
  let savedWorldsString = JSON.stringify(savedWorlds);
  fetch("/updateSavedWorlds", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: savedWorldsString,
  }).then((response) => {
    if (response.ok) {
      let unsaveWorldButton = document.getElementById("unsaveWorldButton");
      unsaveWorldButton.remove();
      createSaveWorldButton(id);
    }
  });
}

function reloadNavBar() {
  // changed to not query db
  fillNavBar(navItems);
}

function fillMainContent(mainPage, pageName) {
  console.log(mainPage);
  let mainContentDiv = document.getElementById("mainContentDiv");
  mainContentDiv.innerHTML = "";
  if (pageName) {
    let pageTitle = document.createElement("h1");
    pageTitle.setAttribute("id", "pageTitle");
    pageTitle.appendChild(document.createTextNode(pageName));
    mainContentDiv.appendChild(pageTitle);
  }
  mainPage.forEach((title) => {
    console.log(title);
    let titleDiv = document.createElement("div");
    titleDiv.setAttribute("class", "titleDiv");
    let titleText = document.createElement("h2");
    titleText.setAttribute("class", "titleText");
    titleText.innerHTML = linkify(title[0]);
    titleDiv.appendChild(titleText);
    title[1].forEach((subTitle) => {
      let subTitleDiv = document.createElement("div");
      subTitleDiv.setAttribute("class", "subTitleDiv");
      let subTitleText = document.createElement("h3");
      subTitleText.setAttribute("class", "subTitleText");
      subTitleText.innerHTML = linkify(subTitle[0]);
      subTitleDiv.appendChild(subTitleText);
      subTitle[1].forEach((text) => {
        let textDiv = document.createElement("div");
        textDiv.setAttribute("class", "textDiv");
        let textP = document.createElement("p");
        textP.setAttribute("class", "text");
        textP.innerHTML = linkify(text);
        textDiv.appendChild(textP);
        subTitleDiv.appendChild(textDiv);
      });
      titleDiv.appendChild(subTitleDiv);
    });
    mainContentDiv.appendChild(titleDiv);
  });
}

function fillNavBar(navItems) {
  let list = document.createElement("ul");
  let nav = document.getElementById("navBar");
  nav.innerHTML = "";
  nav.style.display = "block";
  Object.keys(navItems).forEach((name) => {
    let li = document.createElement("li");
    let dropDownDiv = document.createElement("div");
    dropDownDiv.setAttribute("class", "dropdown");
    let select = document.createElement("select");
    select.setAttribute("id", name);
    select.setAttribute("class", "dropbtn");
    select.setAttribute("onchange", "loadHub(this.value)");
    let defaultOption = document.createElement("option");
    defaultOption.setAttribute("value", name);
    defaultOption.appendChild(document.createTextNode(name));
    defaultOption.setAttribute("selected", "selected");
    defaultOption.setAttribute("hidden", "hidden");
    select.appendChild(defaultOption);
    console.log(navItems);
    navItems[name].forEach((item) => {
      let option = document.createElement("option");
      option.setAttribute("value", item);
      option.appendChild(document.createTextNode(item));
      select.appendChild(option);
    });
    li.appendChild(select);
    list.appendChild(li);
  });
  nav.appendChild(list);
}
function fillMap(mainImgUrl, altImgUrl) {
  let mapDiv = document.getElementById("mapDiv");
  mapDiv.innerHTML = "";
  let img1 = document.createElement("img");
  img1.setAttribute("id", "map1Img");
  img1.setAttribute("usemap", "#map1");
  let map1 = document.createElement("map");
  map1.setAttribute("name", "map1");
  let img2 = document.createElement("img");
  img2.setAttribute("id", "map2Img");
  let img1Button = document.createElement("button");
  img1Button.textContent = "Main Map";
  img1Button.setAttribute("class", "imgControlButton");
  img1Button.setAttribute("id", "img1Button");
  img1Button.addEventListener("click", () => {
    if (img1.style.display == "block") {
      return;
    } else {
      img1.style.display = "block";
      img2.style.display = "none";
    }
  });
  let img2Button = document.createElement("button");
  img2Button.textContent = "Secondary Map";
  img2Button.setAttribute("class", "imgControlButton");
  img2Button.setAttribute("id", "img2Button");
  img2Button.addEventListener("click", () => {
    if (img2.style.display == "block") {
      return;
    } else {
      img2.style.display = "block";
      img1.style.display = "none";
    }
  });
  img1.setAttribute("src", mainImgUrl);
  img2.setAttribute("src", altImgUrl);
  img1.style.display = "block";
  img2.style.display = "none";
  mapDiv.appendChild(img2Button);
  mapDiv.appendChild(img1Button);
  mapDiv.appendChild(document.createElement("br"));
  mapDiv.appendChild(img1);
  mapDiv.appendChild(map1);
  mapDiv.appendChild(img2);
  placeMapMarkers(map1, img1);
}

function placeMapMarkers(map1, img1) {
  console.log(mapMarkers);
  if (mapMarkers != {}) {
    console.log("placing markers");
    img1.onload = function () {
      Object.keys(mapMarkers).forEach((hub) => {
        console.log(hub);
        mapMarkers[hub].forEach((marker) => {
          let x = marker[0] * img1.width;
          let y = marker[1] * img1.height;
          let r = marker[2] * img1.width;
          let area = document.createElement("area");
          area.setAttribute("shape", "circle");
          area.setAttribute("coords", x + "," + y + "," + r);
          area.setAttribute("href", "#");
          area.setAttribute("title", hub);
          area.setAttribute("class", "mapMarker");
          area.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent the default action
            loadHub(hub);
          });
          map1.appendChild(area);
        });
      });
    }
    };
}

function loadHub(hubName) {
  console.log(pagesJSON)
  let hub = pagesJSON[hubName];
  fillMainContent(hub.content, hubName);
  getAltImage(hub.imgId);
  let selects = document.getElementsByTagName("select");
  for (let i = 0; i < selects.length; i++) {
    selects[i].selectedIndex = 0;
  }
}

function linkify(inputText) {
  var replacedText, replacePattern1, replacePattern2, replacePattern3;

  //URLs starting with http://, https://, or ftp://
  replacePattern1 =
    /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
  replacedText = inputText.replace(
    replacePattern1,
    '<a href="$1" target="_blank">$1</a>'
  );

  //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
  replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
  replacedText = replacedText.replace(
    replacePattern2,
    '$1<a href="http://$2" target="_blank">$2</a>'
  );

  //Change email addresses to mailto:: links.
  replacePattern3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
  replacedText = replacedText.replace(
    replacePattern3,
    '<a href="mailto:$1">$1</a>'
  );

  return replacedText;
}
