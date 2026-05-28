import {
    getCategories,
    saveCategories
}
from "../services/categoryService.js";


export function updateCategory(id) {

    const categories =
        getCategories();


    const category =
        categories.find(category =>

            category.id === id
        );


    if (!category) return;


    const newName =
        prompt(
            "Nuevo nombre categoría",
            category.name
        );


    if (!newName) return;


    category.name =
        newName;


    saveCategories(
        categories
    );


    location.reload();

}