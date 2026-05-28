import {
    getCategories,
    saveCategories
}
from "../services/categoryService.js";


export function deleteCategory(id) {

    const confirmDelete =
        confirm(
            "¿Eliminar categoría?"
        );


    if (!confirmDelete) return;


    let categories =
        getCategories();


    categories =
        categories.filter(category =>

            category.id !== id
        );


    saveCategories(
        categories
    );


    location.reload();

}