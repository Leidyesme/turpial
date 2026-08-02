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
    
    const hiddenImgInput = document.querySelector("#editProdImage");
    const imgFilePicker = document.querySelector("#editProdImageFile");
    const imgTag = document.querySelector("#editProdImageTag");

    if (hiddenImgInput) hiddenImgInput.value = product.image || "";
    if (imgFilePicker) imgFilePicker.value = "";
    if (imgTag) {
        if (product.image) {
            imgTag.src = product.image;
            imgTag.style.display = "block";
        } else {
            imgTag.style.display = "none";
            imgTag.src = "";
        }
    }

    if (imgFilePicker) {
        imgFilePicker.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (hiddenImgInput) hiddenImgInput.value = event.target.result;
                    if (imgTag) {
                        imgTag.src = event.target.result;
                        imgTag.style.display = "block";
                    }
                };
                reader.readAsDataURL(file);
            }
        };
    }

    const defaultCategories = [
        { idCategoria: "CAT-001", nombre: "Desayunos" },
        { idCategoria: "CAT-002", nombre: "Almuerzos" },
        { idCategoria: "CAT-003", nombre: "Bebidas" },
        { idCategoria: "CAT-004", nombre: "Panadería y repostería" },
        { idCategoria: "CAT-005", nombre: "Comidas Rapidas" },
        { idCategoria: "CAT-006", nombre: "Promociones" }
    ];

    const matchCategory = (catId, catName, prodCategory) => {
        if (!prodCategory) return false;
        const pCat = String(prodCategory).toLowerCase().trim();
        const cId = String(catId).toLowerCase().trim();
        const cName = String(catName).toLowerCase().trim();
        if (cId === pCat || cName === pCat) return true;
        if ((pCat.includes("desayuno") && cName.includes("desayuno")) ||
            (pCat.includes("almuerzo") && cName.includes("almuerzo")) ||
            (pCat.includes("bebida") && cName.includes("bebida")) ||
            (pCat.includes("panad") && cName.includes("panad")) ||
            (pCat.includes("rapida") && cName.includes("rapida")) ||
            (pCat.includes("promo") && cName.includes("promo"))) {
            return true;
        }
        return false;
    };

    const populateCategoryOptions = (categories) => {
        categorySelect.innerHTML = '<option value="">Seleccione Categoría</option>';
        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.idCategoria;
            option.textContent = cat.nombre;
            if (matchCategory(cat.idCategoria, cat.nombre, product.category)) {
                option.selected = true;
            }
            categorySelect.appendChild(option);
        });
    };

    // Pre-llenar inmediatamente con categorías por defecto por si falla o demora el servidor
    populateCategoryOptions(defaultCategories);

    // 3. Cargar las categorías en tiempo real desde el servlet (base de datos)
    try {
        const response = await fetch("http://localhost:8080/turpialJava/producto?accion=listCategories");
        if (response.ok) {
            const categories = await response.json();
            if (Array.isArray(categories) && categories.length > 0) {
                populateCategoryOptions(categories);
            }
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

        let formattedId = String(id);
        if (/^\d+$/.test(formattedId)) {
            formattedId = "PROD-" + formattedId.padStart(3, '0');
        }

        const payload = {
            idProducto: formattedId,
            name: name,
            price: price,
            stock: stock,
            category: category,
            image: image
        };

        const categoryText = categorySelect.options[categorySelect.selectedIndex] ? categorySelect.options[categorySelect.selectedIndex].text : category;

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
                const localProds = JSON.parse(localStorage.getItem("products")) || [];
                const targetIdx = localProds.findIndex(p => String(p.id) === String(id));
                if (targetIdx !== -1) {
                    localProds[targetIdx].name = name;
                    localProds[targetIdx].price = price;
                    localProds[targetIdx].stock = stock;
                    localProds[targetIdx].category = categoryText;
                    localProds[targetIdx].image = image;
                    localProds[targetIdx].status = stock > 0 ? "Disponible" : "Agotado";
                    localStorage.setItem("products", JSON.stringify(localProds));
                }
                alert("¡Producto actualizado con éxito en la base de datos MySQL!");
                editModal.style.display = "none";
                loadProducts();
            } else {
                alert("Error al actualizar en la base de datos: " + data.message);
            }
        } catch (error) {
            console.error("Error al enviar petición PUT:", error);
            const localProds = JSON.parse(localStorage.getItem("products")) || [];
            const targetIdx = localProds.findIndex(p => String(p.id) === String(id));
            if (targetIdx !== -1) {
                localProds[targetIdx].name = name;
                localProds[targetIdx].price = price;
                localProds[targetIdx].stock = stock;
                localProds[targetIdx].category = categoryText;
                localProds[targetIdx].image = image;
                localProds[targetIdx].status = stock > 0 ? "Disponible" : "Agotado";
                localStorage.setItem("products", JSON.stringify(localProds));
                alert("Producto actualizado localmente.");
                editModal.style.display = "none";
                loadProducts();
            } else {
                alert("No se pudo conectar con el servidor para actualizar el producto.");
            }
        }
    };
}