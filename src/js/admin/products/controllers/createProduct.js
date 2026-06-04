import { getProducts, saveProducts } from "../services/productService.js";
import {generateId} from "../helpers/generateId.js";


export function setupAddProduct(loadProducts) {

    const addButton =
        document.querySelector(
            "#addProductBtn"
        );


    addButton.addEventListener("click", () => {

        const name =
            prompt("Nombre del producto");


        if (!name) return;


        const price =
            prompt("Precio");


        const stock =
            prompt("Stock");


        const category =
            prompt("Categoría");


        const image =
            prompt("Ruta imagen");


        const priceNum = Number(price);
        const stockNum = Number(stock);

        const newProduct = {

            id: generateId(),

            name,

            price: priceNum,

            stock: stockNum,

            category,

            image,

            status: stockNum > 0 ? "Disponible" : "Agotado"

        };


        const products =
            getProducts();


        products.push(newProduct);


        saveProducts(products);


        loadProducts();

    });

}