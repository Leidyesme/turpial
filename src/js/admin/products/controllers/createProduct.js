import { getProducts, saveProducts } from "../services/productService.js";
import {generateId} from "../helpers/generateId.js";

export function setupAddProduct(loadProducts) {
    const addButton = document.querySelector("#addProductBtn");
    const modal = document.querySelector("#productModal");
    const form = document.querySelector("#productForm");
    const cancelBtn = document.querySelector("#cancelProdBtn");
    const categorySelect = document.querySelector("#prodCategory");

    if (!addButton || !modal || !form || !cancelBtn || !categorySelect) return;

    // Cargar categorías desde el backend al iniciar el controlador
    loadCategories(categorySelect);

    addButton.addEventListener("click", () => {
        form.reset();
        document.querySelector("#modalTitle").textContent = "Agregar Producto";
        modal.style.display = "flex";
    });

    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.querySelector("#prodName").value.trim();
        const price = Number(document.querySelector("#prodPrice").value);
        const stock = Number(document.querySelector("#prodStock").value);
        const category = categorySelect.options[categorySelect.selectedIndex].textContent;
        const image = document.querySelector("#prodImage").value.trim();

        const newProduct = {
            id: generateId(),
            name,
            price,
            stock,
            category,
            image,
            status: stock > 0 ? "Disponible" : "Agotado"
        };

        const products = getProducts();
        products.push(newProduct);
        saveProducts(products);

        modal.style.display = "none";
        loadProducts();
    });
}

async function loadCategories(selectElement) {
    try {
        const response = await fetch("http://localhost:8080/turpialJava/producto?accion=listCategories");
        if (response.ok) {
            const categories = await response.json();
            selectElement.innerHTML = '<option value="">Seleccione Categoría</option>';
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.idCategoria;
                option.textContent = cat.nombre;
                selectElement.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar categorías de la base de datos:", error);
    }
}