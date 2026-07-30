// Formulario login
const loginForm = document.querySelector("#login__Form");

// Evento submit
loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Se obtiene los datos del formulario
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    // Objeto usuario
    const userData = { email, password };

    try {
        // Petición al backend UsuarioServlet
        const response = await fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });

        // Se convierte la respuesta a JSON
        const data = await response.json();

        console.log(data);

        // Se verifica login
        if (data.status === "success") {

            // Creamos un objeto limpio que SIEMPRE tenga la propiedad 'rol'
        const usuarioGuardar = {
            ...data.usuario,           // Copia todos los datos (name, idUsuario, etc.)
            rol: data.usuario.idRol    // Creamos la propiedad 'rol' con el valor de 'idRol'
        };

        // Guardamos este objeto en sessionStorage (para pestañas independientes) y en localStorage
        sessionStorage.setItem("usuarioActivo", JSON.stringify(usuarioGuardar));
        localStorage.setItem("usuarioActivo", JSON.stringify(usuarioGuardar));
            
            // Guardar historial local
            guardarHistorial(email, "Usuario", "Inició sesión");
            
            alert("Inicio de sesión exitoso");
            
            // Redirección según el rol
            if (data.usuario.idRol === "ROL-001") {
                window.location.href = "../../manager/homePage/homePage.html";
            } else if (data.usuario.idRol === "ROL-002") {
                window.location.href = "../../employee/orders/orders.html";
            } else {
                window.location.href = "../../cliente/categories/categories.html";
            }
        } else {
            alert(data.message || "Correo o contraseña incorrectos");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
});
