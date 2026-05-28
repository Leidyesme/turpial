import {
    getCategories
}
from "../services/categoryService.js";


import {
    updateCategory
}
from "./updateCategory.js";


import {
    deleteCategory
}
from "./deleteCategory.js";


export function loadCategories() {

    const categories =
        getCategories();


    renderCategories(
        categories
    );

}


function renderCategories(categories) {

    const container =
        document.querySelector(
            "#categoriesContainer"
        );


    container.innerHTML = "";


    if (categories.length === 0) {

        container.innerHTML = `

            <p class="categoriesAdmin__empty">

                No hay categorías registradas

            </p>

        `;

        return;

    }


    categories.forEach(category => {

        const card =
            document.createElement("div");


        card.classList.add(
            "categoriesAdmin__card",
            "section"
        );


        card.innerHTML = `

            <h2 class="categoriesAdmin__name">

                ${category.name}

            </h2>


            <div class="categoriesAdmin__actions">

                <button
                    class="btn btn--verde"

                    onclick="updateCategory(${category.id})">

                    Editar

                </button>


                <button
                    class="btn btn--rojo"

                    onclick="deleteCategory(${category.id})">

                    Eliminar

                </button>

            </div>

        `;


        container.appendChild(
            card
        );

    });

}


window.updateCategory =
    updateCategory;


window.deleteCategory =
    deleteCategory;