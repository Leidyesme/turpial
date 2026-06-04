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
            // Guardar usuario en localStorage para que authGuard lo detecte
            localStorage.setItem("usuarioActivo", JSON.stringify(data.usuario));
            
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
