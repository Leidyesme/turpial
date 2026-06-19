document.addEventListener("DOMContentLoaded", () => {
    // Recuperar usuario del localStorage
    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    if (!usuario) {
        window.location.href = "../auth/login/login.html";
        return;
    }

    // Configurar la página
    setupLogout();
    configurarVisibilidadSegunRol(usuario);
    
    // Cargar datos del usuario (ya sea del localStorage o del Servidor)
    // Primero ponemos lo que tenemos en mano (rápido) y luego consultamos al servidor
    mostrarDatosEnHtml(usuario);
    cargarPerfilDesdeServidor(usuario); 
});

/**
 * Función segura para evitar el error "Cannot set properties of null"
 */
function actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
        elemento.textContent = valor || "";
    }
}

function mostrarDatosEnHtml(usuario) {
    actualizarElemento("profileName", usuario.name);
    actualizarElemento("profileEmail", usuario.email);
    actualizarElemento("profilePhone", usuario.phone);
    actualizarElemento("profileEstado", usuario.estado);
    
    const btnLogo = document.querySelector(".profile__usuario");
    if(btnLogo) btnLogo.textContent = usuario.name ? usuario.name.charAt(0).toUpperCase() : "U";
}

function cargarPerfilDesdeServidor(usuario) {
    fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=readUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: usuario.idUsuario })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "success") {
            actualizarElemento("profileName", data.name);
            actualizarElemento("profileEmail", data.email);
            actualizarElemento("profilePhone", data.phone);
            actualizarElemento("profileEstado", data.estado);
        }
    })
    .catch(err => console.error("Error al refrescar datos:", err));
}

function configurarVisibilidadSegunRol(usuario) {
    const adminPanel = document.getElementById("adminPanel");
    const clientePanel = document.getElementById("clientePanel");

    if (adminPanel) adminPanel.style.display = (usuario.rol === "ROL-001") ? "block" : "none";
    if (clientePanel) clientePanel.style.display = (usuario.rol === "ROL-003") ? "block" : "none";
}

function setupLogout() {
    const logoutBtn = document.querySelector("#logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        localStorage.clear(); // Limpieza profunda
        alert("Sesión cerrada");
        window.location.href = "../../auth/login/login.html";
    });
}