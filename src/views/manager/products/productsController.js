import {
    setupAddProduct
}
from "../../../js/admin/products/controllers/createProduct.js";


import {
    loadProducts,
    setupProductSearch
}
from "../../../js/admin/products/controllers/readProducts.js";

import {
    updateProduct
}
from "../../../js/admin/products/controllers/updateProduct.js";

import {
    deleteProduct
}
from "../../../js/admin/products/controllers/deleteProduct.js";

window.updateProduct = updateProduct;
window.deleteProduct = deleteProduct;

document.addEventListener(
    "DOMContentLoaded",
    () => {
        // READ
        loadProducts();

        // SEARCH FILTER
        setupProductSearch();

        // CREATE
        setupAddProduct(loadProducts);
    }
);