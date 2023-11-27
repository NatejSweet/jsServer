window.addEventListener('DOMContentLoaded', (event) => {
    const createAccountBtn = document.getElementById("createAccountBtn");
    const createAccountForm = document.getElementById("createAccountForm");
    const loginBtn = document.getElementById("loginBtn");
    const loginForm = document.getElementById("loginForm");

    createAccountBtn.addEventListener("click", function(){
            createAccountForm.style.display = "block";
            loginForm.style.display = "none";
    });

    loginBtn.addEventListener("click", function(){
            createAccountForm.style.display = "none";
            loginForm.style.display = "block";
    });
});
