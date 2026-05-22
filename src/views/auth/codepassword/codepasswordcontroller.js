document.addEventListener("DOMContentLoaded", () => {

    setupCodeValidation();

});


function setupCodeValidation() {

    const codeForm =
        document.querySelector("#codeForm");


    if (!codeForm) return;


    codeForm.addEventListener("submit", (e) => {

        e.preventDefault();


        // OBTENER CÓDIGO INPUT
        const inputCode =
            document.querySelector("#code")
            .value
            .trim();


        // VALIDAR VACÍO
        if (!inputCode) {

            alert("Debes ingresar el código");

            return;
        }


        // OBTENER CÓDIGO GUARDADO
        const savedCode =
            localStorage.getItem("recoveryCode");


        // VALIDAR CÓDIGO
        if (inputCode !== savedCode) {

            alert("Código incorrecto");

            return;
        }


        alert("Código verificado correctamente");


        // REDIRECCIONAR
        window.location.href =
            "../newPassword/newPassword.html";

    });

}