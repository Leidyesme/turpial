localStorage.setItem("user", JSON.stringify(user));

document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    setupLogout();

});

function loadUserData() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    const name = document.querySelector(".profile__name");
    const email = document.querySelector(".profile__email");
    const initial = document.querySelector(".profile__usuario");

    if (name) {
        name.textContent = user.name;
    }

    if (email) {
        email.textContent = user.email;
    }

    if (initial) {
        initial.textContent = user.name.charAt(0).toUpperCase();
    }
}

function setupLogout() {

    const logoutBtn = document.getElementById("logoutBtn");

    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        localStorage.removeItem("cart");

        window.location.href = "../../auth/login/login.html";

    });
}