import {getCategories, saveCategories} from "../services/categoryService.js";


import {
    generateCategoryId
}
from "../helpers/generateCategoryId.js";


export function setupAddCategory(loadCategories) {

    const form =
        document.querySelector(
            "#categoryForm"
        );


    form.addEventListener(
        "submit",

        (e) => {

            e.preventDefault();


            const name =
                document.querySelector(
                    "#categoryName"
                ).value;


            const categories =
                getCategories();


            const newCategory = {

                id:
                    generateCategoryId(),

                name

            };


            categories.push(
                newCategory
            );


            saveCategories(
                categories
            );


            form.reset();


            loadCategories();

        }
    );

}