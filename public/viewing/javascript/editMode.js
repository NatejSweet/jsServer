var public;
function createEditButton(publicArg) {
  let editButtonsDiv = document.getElementById("editButtonsDiv");
  public = publicArg;
  let editModeButton = document.createElement("button");
  editModeButton.setAttribute("id", "editModeButton");
  editModeButton.setAttribute("onclick", "enterEditMode(editButtonsDiv)");
  editModeButton.appendChild(document.createTextNode("Enter Edit Mode"));

  editButtonsDiv.innerHTML = "";
  editButtonsDiv.appendChild(editModeButton);
  editButtonsDiv.appendChild(document.createElement("br"));
}
function enterEditMode(editButtonsDiv) {
  while (editButtonsDiv.hasChildNodes()) {
    editButtonsDiv.removeChild(editButtonsDiv.firstChild);
  }
  let renameWorldButton = document.createElement("button");
  renameWorldButton.setAttribute("id", "renameWorldButton");
  renameWorldButton.setAttribute("onclick", "renameWorld()");
  renameWorldButton.appendChild(document.createTextNode("Rename World"));
  let editPageButton = document.createElement("button");
  editPageButton.setAttribute("id", "editPageButton");
  editPageButton.setAttribute("onclick", "editPage()");
  editPageButton.appendChild(document.createTextNode("Edit Page"));
  // editButtonsDiv.appendChild(editPageButton)
  let editNavBarButton = document.createElement("button");
  editNavBarButton.setAttribute("id", "editNavBarButton");
  editNavBarButton.setAttribute("onclick", "editNavBar()");
  editNavBarButton.appendChild(document.createTextNode("Edit NavBar"));
  // editButtonsDiv.appendChild(editNavBarButton)
  let editNavItemsButton = document.createElement("button");
  editNavItemsButton.setAttribute("id", "editNavItemsButton");
  editNavItemsButton.setAttribute("onclick", "editNavOptions()");
  editNavItemsButton.appendChild(document.createTextNode("Edit Nav Options"));
  // editButtonsDiv.appendChild(editNavItemsButton)
  let exitEditModeButton = document.createElement("button");
  exitEditModeButton.setAttribute("id", "exitEditModeButton");
  exitEditModeButton.setAttribute("onclick", "exitEditMode(editButtonsDiv)");
  exitEditModeButton.appendChild(document.createTextNode("Exit Edit Mode"));
  // editButtonsDiv.appendChild(exitEditModeButton)
  let editMapMarkersButton = document.createElement("button");
  editMapMarkersButton.setAttribute("id", "editMapMarkersButton");
  editMapMarkersButton.setAttribute("onclick", "editMapMarkers()");
  editMapMarkersButton.appendChild(document.createTextNode("Edit Map Markers"));
  // editButtonsDiv.appendChild(editMapMarkersButton)
  let publicButton = document.createElement("button");
  publicButton.setAttribute("id", "publicButton");
  publicButton.setAttribute("onclick", "togglePublic()");
  console.log(public);
  if (public) {
    publicButton.appendChild(document.createTextNode("Make Private"));
  } else {
    publicButton.appendChild(document.createTextNode("Make Public"));
  }
  let deleteWorldButton = document.createElement("button");
  deleteWorldButton.setAttribute("id", "deleteWorldButton");
  deleteWorldButton.setAttribute("onclick", "deleteWorldCheck()");
  deleteWorldButton.appendChild(document.createTextNode("Delete World"));
  // editButtonsDiv.appendChild(publicButton)
  editButtonsDiv.appendChild(renameWorldButton);
  editButtonsDiv.appendChild(editPageButton);
  editButtonsDiv.appendChild(editNavBarButton);
  editButtonsDiv.appendChild(editNavItemsButton);
  editButtonsDiv.appendChild(editMapMarkersButton);
  editButtonsDiv.appendChild(publicButton);
  editButtonsDiv.appendChild(deleteWorldButton);
  editButtonsDiv.appendChild(exitEditModeButton);
}
function exitEditMode(editButtonsDiv) {
  while (editButtonsDiv.hasChildNodes()) {
    editButtonsDiv.removeChild(editButtonsDiv.firstChild);
  }
  if (document.getElementById("addSectionButton")) {
    removeMainContentAddButtons();
  }
  createEditButton();
}

function togglePublic() {
  let publicButton = document.getElementById("publicButton");
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  if (public) {
    publicButton.innerHTML = "Make Public";
    public = false;
  } else {
    publicButton.innerHTML = "Make Private";
    public = true;
  }
  fetch("/togglePublic?id=" + encodeURIComponent(id), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public: public,
    }),
  });
}

function deleteWorldCheck() {
  // Create a form overlay
  const overlay = document.createElement("div");
  overlay.setAttribute("id", "deleteWorldDiv");
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";

  // Create a confirmation message
  const message = document.createElement("div");
  message.setAttribute("id", "deleteWorldMessage");
  message.innerHTML = "Are you sure you want to delete the world?";
  message.appendChild(document.createElement("br"));

  // Create buttons for confirmation
  const confirmButton = document.createElement("button");
  confirmButton.setAttribute("id", "confirmButton");
  confirmButton.innerHTML = "Confirm";
  confirmButton.addEventListener("click", () => {
    deleteWorld();
  });

  const cancelButton = document.createElement("button");
  cancelButton.setAttribute("id", "cancelButton");
  cancelButton.innerHTML = "Cancel";
  cancelButton.addEventListener("click", () => {
    overlay.remove();
  });

  // Append elements to the overlay
  message.appendChild(confirmButton);
  message.appendChild(cancelButton);
  overlay.appendChild(message);
  document.body.appendChild(overlay);
}

function deleteWorld() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  fetch("/deleteWorld?id=" + encodeURIComponent(id), {
    method: "POST",
  }).then(() => {
    window.location.href = "/";
  });
}

function cancelDeleteWorld() {
  let deleteWorldDiv = document.getElementById("deleteWorldDiv");
  deleteWorldDiv.remove();
}
