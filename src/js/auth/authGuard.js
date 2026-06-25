(function() {
    // 1. Obtener el usuario activo del localStorage
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));

    // Calcular la ruta raíz /src de forma dinámica basándose en la posición de "views" en la URL actual.
    // Esto garantiza que la navegación funcione sin importar la profundidad de la carpeta.
    const pathParts = window.location.pathname.split('/');
    const viewsIndex = pathParts.indexOf('views');
    let pathToSrc = "../../../"; // fallback
    if (viewsIndex !== -1) {
        const depth = pathParts.length - 1 - viewsIndex;
        pathToSrc = "../".repeat(depth);
    }

    // 2. Si no hay sesión iniciada, redirigir inmediatamente a login.html
    if (!usuarioActivo) {
        // Evitar bucle de redirección si ya estamos en la página de login
        if (!window.location.pathname.includes("login.html")) {
            window.location.href = pathToSrc + "views/auth/login/login.html";
        }
        return;
    }

    // 3. ENRUTAMIENTO SENSIBLE A ROLES (RBAC):
    // Justificación de negocio: Evitar que usuarios accedan a carpetas restringidas para otros roles.
    const pathname = window.location.pathname;

    if (pathname.includes("/views/manager/")) {
        // Carpeta de administrador: requiere ROL-001 (Administrador)
        if (usuarioActivo.rol !== "ROL-001") {
            console.warn("Acceso denegado: Se requiere rol de Administrador. Redirigiendo...");
            redirectUserHome(usuarioActivo.rol, pathToSrc);
            return;
        }
    } else if (pathname.includes("/views/employee/")) {
        // Carpeta de empleado: requiere ROL-002 (Empleado)
        if (usuarioActivo.rol !== "ROL-002") {
            console.warn("Acceso denegado: Se requiere rol de Empleado. Redirigiendo...");
            redirectUserHome(usuarioActivo.rol, pathToSrc);
            return;
        }
    } else if (pathname.includes("/views/cliente/")) {
        // Carpeta de cliente:
        // Las vistas profile.html, editProfile.html y change.html son compartidas para todos los roles.
        // Las vistas de compras y devoluciones (categories, menu, fastCar, returns, orderHistory) son exclusivas de ROL-003.
        const isSharedPage = pathname.includes("profile.html") || 
                             pathname.includes("editProfile.html") || 
                             pathname.includes("change.html");
                             
        if (!isSharedPage && usuarioActivo.rol !== "ROL-003") {
            console.warn("Acceso denegado: Esta vista es exclusiva para clientes. Redirigiendo...");
            redirectUserHome(usuarioActivo.rol, pathToSrc);
            return;
        }
    }

    // 4. CONFIGURACIÓN DINÁMICA DE LA BARRA DE NAVEGACIÓN INFERIOR (botones--links):
    // Justificación UX: Ajusta dinámicamente los destinos del botón Inicio y la visibilidad del botón Carrito
    // según el rol del usuario logueado.
    document.addEventListener("DOMContentLoaded", () => {
        const navbar = document.querySelector(".botones--links");
        if (navbar) {
            const links = navbar.querySelectorAll("a");
            if (links.length >= 3) {
                const homeLink = links[0];
                const cartLink = links[1];
                const profileLink = links[2];

                // Asignar el enlace de perfil correcto para todos
                profileLink.href = pathToSrc + "views/cliente/profile/profile.html";

                if (usuarioActivo.rol === "ROL-001") {
                    // Administrador: Redirigir inicio a homePage de admin y ocultar el carrito
                    homeLink.href = pathToSrc + "views/manager/homePage/homePage.html";
                    cartLink.style.display = "none";
                } else if (usuarioActivo.rol === "ROL-002") {
                    // Empleado: Redirigir inicio a pantalla de pedidos y ocultar el carrito
                    homeLink.href = pathToSrc + "views/employee/orders/orders.html";
                    cartLink.style.display = "none";
                } else if (usuarioActivo.rol === "ROL-003") {
                    // Cliente: Redirigir inicio a categorías y mostrar carrito
                    homeLink.href = pathToSrc + "views/cliente/categories/categories.html";
                    cartLink.href = pathToSrc + "views/cliente/fastCar/fastCar.html";
                    cartLink.style.display = "flex";
                }
            }
        }
    });

    /**
     * Redirige al usuario a la página de inicio correspondiente a su rol.
     */
    function redirectUserHome(role, pathToSrc) {
        if (role === "ROL-001") {
            window.location.href = pathToSrc + "views/manager/homePage/homePage.html";
        } else if (role === "ROL-002") {
            window.location.href = pathToSrc + "views/employee/orders/orders.html";
        } else {
            window.location.href = pathToSrc + "views/cliente/categories/categories.html";
        }
    }
})();