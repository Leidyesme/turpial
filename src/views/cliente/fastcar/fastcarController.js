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


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));


renderCart();
initAddressSelection();


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


        const imagePath = (product.image && product.image !== "null" && product.image !== "undefined" && product.image.trim() !== "")
            ? product.image
            : "../../../public/turpial.png";

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

    // Calcular el total monetario del pedido multiplicando el precio por la cantidad
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    // Preparar el cuerpo de la petición con la estructura esperada por HistorialServlet
    const payload = {
        idUsuario: usuarioActivo.idUsuario,
        total: total,
        products: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))
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
            guardarHistorial(usuarioActivo.email, "Usuario", `Realizó un pedido por $${total}`);
            
            // Guardar pedido en local orders para que le aparezca al empleado en la simulación local
            const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
            localOrders.push({
                clientName: usuarioActivo.name,
                address: selectedAddress,
                date: new Date().toLocaleString(),
                status: "En proceso",
                total: total,
                products: cart.map(item => ({
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            });
            localStorage.setItem("orders", JSON.stringify(localOrders));

            // Decrementar stock de los productos comprados en localStorage
            const productsDb = JSON.parse(localStorage.getItem("products")) || [];
            cart.forEach(item => {
                const matchedProduct = productsDb.find(p => p.name === item.name);
                if (matchedProduct) {
                    let currentStock = parseInt(matchedProduct.stock) || 0;
                    currentStock = Math.max(0, currentStock - item.quantity);
                    matchedProduct.stock = currentStock;
                    matchedProduct.status = currentStock > 0 ? "Disponible" : "Agotado";
                }
            });
            localStorage.setItem("products", JSON.stringify(productsDb));

            // Vaciar el carrito en localStorage
            localStorage.removeItem("cart");
            
            alert("Pedido realizado exitosamente y registrado en la base de datos.");
            
            // Recargar la página actual
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