(function() {
    // 1. Obtener el usuario activo del sessionStorage (prioritario por pestaña) o localStorage
    let usuarioActivo = JSON.parse(sessionStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (usuarioActivo) {
            sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioActivo));
        }
    }

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

    // 2.1 Si la cuenta del usuario se encuentra inactiva, denegar acceso total
    if (usuarioActivo.estado && usuarioActivo.estado.toLowerCase() === "inactivo") {
        alert("Su cuenta se encuentra inactiva. Comuníquese con el administrador.");
        sessionStorage.removeItem("usuarioActivo");
        localStorage.removeItem("usuarioActivo");
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
        // Actualizar datos visuales del usuario activo (nombre e inicial)
        const userBtn = document.querySelector(".categories__usuario, .usuario");
        if (userBtn && usuarioActivo.name) {
            userBtn.textContent = usuarioActivo.name.charAt(0).toUpperCase();
        }

        const welcomeTitle = document.querySelector(".categories__title");
        if (welcomeTitle && usuarioActivo.name) {
            welcomeTitle.textContent = `¡Bienvenido(a), ${usuarioActivo.name}!`;
        }

        // Configuración de la barra de navegación estándar
        const navbar = document.querySelector(".botones--links");
        if (navbar) {
            const links = navbar.querySelectorAll("a");
            if (links.length >= 3) {
                const homeLink = links[0];
                const cartLink = links[1];
                const profileLink = links[2];

                profileLink.href = pathToSrc + "views/cliente/profile/profile.html";

                if (usuarioActivo.rol === "ROL-001") {
                    homeLink.href = pathToSrc + "views/manager/homePage/homePage.html";
                    cartLink.style.display = "none";
                } else if (usuarioActivo.rol === "ROL-002") {
                    homeLink.href = pathToSrc + "views/employee/orders/orders.html";
                    cartLink.style.display = "none";
                } else if (usuarioActivo.rol === "ROL-003") {
                    homeLink.href = pathToSrc + "views/cliente/categories/categories.html";
                    cartLink.href = pathToSrc + "views/cliente/fastcar/fastcar.html";
                    cartLink.style.display = "flex";
                }
            }
        }

        // Crear botón flotante del carrito superpuesto para clientes
        const userRole = usuarioActivo ? (usuarioActivo.rol || usuarioActivo.idRol) : "ROL-003";
        const isClientRole = !userRole || userRole === "ROL-003";
        const isFastCarPage = window.location.pathname.toLowerCase().includes("fastcar");

        if (isClientRole && !isFastCarPage) {
            let floatBtn = document.querySelector(".floating-cart-btn");
            if (!floatBtn) {
                floatBtn = document.createElement("a");
                floatBtn.classList.add("floating-cart-btn");
                floatBtn.href = pathToSrc + "views/cliente/fastcar/fastcar.html";
                floatBtn.setAttribute("title", "Ver Carrito de Compras");
                floatBtn.innerHTML = `
                    <i class="fa-solid fa-cart-shopping"></i>
                    <span class="floating-cart-count">0</span>
                `;
                document.body.appendChild(floatBtn);
            }

            const updateCartBadge = () => {
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
                const countBadge = floatBtn.querySelector(".floating-cart-count");
                if (countBadge) {
                    countBadge.textContent = totalItems;
                    countBadge.style.display = totalItems > 0 ? "flex" : "none";
                }
            };

            updateCartBadge();
            setInterval(updateCartBadge, 800);
        }

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