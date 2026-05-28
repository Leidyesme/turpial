import {
    getProducts,
    saveProducts
}
from "../services/productService.js";


export function updateProduct(id) {

    const products =
        getProducts();


    const product =
        products.find(product =>

            product.id === id
        );


    if (!product) return;


    const newName =
        prompt(
            "Nuevo nombre",
            product.name
        );


    if (!newName) return;


    const newPrice =
        prompt(
            "Nuevo precio",
            product.price
        );


    const newStock =
        prompt(
            "Nuevo stock",
            product.stock
        );


    const newCategory =
        prompt(
            "Nueva categoría",
            product.category
        );


    product.name =
        newName;

    product.price =
        newPrice;

    product.stock =
        newStock;

    product.category =
        newCategory;


    saveProducts(products);


    location.reload();

}