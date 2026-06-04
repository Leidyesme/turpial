import {setupCartButtons} from "../../../js/cart/setupCartButtons.js";


setupCartButtons();

const backButton =document.querySelector("#backButton");

if (backButton) {

    backButton.addEventListener("click", () => {

        window.location.href = "../categories/categories.html";

    });

}