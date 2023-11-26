// document.addEventListener('DOMContentLoaded',fillFromLocalStorage,false)

// function fillFromLocalStorage(){
//     let worldName = document.getElementById('worldName')
//     worldName.innerHTML = localStorage.getItem('worldName')
//     let navlist = document.getElementById('navlist')
//     let navItems = JSON.parse(localStorage.getItem('navItemStorage'))
//     navItems.forEach(function(item){
//         let li = document.createElement('li')
//         let a = document.createElement('a')
//         a.setAttribute('href','#'+item)
//         a.textContent = item
//         li.appendChild(a)
//         navlist.appendChild(li)
//     })  
//     let openRequest = indexedDB.open("imageDB", 1);
//     ``
//     openRequest.onupgradeneeded = function() {
//         let db = openRequest.result;
//         if (!db.objectStoreNames.contains('images')) { 
//             db.createObjectStore('images');
//         }
//     };

//     openRequest.onerror = function() {
//         console.error("Error", openRequest.error);
//     };

//     openRequest.onsuccess = function() {
//         let db = openRequest.result;
//         // the database is ready, we can use it
//         let mapDiv = document.getElementById('mapsContainer');
//         let transaction = db.transaction("images", "readonly");
//         let store = transaction.objectStore("images");
//         let request = store.get('mainMapImg');
//         request.onsuccess = function() {
//             let mainImg = document.createElement('img');
//             mainImg.setAttribute('src',request.result);
//             mapDiv.appendChild(mainImg);
//         };
//         request.onerror = function() {
//             console.error("Error retrieving image", request.error);
//         };
//     };
//     // let mapStorage = JSON.parse(localStorage.getItem('mainImageStorage'))
//     // console.log(mapStorage)
//     // if (mapStorage.mainImage){
//     //     let mainImg = document.createElement('img')
//     //     mainImg.setAttribute('src',mapStorage[mainImage])
//     //     mapDiv.appendChild(mainImg)
//     // }
//     // if (mapStorage.secondaryImage){
//     //     let secondaryImg = document.createElement('img')
//     //     secondaryImg.setAttribute('src',mapStorage[secondaryImage])
//     //     mapDiv.appendChild(secondaryImg)
//     // }
//     let mainContentDiv = document.getElementById('main')
//     let mainContent = JSON.parse(localStorage.getItem('mainContentStorage'))
//     if (mainContent.title) {
//         let title = document.createElement('h1')
//         title.textContent = mainContent.title
//         mainContentDiv.appendChild(title)
//     }
//     if (mainContent.text) {
//         let text = document.createElement('p')
//         text.textContent = mainContent.text
//         mainContentDiv.appendChild(text)
//     }
//     if (mainContent.subtext) {
//         let subtext = document.createElement('p')
//         subtext.textContent = mainContent.subtext
//         mainContentDiv.appendChild(subtext)
//     }
    
// }
