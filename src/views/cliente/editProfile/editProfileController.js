document.addEventListener("DOMContentLoaded", () => {

    loadUserData();

    setupSaveProfile();

});


// CARGAR DATOS DEL USUARIO
function loadUserData() {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return;

    document.getElementById("name").value = user.name || "";

    document.getElementById("email").value = user.email || "";

    document.getElementById("phone").value = user.phone || "";
}


// GUARDAR CAMBIOS
function setupSaveProfile() {

    const saveBtn = document.getElementById("saveProfileBtn");

    if (!saveBtn) return;

    saveBtn.addEventListener("click", (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value.trim();

        const email = document.getElementById("email").value.trim();

        const phone = document.getElementById("phone").value.trim();


        // VALIDACIONES
        if (!name || !email || !phone) {

            alert("Todos los campos son obligatorios");

            return;
        }


        // OBJETO USUARIO
        const updatedUser = {
            name,
            email,
            phone
        };


        // GUARDAR EN LOCALSTORAGE
        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );


        alert("Perfil actualizado correctamente");


        // REDIRIGIR AL PERFIL
        window.location.href = "../profile/profile.html";

    });

}