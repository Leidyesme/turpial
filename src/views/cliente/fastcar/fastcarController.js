const cartContainer =
    document.querySelector(
        "#cartContainer"
    );


const cartTotal =
    document.querySelector(
        "#cartTotal"
    );


const checkoutButton =
    document.querySelector(
        "#checkoutButton"
    );


const savedAddressCard = document.querySelector("#savedAddressCard");
const savedAddressText = document.querySelector("#savedAddressText");
const useSavedAddress = document.querySelector("#useSavedAddress");
const useNewAddress = document.querySelector("#useNewAddress");
const newAddressInput = document.querySelector("#newAddressInput");
const tipoPedidoSelect = document.querySelector("#tipoPedido");
const mesaContainer = document.querySelector("#mesaContainer");
const numeroMesaInput = document.querySelector("#numeroMesaInput");
const deliveryAddressContainer = document.querySelector("#deliveryAddressContainer");
const montoRecibidoInput = document.querySelector("#montoRecibidoInput");
const vueltoContainer = document.querySelector("#vueltoContainer");
const vueltoValor = document.querySelector("#vueltoValor");


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));


renderCart();
initAddressSelection();
initDeliveryTypeNotice();

function initDeliveryTypeNotice() {
    if (!tipoPedidoSelect) return;
    
    let noticeEl = document.querySelector("#paymentNotice");
    if (!noticeEl) {
        noticeEl = document.createElement("p");
        noticeEl.id = "paymentNotice";
        noticeEl.classList.add("product-stock-display");
        if (tipoPedidoSelect.parentNode) {
            tipoPedidoSelect.parentNode.insertBefore(noticeEl, tipoPedidoSelect.nextSibling);
        }
    }

    const updateNotice = () => {
        const val = tipoPedidoSelect.value;
        if (val === "Para consumir aquí") {
            if (mesaContainer) mesaContainer.style.display = "block";
            if (deliveryAddressContainer) deliveryAddressContainer.style.display = "none";
            noticeEl.textContent = "Para consumir en el local: Pagas al finalizar tu consumo.";
            noticeEl.classList.remove("product-stock--disponible");
            noticeEl.classList.add("product-stock--agotado");
        } else if (val === "Para recoger") {
            if (mesaContainer) mesaContainer.style.display = "none";
            if (deliveryAddressContainer) deliveryAddressContainer.style.display = "none";
            noticeEl.textContent = "Para llevar / recoger: Pagas al realizar la orden.";
            noticeEl.classList.remove("product-stock--agotado");
            noticeEl.classList.add("product-stock--disponible");
        } else {
            if (mesaContainer) mesaContainer.style.display = "none";
            if (deliveryAddressContainer) deliveryAddressContainer.style.display = "block";
            noticeEl.textContent = "A domicilio: Pagas al realizar la orden.";
            noticeEl.classList.remove("product-stock--agotado");
            noticeEl.classList.add("product-stock--disponible");
        }
    };

    tipoPedidoSelect.addEventListener("change", updateNotice);
    updateNotice();
}

function initAddressSelection() {
    if (!usuarioActivo) return;

    if (usuarioActivo.direccion && usuarioActivo.direccion.trim() !== "") {
        savedAddressText.textContent = usuarioActivo.direccion;
        useSavedAddress.checked = true;
        newAddressInput.disabled = true;
    } else {
        savedAddressText.textContent = "No tienes dirección registrada";
        useSavedAddress.disabled = true;
        useNewAddress.checked = true;
        newAddressInput.disabled = false;
    }

    useSavedAddress.addEventListener("change", () => {
        if (useSavedAddress.checked) {
            newAddressInput.disabled = true;
            newAddressInput.value = "";
        }
    });

    useNewAddress.addEventListener("change", () => {
        if (useNewAddress.checked) {
            newAddressInput.disabled = false;
            newAddressInput.focus();
        }
    });
}


function renderCart() {

    cartContainer.innerHTML = "";


    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <p>
                El carrito está vacío
            </p>

        `;

        cartTotal.textContent =
            "Total: $0";

        return;

    }


    let total = 0;


    cart.forEach((product, index) => {

        total +=
            product.price *
            product.quantity;


        const card =
            document.createElement("div");


        card.classList.add(
            "fastcar__product"
        );


        // Centralizar rutas de imágenes de forma robusta para compatibilidad con Live Server, Vite, file:// y Data URLs (Base64)
        let imagePath = "/turpial.png";
        if (product.image && product.image !== "null" && product.image !== "undefined" && product.image.trim() !== "") {
            if (product.image.startsWith("http://") || product.image.startsWith("https://") || product.image.startsWith("data:")) {
                imagePath = product.image;
            } else {
                let cleanPath = product.image;
                if (cleanPath.includes("public/")) {
                    cleanPath = cleanPath.substring(cleanPath.indexOf("public/") + 7);
                }
                if (cleanPath.startsWith("/")) {
                    cleanPath = cleanPath.substring(1);
                }
                // Todas las vistas HTML están a 4 niveles de profundidad de la raíz (src/views/*/*/*.html)
                imagePath = "../../../../public/" + cleanPath;
            }
        }

        card.innerHTML = `

            <img
                src="${imagePath}"

                class="fastcar__img">

            <div class="fastcar__product-info">
                <h3>
                    ${product.name}
                </h3>

                <p class="fastcar__product-price">
                    $${product.price}
                </p>
            </div>

            <div class="fastcar__qty-controls">
                <button class="fastcar__qty-btn btn-dec" data-index="${index}">-</button>
                <span class="fastcar__qty-val">${product.quantity}</span>
                <button class="fastcar__qty-btn btn-inc" data-index="${index}">+</button>
            </div>

            <button class="fastcar__delete-btn" data-index="${index}">
                <i class="fa-solid fa-trash-can"></i>
            </button>

        `;


        cartContainer.appendChild(
            card
        );

    });


    cartTotal.textContent =
        `Total: $${total}`;

    setupCartControls();

}


function setupCartControls() {
    const decButtons = document.querySelectorAll(".btn-dec");
    const incButtons = document.querySelectorAll(".btn-inc");
    const deleteButtons = document.querySelectorAll(".fastcar__delete-btn");

    decButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            saveCartAndRender();
        });
    });

    incButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            const productsDb = JSON.parse(localStorage.getItem("products")) || [];
            const matchedDb = productsDb.find(item => item.name === cart[index].name);
            if (matchedDb) {
                const maxStock = parseInt(matchedDb.stock) || 0;
                if (cart[index].quantity >= maxStock) {
                    alert(`No puedes agregar más de este producto. Stock disponible: ${maxStock}`);
                    return;
                }
            }
            cart[index].quantity += 1;
            saveCartAndRender();
        });
    });

    deleteButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            cart.splice(index, 1);
            saveCartAndRender();
        });
    });
}


function saveCartAndRender() {
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
}


checkoutButton.addEventListener("click", async () => {
    // Validar si el carrito está vacío
    if (cart.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    // Obtener el usuario activo de localStorage para asociarlo al pedido
    const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
    if (!usuarioActivo) {
        alert("Debes iniciar sesión para realizar un pedido.");
        window.location.href = "../../auth/login/login.html";
        return;
    }

    // Obtener dirección seleccionada
    let selectedAddress = "";
    if (useSavedAddress.checked && !useSavedAddress.disabled) {
        selectedAddress = usuarioActivo.direccion;
    } else if (useNewAddress.checked) {
        selectedAddress = newAddressInput.value.trim();
    }

    if (!selectedAddress || selectedAddress === "") {
        alert("Por favor, selecciona o ingresa una dirección de entrega.");
        return;
    }

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const mappedProducts = cart.map(item => ({
        idProducto: item.idProducto || item.id || "",
        id: item.id || item.idProducto || "",
        name: item.name,
        price: item.price,
        quantity: item.quantity
    }));

    const estadoPagoCalculado = (tipoPedidoSelect.value === "Para consumir aquí") ? "Sin pagar" : "Pagado";

    const payload = {
        idUsuario: usuarioActivo.idUsuario,
        total: total,
        tipoEntrega: tipoPedidoSelect.value,
        estadoPago: estadoPagoCalculado,
        numeroMesa: numeroMesaInput ? numeroMesaInput.value : null,
        direccion: (tipoPedidoSelect.value === "A domicilio") ? selectedAddress : "N/A",
        products: mappedProducts,
        productos: mappedProducts
    };

    try {
        // Enviar el pedido al backend por medio de fetch
        const response = await fetch("http://localhost:8080/turpialJava/HistorialServlet?accion=registrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        // Validar si la petición falló en el servidor
        if (!response.ok) {
            throw new Error("Error en la respuesta del servidor");
        }

        // Obtener la respuesta JSON
        const data = await response.json();

        // Validar si la inserción en la base de datos fue exitosa
        if (data.status === "success") {
            // Guardar historial local descriptivo
            if (typeof guardarHistorial === "function") {
                guardarHistorial(usuarioActivo.email, "Usuario", `Realizó un pedido por $${total}`);
            }
            
            // Vaciar el carrito en localStorage tras confirmación del servidor
            localStorage.removeItem("cart");
            
            alert("Pedido realizado exitosamente y registrado en la base de datos.");
            
            // Recargar la página para reflejar el estado limpio
            location.reload();
        } else {
            // Alertar del fallo retornado por el backend
            alert("Error al procesar el pedido: " + data.message);
        }
    } catch (error) {
        // Registrar error en la consola
        console.error("Error al registrar pedido:", error);
        alert("No se pudo conectar con el servidor de El Turpial. Revisa que Tomcat esté activo.");
    }
});

function setupPedidoLogic() {
    if (tipoPedidoSelect) {
        tipoPedidoSelect.addEventListener("change", () => {
            const val = tipoPedidoSelect.value;
            if (mesaContainer) mesaContainer.style.display = (val === "Para consumir aquí") ? "block" : "none";
            if (deliveryAddressContainer) deliveryAddressContainer.style.display = (val === "A domicilio") ? "block" : "none";
        });
    }

    const metodoPago = document.getElementById("metodoPago");
    const efectivoContainer = document.getElementById("efectivoContainer");
    if (metodoPago && efectivoContainer) {
        metodoPago.addEventListener("change", () => {
            efectivoContainer.style.display = (metodoPago.value === "Efectivo") ? "block" : "none";
        });
    }

    if (montoRecibidoInput) {
        montoRecibidoInput.addEventListener("input", () => {
            const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const recibido = parseFloat(montoRecibidoInput.value) || 0;
            const vuelto = recibido - total;
            
            if (vueltoContainer && vueltoValor) {
                if (recibido >= total && total > 0) {
                    vueltoContainer.style.display = "block";
                    vueltoValor.textContent = `$${vuelto.toLocaleString()}`;
                } else {
                    vueltoContainer.style.display = "none";
                }
            }
        });
    }
}

// Inicializar eventos de pedidos
setupPedidoLogic();