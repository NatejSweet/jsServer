var navItems = JSON.parse(localStorage.getItem('navItemStorage'));
var fullNavs = {};
document.addEventListener("DOMContentLoaded",function(event){
    createNavColumns()
    document.getElementById('submitButton').addEventListener('click',submitNavPage)
})

function createNavColumns(){
    navItems.forEach(function(item){
        let navTitle = document.createElement('h3')
        navTitle.textContent = item
        let navlist = document.createElement('ul')
        navlist.setAttribute('id',item+"List")
        let inputLi = document.createElement('li')
        let input = document.createElement('input')
        inputLi.appendChild(input)
        navlist.appendChild(inputLi)
        let addItemButton = document.createElement('button')
        addItemButton.setAttribute('id','addItem'+item)
        addItemButton.textContent = 'Add Item'
        let navDiv = document.getElementsByClassName('navColumns')
        let columnDiv = document.createElement('div');
        columnDiv.setAttribute('class',item+'Div')
        columnDiv.appendChild(navTitle);
        columnDiv.appendChild(navlist);
        columnDiv.appendChild(addItemButton);
        navDiv[0].appendChild(columnDiv);
        addItemButton.addEventListener('click',function() {
            addItem(item)
        },false)
    })
}
function addItem(item){
    console.log(item)
    let ul = document.getElementById(item+'List')
    let li = document.createElement('li')
    let input = document.createElement('input')
    input.setAttribute('name','navItem')
    li.appendChild(input)
    ul.appendChild(li)
}
function submitNavPage(){
    let divs = Array.from(document.getElementsByClassName('navColumns')) //array of all nav columns
    if (divs.length>=1){
        divs.forEach(div =>{ //for each column
            Array.from(div.children).forEach(subDiv => {
                let ul = subDiv.children.item(1) // grabs the ul
                if (ul) {
                    Array.from(ul.children).forEach(li => {
                        let input = li.children.item(0).value //grabs the input value
                        if (input) { // check if input is not empty
                            if (!fullNavs[subDiv.className]) {
                                fullNavs[subDiv.className] = [];
                            }
                            fullNavs[subDiv.className].push(input); // push the input value to the array
                        }
                    });
                }
            });
        });
    }
localStorage.setItem('navContents', JSON.stringify(fullNavs));
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
}
location.assign('./fillContents.html')
}