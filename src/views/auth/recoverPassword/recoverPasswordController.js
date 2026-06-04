document.addEventListener("DOMContentLoaded", () => {

    setupRecoverPassword();

});


function setupRecoverPassword() {

    const recoverForm =
        document.querySelector("#recoverForm");


    if (!recoverForm) return;


    recoverForm.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER EMAIL
        const email =
            document.querySelector("#email")
            .value
            .trim();


        // VALIDAR CAMPO
        if (!email) {

            alert("El correo es obligatorio");

            return;
        }


        // VALIDAR FORMATO EMAIL
        const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailRegex.test(email)) {

            alert("Correo inválido");

            return;
        }


        // Consultar al backend si el correo existe
        fetch("http://localhost:8080/turpialJava/UsuarioServlet?accion=existsEmail", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor");
            }
            return response.json();
        })
        .then(data => {
            if (data.status === "success" && data.exists) {
                // GUARDAR EMAIL TEMPORAL
                localStorage.setItem("recoveryEmail", email);

                alert("Correo verificado correctamente");

                const recoveryCode = Math.floor(100000 + Math.random() * 900000);

                localStorage.setItem("recoveryCode", recoveryCode);

                // REDIRECCIONAR
                window.location.href = "../codepassword/codepassword.html";
            } else {
                alert("El correo no está registrado");
            }
        })
        .catch(error => {
            console.error("Error al verificar correo:", error);
            alert("No se pudo conectar con el servidor de El Turpial.");
        });

    });

}