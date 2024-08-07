window.addEventListener("DOMContentLoaded", (event) => {
  //this might be a security issue
  console.log("DOM fully loaded and parsed");
  const searchBar = document.getElementById("searchBar");
  let loginButton = document.getElementById("loginBtn");
  loginButton.addEventListener("click", () => {
    console.log("login button clicked");
    google.accounts.id.initialize({
      client_id:
        "158223117090-mm2f708rmllg070nisolvu1nomefh5mb.apps.googleusercontent.com",
      callback: handleCredentialResponse,
    });
    google.accounts.id.prompt();
  });
  searchBar.addEventListener("input", search);
  searchBar.addEventListener("keydown", (event) => {
    if (event.keyCode === 8) {
      // backspace key
      if (searchBar.value.length <= 1) {
        const searchResultsDiv = document.getElementById("searchResults");
        searchResultsDiv.innerHTML = ""; // Empty the search results
      } else {
        search(event);
      }
    }
  });
});

function handleCredentialResponse(response) {
  if (response.error) {
    console.error(response.error);
    return;
  } else {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken: response.credential }),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        if (data) {
          localStorage.setItem("savedWorlds", JSON.stringify(data.savedWorlds));
          window.location.href = "/dash.html";
        }
      });
  }
}

function search(event) {
  const query = event.target.value;
  const searchResultsDiv = document.getElementById("searchResults");
  fetch("/search?query=" + encodeURIComponent(query))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((worlds) => {
      console.log(worlds);
      Array.from(searchResultsDiv.children).forEach((option) => {
        option.remove();
      });
      console.log(worlds);
      worlds.forEach((world) => {
        var option = document.createElement("button");
        option.appendChild(document.createTextNode(world.worldName));
        option.onclick = function () {
          window.location.href = "./viewing/viewMainPage.html?id=" + world.id;
        };
        console.log(option);
        searchResultsDiv.appendChild(option); // Append the <option> to the <select>
        console.log(searchResultsDiv);
      });
    });
}
function loadWorld(option) {
  location.assign(option.value);
}

function login() {
  let username = document.getElementById("username").value;
  let password = document.getElementById("password").value;
  fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  }).then((response) => {
    console.log("response", response);
    if (response.ok) {
      localStorage.setItem("savedWorlds", JSON.stringify(response.savedWorlds));
      console.log(localStorage.getItem("savedWorlds"));
      window.location.href = "/dash.html";
      return;
    }
  });
}

// function createAccount() {
//   let username = document.getElementById("newUsername").value;
//   let password = document.getElementById("newPassword").value;
//   fetch("/createAccount", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, password }),
//   })
//     .then((response) => {
//       console.log("response", response);
//       if (response.ok) {
//         return response.json();
//       } else {
//         alert("Username already exists");
//       }
//     })
//     .then((data) => {
//       console.log(data);
//       if (data) {
//         sessionStorage.setItem("savedWorlds", JSON.stringify(data.savedWorlds));
//         window.location.href = "/dash.html";
//       }
//     });
// }

function showLogin() {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementsByClassName("search")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "none";
  document.getElementsByClassName("login")[0].style.display = "block";
}

function showCreateAccount() {
  document.getElementById("loginBtn").style.display = "none";
  document.getElementsByClassName("search")[0].style.display = "none";
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "block";
}
function showSearch() {
  document.getElementById("loginBtn").style.display = "block";
  document.getElementsByClassName("search")[0].style.display = "block";
  document.getElementsByClassName("login")[0].style.display = "none";
  document.getElementsByClassName("createAccount")[0].style.display = "none";
}
