export { createFillNavsPage };

function createFillNavsPage(worldId) {
  let mainContentDiv = document.getElementById("mainContentDiv");
  mainContentDiv.style.display = "none";
  let navDiv = document.createElement("div");
  navDiv.setAttribute("class", "navColumns");
  fetch("/fillNavs/" + worldId, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json().then((data) => {
          console.log(data);
          createHeader(data.worldName);
          let navItems = JSON.parse(data.navItems);
          console.log(typeof navItems);
          let navNames = Object.keys(navItems);
          console.log(typeof navNames);
          navNames.forEach((navName) => {
            let navTitle = document.createElement("h3");
            navTitle.textContent = navName;
            let navlist = document.createElement("ul");
            navlist.setAttribute("id", navName + "List");
            let inputLi = document.createElement("li");
            let input = document.createElement("input");
            inputLi.appendChild(input);
            navlist.appendChild(inputLi);
            let addItemButton = document.createElement("button");
            addItemButton.setAttribute("id", "addItem" + navName);
            addItemButton.textContent = "Add Item";
            let navDiv = document.getElementsByClassName("navColumns");
            let columnDiv = document.createElement("div");
            columnDiv.setAttribute("class", navName + "Div");
            columnDiv.appendChild(navTitle);
            columnDiv.appendChild(navlist);
            columnDiv.appendChild(addItemButton);
            navDiv[0].appendChild(columnDiv);
            addItemButton.addEventListener(
              "click",
              function () {
                addItem(navName);
              },
              false
            );
          });
        });
      }
    })
    .catch((error) => {
      console.error(error);
    });
  let fillNavsFormDiv = document.getElementById("fillNavsFormDiv");
  console.log(fillNavsFormDiv);
  fillNavsFormDiv.appendChild(navDiv);
  let submitButton = document.createElement("button");
  submitButton.setAttribute("id", "submitButton");
  submitButton.textContent = "Submit";
  submitButton.addEventListener(
    "click",
    function (event) {
      event.preventDefault();
      submitNavPage(event, worldId);
    },
    false
  );
  fillNavsFormDiv.appendChild(submitButton);
}
function createHeader(worldName) {
  let header = document.getElementById("header");
  header.innerHTML = "";
  let worldNameHeader = document.createElement("h1");
  worldNameHeader.textContent = worldName;
  header.appendChild(worldNameHeader);
}
function addItem(item) {
  console.log(item);
  let ul = document.getElementById(item + "List");
  let li = document.createElement("li");
  let input = document.createElement("input");
  input.setAttribute("name", "navItem");
  li.appendChild(input);
  ul.appendChild(li);
}
function submitNavPage(event, worldId) {
  event.preventDefault();
  let navNames = Array.from(
    document.getElementsByClassName("navColumns")[0].children
  );
  let navItemsJSON = {};
  navNames.forEach((navName) => {
    let navNameString = navName.children[0].textContent;
    let navItems = Array.from(navName.children[1].children);
    let navItemsArray = [];
    navItems.forEach((navItem) => {
      let navItemString = navItem.children[0].value;
      navItemsArray.push(navItemString);
    });
    navItemsJSON[navNameString] = navItemsArray;
  });
  fetch("/fillNavs/" + worldId, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify(navItemsJSON),
  }).then((response) => {
    if (response.ok) {
      console.log("responded");
      console.log(response);
      location.assign("../dashboard");
    }
  });
}
//     let divs = Array.from(document.getElementsByClassName('navColumns')) //array of all nav columns
//     if (divs.length>=1){
//         divs.forEach(div =>{ //for each column
//             Array.from(div.children).forEach(subDiv => {
//                 let ul = subDiv.children.item(1) // grabs the ul
//                 if (ul) {
//                     Array.from(ul.children).forEach(li => {
//                         let input = li.children.item(0).value //grabs the input value
//                         if (input) { // check if input is not empty
//                             if (!fullNavs[subDiv.className]) {
//                                 fullNavs[subDiv.className] = [];
//                             }
//                             fullNavs[subDiv.className].push(input); // push the input value to the array
//                         }
//                     });
//                 }
//             });
//         });
//     }
// localStorage.setItem('navContents', JSON.stringify(fullNavs));
// for (let i = 0; i < localStorage.length; i++) {
//     let key = localStorage.key(i);
//     let value = localStorage.getItem(key);
//     console.log(`${key}: ${value}`);
// }
// location.assign('./fillContents.html')
