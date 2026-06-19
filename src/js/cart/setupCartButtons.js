import {
    addToCart
}
from "./cart.js";

export function setupCartButtons() {
    const buttons = document.querySelectorAll(".addToCartBtn, .add-to-cart");

    // Función auxiliar para actualizar la interfaz de cada tarjeta con datos del producto
    const updateCardUI = (button, matchedProduct) => {
        button.dataset.id = matchedProduct.id; // Guardar ID de base de datos
        button.dataset.price = matchedProduct.price;
        button.dataset.status = matchedProduct.status;

        const card = button.closest('.section, .breakfast__item, .lunch__item, .fastFood__item, .drinks__item, .bakery__item, .promotion__item');
        if (card) {
            // 1. Actualizar texto de precio
            const priceEl = card.querySelector('[class*="price"]');
            if (priceEl) {
                priceEl.textContent = `Precio: $${Number(matchedProduct.price).toLocaleString()}`;
            }

            // 2. Actualizar botón de estado (Disponible / Agotado)
            const statusBtn = card.querySelector('.state button, .breakfast__state button, .lunch__state button, .fastFood__state button, .drinks__state button, .bakery__state button, .promotion__state button');
            if (statusBtn) {
                statusBtn.textContent = matchedProduct.status;
                if (matchedProduct.status === "Agotado") {
                    statusBtn.className = "btn btn--rojo";
                } else {
                    statusBtn.className = "btn btn--verde";
                }
            }

            // 3. Mostrar stock disponible antes de añadir al carrito
            let stockEl = card.querySelector('.product-stock-display');
            if (!stockEl) {
                stockEl = document.createElement('p');
                stockEl.className = 'product-stock-display';
                stockEl.style.fontSize = '0.9em';
                stockEl.style.color = '#555';
                stockEl.style.margin = '5px 0';
                stockEl.style.fontWeight = 'bold';
                if (priceEl) {
                    priceEl.parentNode.insertBefore(stockEl, priceEl.nextSibling);
                } else {
                    card.appendChild(stockEl);
                }
            }
            stockEl.innerHTML = `Stock disponible: <span style="color: ${matchedProduct.stock > 0 ? 'var(--green)' : 'var(--red)'};">${matchedProduct.stock}</span>`;
        }
    };

    // Actualización rápida basada en lo que hay en localStorage
    const updateAllFromLocal = () => {
        const productsDb = JSON.parse(localStorage.getItem("products")) || [];
        buttons.forEach(button => {
            const productName = button.dataset.name;
            const matchedProduct = productsDb.find(p => p.name === productName);
            if (matchedProduct) {
                updateCardUI(button, matchedProduct);
            }
        });
    };

    updateAllFromLocal();

    // Sincronizar stock y productos en tiempo real desde el Servlet
    fetch("http://localhost:8080/turpialJava/producto")
        .then(res => {
            if (res.ok) return res.json();
            throw new Error();
        })
        .then(dbProducts => {
            const productsDb = JSON.parse(localStorage.getItem("products")) || [];
            
            // Mapear y combinar los datos frescos del backend con los de localStorage
            const updatedProducts = productsDb.map(localP => {
                const matchedDb = dbProducts.find(p => p.nombre === localP.name);
                if (matchedDb) {
                    return {
                        ...localP,
                        id: matchedDb.idProducto, // Mantener el ID real de la base de datos (Ej: PROD-001)
                        price: Number(matchedDb.precio),
                        stock: Number(matchedDb.stock),
                        status: Number(matchedDb.stock) > 0 ? "Disponible" : "Agotado"
                    };
                }
                return localP;
            });

            // Si hay productos en el backend que no estaban localmente, agregarlos
            dbProducts.forEach(dbP => {
                const alreadyExists = updatedProducts.some(p => p.name === dbP.nombre);
                if (!alreadyExists) {
                    updatedProducts.push({
                        id: dbP.idProducto,
                        name: dbP.nombre,
                        price: Number(dbP.precio),
                        stock: Number(dbP.stock),
                        status: Number(dbP.stock) > 0 ? "Disponible" : "Agotado",
                        category: "Otros",
                        image: dbP.imagen
                    });
                }
            });

            localStorage.setItem("products", JSON.stringify(updatedProducts));
            updateAllFromLocal();
        })
        .catch(err => {
            console.warn("No se pudo conectar con el backend para sincronizar stock:", err);
        });

    // Configurar listener para agregar productos al carrito
    buttons.forEach(button => {
        // Remover listener duplicado si existía
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);

        newButton.addEventListener("click", (e) => {
            e.preventDefault();
            const product = {
                id: newButton.dataset.id,
                name: newButton.dataset.name,
                price: Number(newButton.dataset.price),
                image: newButton.dataset.image,
                status: newButton.dataset.status || "Disponible"
            };
            addToCart(product);
        });
    });
}