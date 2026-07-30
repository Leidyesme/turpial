import {
    getProducts,
    saveProducts
}
from "../services/productService.js";


export function deleteProduct(id) {

    const confirmDelete =
        confirm(
            "¿Eliminar producto?"
        );


    if (!confirmDelete) return;


    let products =
        getProducts();


    products = products.filter(product =>
        String(product.id) !== String(id)
    );


    saveProducts(products);


    location.reload();

}