function renameWorld() {
    let header = document.querySelector("header");
    let worldName = header.getElementsByTagName("h1")[0];
    console.log(worldName);
    worldName.hidden = true;
    worldNameValue = worldName.firstChild.innerHTML;
    let worldNameInput = document.createElement("input");
    worldNameInput.setAttribute("id", "worldNameInput");
    worldNameInput.setAttribute("type", "text");
    worldNameInput.setAttribute("value", worldNameValue);
    
    worldName.parentNode.insertBefore(worldNameInput, worldName);
    editButtonsDiv = document.getElementById("editButtonsDiv");
    editButtonsDiv.innerHTML = "";
    let confirmButton = document.createElement("button");
    confirmButton.setAttribute("id", "confirmButton");
    confirmButton.setAttribute("onclick", "confirmRename()");
    confirmButton.appendChild(document.createTextNode("Confirm"));
    let cancelButton = document.createElement("button");
    cancelButton.setAttribute("id", "cancelButton");
    cancelButton.setAttribute("onclick", "cancelRename()");
    cancelButton.appendChild(document.createTextNode("Cancel"));
    editButtonsDiv.appendChild(confirmButton);
    editButtonsDiv.appendChild(cancelButton);
  }
  
  function confirmRename() {
    let header = document.querySelector("header");
    let worldName = header.getElementsByTagName("h1")[0];
    console.log(worldName);
    worldName.hidden = false;
    worldName.firstChild.innerHTML = worldNameInput.value;
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    fetch("/renameWorld?id=" + encodeURIComponent(id), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        worldName: worldNameInput.value,
      }),
    });
    let editButtonsDiv = document.getElementById("editButtonsDiv");
    editButtonsDiv.innerHTML = "";
    header.removeChild(worldNameInput);
    createEditButton();
  }
  
  function cancelRename() {
    let header = document.querySelector("header");
    let worldName = header.getElementsByTagName("h1")[0];
    console.log(worldName);
    worldName.hidden = false;
    let editButtonsDiv = document.getElementById("editButtonsDiv");
    editButtonsDiv.innerHTML = "";
    header.removeChild(worldNameInput);
    createEditButton();
  }