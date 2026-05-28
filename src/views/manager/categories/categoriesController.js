import {
    setupAddCategory
}
from "../../js/admin/categories/controllers/createCategory.js";


import {
    loadCategories
}
from "../../js/admin/categories/controllers/readCategories.js";


document.addEventListener(
    "DOMContentLoaded",

    () => {

        loadCategories();

        setupAddCategory(loadCategories);

    }
);