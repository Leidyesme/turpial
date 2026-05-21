document.addEventListener("DOMContentLoaded", () => {

    validateSession();

    loadUserInitial();

});

function validateSession() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        window.location.href = "../../../auth/login.html";
    }
}

function loadUserInitial() {

    const user = JSON.parse(localStorage.getItem("user"));

    const userButton = document.querySelector(".categories__usuario");

    if (user && userButton) {
        userButton.textContent = user.name.charAt(0).toUpperCase();
    }
}
