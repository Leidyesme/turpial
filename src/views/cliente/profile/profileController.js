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

/**
 * Configura la interfaz de usuario ocultando y mostrando botones de acción
 * de acuerdo con el rol del usuario activo para garantizar el principio de menor privilegio.
 * @param {Object} usuario - El objeto de usuario activo.
 */
function configurarVisibilidadSegunRol(usuario) {
    const adminPanel = document.getElementById("adminPanel");
    const clientePanel = document.getElementById("clientePanel");
    const orderHistoryLink = document.getElementById("orderHistoryLink");
    const orderHistoryBtn = document.getElementById("orderHistoryBtn");
    const activityHistoryLink = document.getElementById("activityHistoryLink");
    const changePasswordLink = document.getElementById("changePasswordLink");
    const editProfileLink = document.getElementById("editProfileLink");

    // LÓGICA DE CONTROL DE ACCESO BASADO EN ROLES (RBAC):
    // Se definen los permisos y la visibilidad de los elementos del DOM basándose en la propiedad 'rol' del usuario guardada en la sesión.
    if (usuario.rol === "ROL-001") {
        // Rol: Administrador
        // - Permitir: Cambiar contraseña, Editar perfil, Gestionar devoluciones (adminPanel), Historial General de Pedidos (orderHistoryLink).
        // - Restringir: Solicitar devoluciones (clientePanel), Historial de Actividades (activityHistoryLink - solo para clientes).
        if (adminPanel) adminPanel.style.display = "block";
        if (clientePanel) clientePanel.style.display = "none";
        
        if (orderHistoryLink) {
            orderHistoryLink.style.display = "block";
            orderHistoryLink.href = "../../manager/orders/orders.html";
            if (orderHistoryBtn) orderHistoryBtn.textContent = "Historial General de Pedidos";
        }
        if (activityHistoryLink) activityHistoryLink.style.display = "none";
        if (changePasswordLink) changePasswordLink.style.display = "block";
        if (editProfileLink) editProfileLink.style.display = "block";

    } else if (usuario.rol === "ROL-002") {
        // Rol: Empleado
        // - Permitir: Cambiar contraseña, Editar perfil, Cerrar sesión.
        // - Restringir: Todos los accesos a historiales (pedidos/actividades) y gestión de devoluciones.
        if (adminPanel) adminPanel.style.display = "none";
        if (clientePanel) clientePanel.style.display = "none";
        if (orderHistoryLink) orderHistoryLink.style.display = "none";
        if (activityHistoryLink) activityHistoryLink.style.display = "none";
        if (changePasswordLink) changePasswordLink.style.display = "block";
        if (editProfileLink) editProfileLink.style.display = "block";

    } else if (usuario.rol === "ROL-003") {
        // Rol: Cliente
        // - Permitir: Editar perfil, Solicitar devolución (clientePanel), Historial de Actividades (activityHistoryLink), Historial de Pedidos (orderHistoryLink), Cambiar contraseña y Cerrar sesión.
        // - Restringir: Panel de Control de Administración de devoluciones.
        if (adminPanel) adminPanel.style.display = "none";
        if (clientePanel) clientePanel.style.display = "block";
        
        if (orderHistoryLink) {
            orderHistoryLink.style.display = "block";
            orderHistoryLink.href = "../orderHistory/orderHistory.html";
            if (orderHistoryBtn) orderHistoryBtn.textContent = "Historial de Pedidos";
        }
        if (activityHistoryLink) activityHistoryLink.style.display = "block";
        if (changePasswordLink) changePasswordLink.style.display = "block";
        if (editProfileLink) editProfileLink.style.display = "block";
    }
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