import {
    addToCart
}
from "./cart.js";

export function setupCartButtons() {
    const buttons = document.querySelectorAll(".addToCartBtn, .add-to-cart");

    // Función auxiliar para actualizar la interfaz de cada tarjeta con datos del producto
    const updateCardUI = (button, matchedProduct) => {
        const prodId = matchedProduct.id || matchedProduct.idProducto || "";
        const totalStock = Number(matchedProduct.stock);

        // Calcular cuántas unidades de este producto ya están guardadas en el carrito
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        const inCartItem = cart.find(item => 
            (prodId && (item.id === prodId || item.idProducto === prodId)) ||
            (item.name && matchedProduct.name && item.name.toLowerCase() === matchedProduct.name.toLowerCase())
        );
        const inCartQty = inCartItem ? Number(inCartItem.quantity || 0) : 0;
        
        // Stock efectivo disponible para agregar
        const effectiveStock = Math.max(0, totalStock - inCartQty);
        const isAgotado = matchedProduct.status === "Agotado" || effectiveStock <= 0;

        button.dataset.id = prodId; // Guardar ID de base de datos
        button.dataset.idProducto = prodId;
        button.dataset.price = matchedProduct.price;
        button.dataset.stock = effectiveStock;
        button.dataset.status = isAgotado ? "Agotado" : "Disponible";

        if (isAgotado) {
            button.classList.add("add-to-cart--disabled");
        } else {
            button.classList.remove("add-to-cart--disabled");
        }

        const card = button.closest('.section, .breakfast__item, .lunch__item, .fastFood__item, .drinks__item, .bakery__item, .promotion__item');
        if (card) {
            // 1. Actualizar texto de precio
            const priceEl = card.querySelector('[class*="price"]');
            if (priceEl) {
                priceEl.textContent = `Precio: $${Number(matchedProduct.price).toLocaleString()}`;
            }

            // 2. Actualizar botón de estado (Disponible / Agotado) usando classList
            const statusBtn = card.querySelector('.state button, .breakfast__state button, .lunch__state button, .fastFood__state button, .drinks__state button, .bakery__state button, .promotion__state button');
            if (statusBtn) {
                statusBtn.textContent = isAgotado ? "Agotado" : "Disponible";
                if (isAgotado) {
                    statusBtn.classList.remove("btn--verde");
                    statusBtn.classList.add("btn--rojo");
                } else {
                    statusBtn.classList.remove("btn--rojo");
                    statusBtn.classList.add("btn--verde");
                }
            }

            // 3. Mostrar stock destacado usando classList exclusivo
            let stockEl = card.querySelector('.product-stock-display');
            if (!stockEl) {
                stockEl = document.createElement('p');
                stockEl.classList.add('product-stock-display');
                if (priceEl) {
                    priceEl.parentNode.insertBefore(stockEl, priceEl.nextSibling);
                } else {
                    card.appendChild(stockEl);
                }
            }
            
            if (isAgotado) {
                stockEl.textContent = "Sin stock disponible";
                stockEl.classList.remove("product-stock--disponible");
                stockEl.classList.add("product-stock--agotado");
            } else {
                stockEl.textContent = `Stock: ${effectiveStock} unidades`;
                stockEl.classList.remove("product-stock--agotado");
                stockEl.classList.add("product-stock--disponible");
            }
        }
    };

    // Actualización rápida basada en lo que hay en localStorage y el DOM activo
    const updateAllFromLocal = () => {
        const productsDb = JSON.parse(localStorage.getItem("products")) || [];
        const activeButtons = document.querySelectorAll(".addToCartBtn, .add-to-cart");
        activeButtons.forEach(button => {
            const productName = button.dataset.name;
            let matchedProduct = productsDb.find(p => p.name && productName && (p.name.toLowerCase() === productName.toLowerCase() || productName.toLowerCase().includes(p.name.toLowerCase())));
            
            // Fallback inmediato desde dataset si aún no está sincronizado en localStorage
            if (!matchedProduct && productName) {
                matchedProduct = {
                    id: button.dataset.id || button.dataset.idProducto || "",
                    idProducto: button.dataset.idProducto || button.dataset.id || "",
                    name: productName,
                    price: Number(button.dataset.price || 0),
                    stock: Number(button.dataset.stock || 10),
                    status: button.dataset.status || "Disponible"
                };
            }

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
                const matchedDb = dbProducts.find(p => p.nombre === localP.name || (localP.name && p.nombre && localP.name.toLowerCase().includes(p.nombre.toLowerCase())));
                if (matchedDb) {
                    const freshStock = Number(matchedDb.stock);
                    return {
                        ...localP,
                        id: matchedDb.idProducto,
                        idProducto: matchedDb.idProducto,
                        price: Number(matchedDb.precio),
                        stock: freshStock,
                        status: freshStock > 0 ? "Disponible" : "Agotado"
                    };
                }
                return localP;
            });

            // Si hay productos en el backend que no estaban localmente, agregarlos
            dbProducts.forEach(dbP => {
                const alreadyExists = updatedProducts.some(p => p.name === dbP.nombre);
                if (!alreadyExists) {
                    const freshStock = Number(dbP.stock);
                    updatedProducts.push({
                        id: dbP.idProducto,
                        idProducto: dbP.idProducto,
                        name: dbP.nombre,
                        price: Number(dbP.precio),
                        stock: freshStock,
                        status: freshStock > 0 ? "Disponible" : "Agotado",
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
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);
        }

        newButton.addEventListener("click", (e) => {
            e.preventDefault();

            // Bloquear si el producto está sin stock o marcado como Agotado
            if (newButton.dataset.status === "Agotado" || Number(newButton.dataset.stock) <= 0) {
                alert(`El producto "${newButton.dataset.name}" está agotado y no se puede agregar al carrito.`);
                return;
            }

            const product = {
                id: newButton.dataset.id || newButton.dataset.idProducto || "",
                idProducto: newButton.dataset.idProducto || newButton.dataset.id || "",
                name: newButton.dataset.name,
                price: Number(newButton.dataset.price),
                stock: Number(newButton.dataset.stock || 0),
                image: newButton.dataset.image,
                status: newButton.dataset.status || "Disponible"
            };
            addToCart(product);
            updateAllFromLocal();
            ensureFloatingCart();
        });
    });

    ensureFloatingCart();
}

function ensureFloatingCart() {
    if (window.location.pathname.toLowerCase().includes("fastcar")) return;
    
    let floatBtn = document.querySelector(".floating-cart-btn");
    if (!floatBtn) {
        floatBtn = document.createElement("a");
        floatBtn.classList.add("floating-cart-btn");

        const pathParts = window.location.pathname.split('/');
        const viewsIndex = pathParts.indexOf('views');
        let pathToSrc = "../../../";
        if (viewsIndex !== -1) {
            const depth = pathParts.length - 1 - viewsIndex;
            pathToSrc = "../".repeat(depth);
        }

        floatBtn.href = pathToSrc + "views/cliente/fastcar/fastcar.html";
        floatBtn.setAttribute("title", "Ver Carrito de Compras");
        floatBtn.innerHTML = `
            <i class="fa-solid fa-cart-shopping"></i>
            <span class="floating-cart-count">0</span>
        `;
        document.body.appendChild(floatBtn);
    }

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalItems = cart.reduce((acc, item) => acc + (item.quantity || 1), 0);
    const countBadge = floatBtn.querySelector(".floating-cart-count");
    if (countBadge) {
        countBadge.textContent = totalItems;
        countBadge.style.display = totalItems > 0 ? "flex" : "none";
    }
}