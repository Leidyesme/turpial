import {
    setupAddProduct
}
from "../../js/admin/products/controllers/createProduct.js";


import {
    loadProducts
}
from "../../js/admin/products/controllers/readProducts.js";


document.addEventListener(
    "DOMContentLoaded",

    () => {

        // READ
        loadProducts();


        // CREATE
        setupAddProduct(loadProducts);

    }
);