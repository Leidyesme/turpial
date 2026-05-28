document.addEventListener("DOMContentLoaded", () => {
    setupRegister();
});

function setupRegister() {
    const formulario = document.querySelector("#registroForm");
    if (!formulario) return;

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        // 1. OBTENER DATOS (Usando los IDs correctos de tu HTML)
        const name = document.querySelector("#nombre").value.trim();
        const email = document.querySelector("#correo").value.trim();
        const phone = document.querySelector("#telefono").value.trim();
        const password = document.querySelector("#contraseña").value.trim();

        // 2. VALIDACIONES DE CAMPOS
        if (!name || !email || !phone || !password) {
            alert("Todos los campos son obligatorios");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Correo inválido");
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(phone)) {
            alert("El teléfono debe tener 10 números");
            return;
        }

        if (password.length < 6) {
            alert("La contraseña debe tener mínimo 6 caracteres");
            return;
        }

        // 3. CREAR EL OBJETO JSON CON LA ESTRUCTURA QUE RECIBIRÁ JAVA
        // Nota: Mapeamos los nombres idRol y estado de acuerdo a tu base de datos (Ej: id_rol 3 suele ser Cliente)
        const usuarioData = {
            name: name,
            correo: email,
            telefono: phone,
            contrasena: password,
            idRol: 3,          // ROL-003 correspondiente a Cliente según tu script
            estado: "Activo"   // Estado inicial por defecto de tu ENUM
        };

        // 4. ENVIAR LA PETICIÓN HTTP AL BACKEND (Tomcat)
        // Reemplaza 'PruebaServlet' por la URL real de tu servlet si cambia
        fetch("http://localhost:8080/turpialJava/PruebaServlet?accion=registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(usuarioData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json(); // Esperamos una respuesta JSON del servlet
        })
        .then(data => {
            // Evaluamos la respuesta enviada por Java
            if (data.status === "success") {
                alert("¡Usuario registrado correctamente en la Base de Datos!");
                window.location.href = "../login/login.html";
            } else {
                alert("Error al registrar: " + data.message);
            }
        })
        .catch(error => {
            console.error("Error en la conexión:", error);
            alert("No se pudo conectar con el servidor de El Turpial. Asegúrate de que Tomcat esté corriendo.");
        });
    });
}