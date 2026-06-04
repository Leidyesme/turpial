import {setupCartButtons} from "../../../js/cart/setupCartButtons.js";

const backButton =document.querySelector("#backButton");

if (backButton) {

    backButton.addEventListener("click", () => {

        window.location.href = "../categories/categories.html";

    });

}

// Inicializar los listeners para los botones de agregar al carrito
setupCartButtons();