import { createFillNavsPage } from "./fillNavs.js";
var mainImage = null;
var mapImageStorage = { id: mainImage, file: null };

document.addEventListener("DOMContentLoaded", function (event) {
  let mainContentDiv = document.getElementById("mainContentDiv");
  mainContentDiv.appendChild(addTitle(event));
  let addTitleButton = document.getElementById("addButton");
  addTitleButton.addEventListener("click", function () {
    mainContentDiv.appendChild(addTitle(event));
  });
  let addNavButton = document.getElementById("navAddButton");
  addNavButton.addEventListener("click", createNavItem, false);
  let removeNavButton = document.getElementById("navRemoveButton");
  removeNavButton.addEventListener("click", removeNavItem, false);
});
document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("submitButton")
    .addEventListener("click", submitMainPage);
});

function addTitle(event) {
  if (event) {
    event.preventDefault;
  }
  let titleDiv = document.createElement("div");
  titleDiv.setAttribute("class", "titleDiv");
  let titleLabel = document.createElement("label");
  titleLabel.textContent = "Title: ";
  let addSubtextButton = document.createElement("button");
  addSubtextButton.setAttribute("id", "subtextAddButton");
  addSubtextButton.textContent = "Add Subtext";
  addSubtextButton.addEventListener(
    "click",
    function () {
      titleDiv.appendChild(addSubtext());
    },
    false
  );
  let removeTitleButton = document.createElement("button");
  removeTitleButton.textContent = "Remove Section";
  removeTitleButton.addEventListener("click", removeItem);
  let lineBreak = document.createElement("br");
  let titleText = document.createElement("textArea");
  titleText.setAttribute("name", "title");
  titleText.setAttribute("class", "titletext");
  titleDiv.appendChild(titleLabel);
  titleDiv.appendChild(addSubtextButton);
  titleDiv.appendChild(removeTitleButton);
  titleDiv.appendChild(lineBreak);
  titleDiv.appendChild(titleText);
  return titleDiv;
}

function addSubtext(event) {
  if (event) {
    event.preventDefault();
  }
  let subtextDiv = document.createElement("div");
  subtextDiv.setAttribute("class", "subTitleDiv");
  let subtextLabel = document.createElement("label");
  subtextLabel.textContent = "Subtext: ";
  let subtext = document.createElement("textArea");
  subtext.setAttribute("name", "subtext");
  subtext.setAttribute("class", "subtext");
  // parentDiv.appendChild(subtextDiv);
  let addTextButton = document.createElement("button");
  addTextButton.setAttribute("class", "addTextButton");
  addTextButton.textContent = "Add Text";
  addTextButton.addEventListener(
    "click",
    function () {
      subtextDiv.appendChild(addText());
    },
    false
  );
  let removeSubtextButton = document.createElement("button");
  removeSubtextButton.textContent = "Remove Subsection";
  removeSubtextButton.addEventListener("click", removeItem);
  let lineBreak = document.createElement("br");
  subtextDiv.appendChild(subtextLabel);
  subtextDiv.appendChild(addTextButton);
  subtextDiv.appendChild(removeSubtextButton);
  subtextDiv.appendChild(lineBreak);
  subtextDiv.appendChild(subtext);
  return subtextDiv;
}

function addText(event) {
  if (event) {
    event.preventDefault();
  }
  let textDiv = document.createElement("div");
  textDiv.setAttribute("class", "textDiv");
  let textLabel = document.createElement("label");
  textLabel.textContent = "Text: ";
  let text = document.createElement("textArea");
  text.setAttribute("name", "text");
  text.setAttribute("class", "text");
  let removeTextButton = document.createElement("button");
  removeTextButton.textContent = "Remove Text";
  removeTextButton.addEventListener("click", removeItem);
  let lineBreak = document.createElement("br");
  textDiv.appendChild(textLabel);
  textDiv.appendChild(removeTextButton);
  textDiv.appendChild(lineBreak);
  textDiv.appendChild(text);
  return textDiv;
}

function removeItem(event) {
  event.preventDefault();
  let removeButton = event.target;
  let parentDiv = removeButton.parentNode;
  parentDiv.remove();
}

function removeNavItem(event) {
  event.preventDefault();
  let ul = document.getElementById("navbar");
  let li = ul.lastChild;
  ul.removeChild(li);
}

function createNavItem(event) {
  event.preventDefault();
  let ul = document.getElementById("navbar");
  let li = document.createElement("li");
  let input = document.createElement("input");
  input.setAttribute("name", "navItem");
  input.setAttribute("placeholder", "Nav Item/Region");
  li.appendChild(input);
  ul.appendChild(li);
}
function createJson(obj) {
  this.title = obj.title;
  this.text = obj.text;
  this.subtext = obj.subtext;
}
window.readImage = function (input, imgId) {
  if (input.files && input.files[0]) {
    if (input.files[0].size > 4 * 1024 * 1024) {
      alert("File size exceeds 4 MB limit.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      let img = document.getElementById(imgId);
      img.setAttribute("src", e.target.result);
      img.style.display = "block";
      if (imgId === "mainImage") {
        mapImageStorage.name = imgId;
        mapImageStorage.file = input.files[0];
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
};

function submitMainPage(event) {
  event.preventDefault(); // Prevent page reload

  // Gather the data
  const worldName = storeWorldName();
  const navItems = storeNavItems();
  const mainImage = storeMainImage();
  const mainContent = storeMainContent();

  // Create the world object
  const world = {
    name: worldName,
    content: mainContent,
    navItems: navItems,
  };

  // Send the data to the server
  const formData = new FormData();
  formData.append("world", JSON.stringify(world));
  formData.append("image", mainImage); // Assuming `imageFile` is the File object for the image

  fetch("/createworld", {
    method: "POST",
    body: formData,
  }).then((response) => {
    if (response.ok) {
      console.log("ok");
      return createFillNavsPage();
    }
  });
}

function storeMainContent() {
  let titleDivs = document.getElementsByClassName("titleDiv");
  let mainContent = [];

  Array.from(titleDivs).forEach((titleDiv) => {
    let title = titleDiv.getElementsByClassName("titletext")[0].value;
    let subDivs = titleDiv.getElementsByClassName("subDiv");
    let subContent = [];

    Array.from(subDivs).forEach((subDiv) => {
      let subText = subDiv.getElementsByClassName("subtext")[0].value;
      let textDivs = subDiv.getElementsByClassName("textDiv");
      let textContent = [];

      Array.from(textDivs).forEach((textDiv) => {
        let text = textDiv.getElementsByClassName("text")[0].value;
        textContent.push(text);
      });

      subContent.push([subText, textContent]);
    });

    mainContent.push([title, subContent]);
  });

  return mainContent;
}

function storeMainImage() {
  let mainMap = document.getElementById("mainMap");
  console.log(mainMap.files[0]);
  return mainMap.files[0];
}

function storeWorldName() {
  let worldName = document.getElementById("worldName").value;
  return worldName;
}

function storeNavItems() {
  let navItemStorage = {};
  let navItems = document.getElementsByName("navItem");

  navItems.forEach((item) => {
    navItemStorage[item.value] = [];
  });
  return navItemStorage;
}
