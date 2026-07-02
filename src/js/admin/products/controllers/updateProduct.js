import { loadProducts } from "./readProducts.js";

/**
 * Abre el modal de edición de producto pre-llenando sus campos y configurando
 * la carga de categorías desde la base de datos MySQL y el envío de cambios vía fetch PUT.
 *
 * @param {string|number} id Identificador único del producto.
 */
export async function updateProduct(id) {
    const editModal = document.querySelector("#editProductModal");
    const editForm = document.querySelector("#editProductForm");
    const categorySelect = document.querySelector("#editProdCategory");

    if (!editModal || !editForm) return;

    // 1. Obtener la lista local de productos para rellenar los datos iniciales
    const products = JSON.parse(localStorage.getItem("products")) || [];
    const product = products.find(p => String(p.id) === String(id));
    if (!product) {
        alert("Producto no encontrado.");
        return;
    }

    // 2. Rellenar los campos básicos del formulario del modal de edición
    document.querySelector("#editProdId").value = product.id;
    document.querySelector("#editProdName").value = product.name;
    document.querySelector("#editProdPrice").value = product.price;
    document.querySelector("#editProdStock").value = product.stock;
    document.querySelector("#editProdImage").value = product.image || "";

    // 3. Cargar las categorías en tiempo real desde el servlet (base de datos)
    try {
        const response = await fetch("http://localhost:8080/turpialJava/producto?accion=listCategories");
        if (response.ok) {
            const categories = await response.json();
            categorySelect.innerHTML = '<option value="">Seleccione Categoría</option>';
            categories.forEach(cat => {
                const option = document.createElement("option");
                option.value = cat.idCategoria; // ID de categoría en DB (CAT-XXX)
                option.textContent = cat.nombre;
                
                // Pre-seleccionar la categoría actual del producto
                if (cat.idCategoria === product.category || cat.nombre === product.category) {
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar categorías de la base de datos:", error);
    }

    // 4. Mostrar el modal en pantalla
    editModal.style.display = "flex";

    // 5. Configurar botón Cancelar
    const cancelBtn = document.querySelector("#cancelEditProdBtn");
    if (cancelBtn) {
        cancelBtn.onclick = () => {
            editModal.style.display = "none";
        };
    }

    // 6. Configurar envío del formulario de actualización (fetch PUT)
    editForm.onsubmit = async (e) => {
        e.preventDefault();

        const name = document.querySelector("#editProdName").value.trim();
        const priceVal = document.querySelector("#editProdPrice").value.trim();
        const stockVal = document.querySelector("#editProdStock").value.trim();
        const category = categorySelect.value;
        const image = document.querySelector("#editProdImage").value.trim();

        // Validaciones del lado del cliente
        if (!name) {
            alert("El nombre es obligatorio.");
            return;
        }

        const price = Number(priceVal);
        if (isNaN(price) || price <= 0) {
            alert("El precio debe ser un número mayor a cero.");
            return;
        }

        const stock = Number(stockVal);
        if (isNaN(stock) || stock < 0 || !Number.isInteger(stock)) {
            alert("El stock debe ser un entero mayor o igual a cero.");
            return;
        }

        if (!category) {
            alert("Debe seleccionar una categoría.");
            return;
        }

        // Cargar el payload JSON para enviar al Servlet
        const payload = {
            idProducto: id,
            name: name,
            price: price,
            stock: stock,
            category: category,
            image: image
        };

        try {
            console.log("[DEBUG - updateProduct] Enviando petición PUT a servlet con payload:", payload);

            const response = await fetch("http://localhost:8080/turpialJava/producto", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Error en respuesta HTTP: status " + response.status);
            }

            const data = await response.json();
            if (data.status === "success") {
                alert("¡Producto actualizado con éxito en la base de datos MySQL!");
                editModal.style.display = "none";
                await loadProducts(); // Recargar el listado de productos de forma dinámica
            } else {
                alert("Error al actualizar en la base de datos: " + data.message);
            }
        } catch (error) {
            console.error("Error al enviar petición PUT:", error);
            alert("No se pudo conectar con el servidor. Verifica que Tomcat y MySQL estén activos.");
        }
    };
}