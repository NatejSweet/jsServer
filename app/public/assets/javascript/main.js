let worlds = {};

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
  fetch("/worlds", {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
    })
    .then((data) => {
      console.log(data);
      worlds = data;
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
  console.log(response);
  if (response.error) {
    console.error(response.error);
    return;
  } else {
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        idToken: response.credential,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.token);
        if (data) {
          localStorage.setItem("token", data.token);
          console.log(localStorage.getItem("token"));
          window.location.href = "/dashboard"; // Redirect to dashboard
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}

function search(event) {
  const query = event.target.value;
  const searchResultsDiv = document.getElementById("searchResults");
  searchResultsDiv.innerHTML = ""; // Empty the search results
  if (query.length < 1) {
    return;
  }
  const searchResults = [];
  for (let world in worlds) {
    if (world.toLowerCase().includes(query.toLowerCase())) {
      searchResults.push(world);
    }
  }
  searchResults.forEach((world) => {
    const option = document.createElement("option");
    option.value = worlds[world];
    option.textContent = world;
    searchResultsDiv.appendChild(option);
  });
}
function loadWorld(option) {
  location.assign(option.value);
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
