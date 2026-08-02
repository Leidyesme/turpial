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

    const prodImageFile = document.querySelector("#prodImageFile");
    const prodImageHidden = document.querySelector("#prodImage");
    const prodImageTag = document.querySelector("#prodImageTag");

    if (prodImageFile) {
        prodImageFile.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (prodImageHidden) prodImageHidden.value = event.target.result;
                    if (prodImageTag) {
                        prodImageTag.src = event.target.result;
                        prodImageTag.style.display = "block";
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }

    addButton.addEventListener("click", () => {
        form.reset();
        if (prodImageHidden) prodImageHidden.value = "";
        if (prodImageTag) {
            prodImageTag.src = "";
            prodImageTag.style.display = "none";
        }
        document.querySelector("#modalTitle").textContent = "Agregar Producto";
        modal.style.display = "flex";
    });

    cancelBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    form.addEventListener("submit", async (e) => {
        // Evitar la recarga automática de la página al enviar el formulario
        e.preventDefault();

        // Capturar y limpiar los datos ingresados
        const name = document.querySelector("#prodName").value.trim();
        const priceVal = document.querySelector("#prodPrice").value.trim();
        const stockVal = document.querySelector("#prodStock").value.trim();
        const category = categorySelect.value; // ID de la categoría (ej: CAT-001)
        const image = document.querySelector("#prodImage").value.trim();

        // 1. Validar que el nombre no esté vacío
        if (!name) {
            alert("El nombre del producto es obligatorio.");
            return;
        }

        // 2. Validar precio positivo
        if (!priceVal) {
            alert("El precio del producto es obligatorio.");
            return;
        }
        const price = Number(priceVal);
        if (isNaN(price) || price <= 0) {
            alert("El precio debe ser un número mayor a cero.");
            return;
        }

        // 3. Validar stock entero no negativo
        if (!stockVal) {
            alert("El stock del producto es obligatorio.");
            return;
        }
        const stock = Number(stockVal);
        if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            alert("El stock debe ser un número entero mayor o igual a cero.");
            return;
        }

        // 4. Validar que se haya seleccionado una categoría
        if (!category || category === "") {
            alert("Debe seleccionar una categoría válida.");
            return;
        }

        // Estructurar el JSON que el servlet de Java espera (name, price, stock, category)
        const payload = {
            name,
            price,
            stock,
            category,
            image
        };

        try {
            // Imprimir logs en consola del navegador para depuración
            console.log("[DEBUG - createProduct] Enviando petición POST a servlet con payload:", payload);

            // Realizar la petición POST asíncrona hacia el servlet de Java
            const response = await fetch("http://localhost:8080/turpialJava/producto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error en la respuesta del servidor HTTP: Status " + response.status);
            }

            const data = await response.json();
            
            // Si el backend guardó con éxito
            if (data.status === "success") {
                alert("¡Producto registrado con éxito en la base de datos MySQL!");
                modal.style.display = "none";
                await loadProducts(); // Recargar el catálogo dinámicamente
            } else {
                alert("Error al registrar en la base de datos: " + data.message);
            }
        } catch (error) {
            console.error("Error en la petición POST hacia el Servlet:", error);
            alert("No se pudo conectar con el servidor. Verifica que Tomcat y MySQL estén activos.");
        }
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