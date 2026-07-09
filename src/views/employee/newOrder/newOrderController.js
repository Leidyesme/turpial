document.addEventListener("DOMContentLoaded",
    async () => {

        await loadProducts();

        setupAddProduct();

        setupForm();

        setupOrderType();

        setupCancelBtn();

        setupStockSync();

    }
);

let availableProducts = [];

async function loadProducts() {

    try {

        const response =
            await fetch(
                "http://localhost:8080/turpialJava/producto"
            );

        const data =
            await response.json();

        availableProducts = data;

        const select =
            document.querySelector(
                "#productSelect"
            );

        data.forEach((product) => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                product.idProducto;

            option.textContent =
                `${product.nombre} - $${product.precio} (Stock: ${product.stock})`;

            select.appendChild(
                option
            );

        });

    } catch (error) {

        console.error(error);

        alert(
            "Error cargando productos"
        );

    }
}

let products = [];


function setupAddProduct() {

    const addProductBtn =
        document.querySelector(
            "#addProductBtn"
        );


    addProductBtn.addEventListener("click", async () => {
    
        await addProduct();

    });

}

async function getRealTimeStock(productId) {
    try {
        const response = await fetch("http://localhost:8080/turpialJava/producto");
        if (!response.ok) {
            throw new Error("Error obteniendo stock en tiempo real del servidor");
        }
        const data = await response.json();
        availableProducts = data;
        const product = data.find(p => p.idProducto === productId);
        return product ? product.stock : 0;
    } catch (error) {
        console.error("Error al consultar stock en tiempo real:", error);
        return null;
    }
}

function setupStockSync() {
    const select = document.querySelector("#productSelect");
    const stockContainer = document.querySelector("#stockDisplayContainer");

    if (select && stockContainer) {
        select.addEventListener("change", async () => {
            const productId = select.value;
            if (!productId) {
                stockContainer.textContent = "";
                return;
            }

            stockContainer.textContent = "Consultando stock en tiempo real...";
            const stock = await getRealTimeStock(productId);
            if (stock !== null) {
                stockContainer.textContent = `Stock disponible en tiempo real: ${stock}`;
                
                const option = select.querySelector(`option[value="${productId}"]`);
                if (option) {
                    const product = availableProducts.find(p => p.idProducto === productId);
                    if (product) {
                        option.textContent = `${product.nombre} - $${product.precio} (Stock: ${stock})`;
                    }
                }
            } else {
                stockContainer.textContent = "Error al consultar el stock.";
            }
        });
    }
}

function setupCancelBtn() {
    const cancelBtn = document.querySelector("#cancelBtn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            window.location.href = "../orders/orders.html";
        });
    }
}


async function addProduct() {

    const productId =
        document.querySelector(
            "#productSelect"
        ).value;

    const quantity =
        parseInt(
            document.querySelector(
                "#productQuantity"
            ).value
        );

    if (
        !productId ||
        isNaN(quantity) ||
        quantity <= 0
    ) {

        alert(
            "Seleccione producto y cantidad válida"
        );

        return;
    }

    const freshStock = await getRealTimeStock(productId);
    if (freshStock === null) {
        alert("Error al validar el stock disponible en tiempo real.");
        return;
    }

    const selectedProduct =
        availableProducts.find(
            product =>
                product.idProducto
                === productId
        );

    if (!selectedProduct) {

        return;
    }

    const existingProduct = products.find(p => p.idProducto === selectedProduct.idProducto);
    const requestedQuantity = (existingProduct ? existingProduct.quantity : 0) + quantity;

    if (requestedQuantity > freshStock) {
        alert(`No hay suficiente stock. Disponible: ${freshStock}, Solicitado: ${requestedQuantity}`);
        return;
    }

    if (existingProduct) {
        existingProduct.quantity += quantity;
    } else {
        const product = {

            idProducto:
                selectedProduct.idProducto,

            name:
                selectedProduct.nombre,

            price:
                selectedProduct.precio,

            quantity:
                quantity

        };

        products.push(product);
    }

    // Reset fields
    document.querySelector("#productSelect").value = "";
    document.querySelector("#productQuantity").value = "1";
    
    const stockContainer = document.querySelector("#stockDisplayContainer");
    if (stockContainer) {
        stockContainer.textContent = "";
    }

    renderProducts();
}


function renderProducts() {

    const container =
        document.querySelector(
            "#productsContainer"
        );


    const totalElement =
        document.querySelector(
            "#orderTotal"
        );


    container.innerHTML = "";


    let total = 0;


    products.forEach((product) => {

        total +=
            product.price *
            product.quantity;


        const productCard =
            document.createElement("div");


        productCard.classList.add(
            "newOrder__product"
        );


        productCard.innerHTML = `

            <p>

                ${product.name}

            </p>

            <p>

                Cantidad:
                ${product.quantity}

            </p>

            <p>

                Precio:
                $${product.price}

            </p>

        `;


        container.appendChild(
            productCard
        );

    });


    totalElement.textContent =
        `Total: $${total}`;

}


function setupForm() {

    const form =
        document.querySelector(
            ".newOrder__form"
        );


    form.addEventListener("submit", (e) => {

        e.preventDefault();


        registerOrder();

    });

}

function setupOrderType() {

    const orderType =
        document.querySelector(
            "#orderType"
        );

    const mesaContainer =
        document.querySelector(
            "#mesaContainer"
        );

    const direccionContainer =
        document.querySelector(
            "#direccionContainer"
        );

    orderType.addEventListener(
        "change",
        () => {

            /**
             * MOSTRAR MESA
             */
            if (
                orderType.value ===
                "Para consumir aquí"
            ) {

                mesaContainer.style.display =
                    "block";

            } else {

                mesaContainer.style.display =
                    "none";
            }

            /**
             * MOSTRAR DIRECCIÓN
             */
            if (
                orderType.value ===
                "A domicilio"
            ) {

                direccionContainer.style.display =
                    "block";

            } else {

                direccionContainer.style.display =
                    "none";
            }
        }
    );
}


async function registerOrder() {

    const customerName =
        document.querySelector(
            "#customerName"
        ).value;

    const orderType =
        document.querySelector(
            "#orderType"
        ).value;

    const numeroMesa =
        document.querySelector(
            "#numeroMesa"
        ).value;

    const direccionEntrega =
        document.querySelector(
            "#direccionEntrega"
        ).value;

    const observation =
        document.querySelector(
            "#orderObservation"
        ).value;

    /**
     * VALIDAR
     */
    if (
        customerName === ""
        ||
        orderType === ""
        ||
        products.length === 0
    ) {

        alert(
            "Complete todos los campos"
        );

        return;
    }

    /**
     * VALIDAR MESA
     */
    if (
        orderType ===
        "Para consumir aquí"
        &&
        numeroMesa === ""
    ) {

        alert(
            "Ingrese número de mesa"
        );

        return;
    }

    /**
     * VALIDAR DIRECCIÓN
     */
    if (
        orderType ===
        "A domicilio"
        &&
        direccionEntrega === ""
    ) {

        alert(
            "Ingrese dirección"
        );

        return;
    }

    /**
     * CALCULAR TOTAL
     */
    const total =
        products.reduce(
            (acc, product) => {

                return (
                    acc +
                    (
                        product.price *
                        product.quantity
                    )
                );

            },
            0
        );

    /**
     * PAYLOAD EN FORMATO JSON
     */
    const activeUserStr = localStorage.getItem("usuarioActivo");
    const activeUser = activeUserStr ? JSON.parse(activeUserStr) : null;
    const idUsuario = activeUser ? activeUser.idUsuario : null;

    const payload = {
        idUsuario: idUsuario,
        nombreClienteOpcional: customerName,
        tipoEntrega: orderType,
        numeroMesa: numeroMesa !== "" ? parseInt(numeroMesa) : null,
        direccionEntrega: direccionEntrega !== "" ? direccionEntrega : null,
        observaciones: observation,
        total: total,
        products: products.map(p => ({
            idProducto: p.idProducto,
            name: p.name,
            price: p.price,
            quantity: p.quantity
        }))
    };

    try {

        /**
         * ENVIAR PEDIDO
         */
        const response =
            await fetch(
                "http://localhost:8080/turpialJava/pedido",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

        // Si la petición es exitosa, guardar también en localStorage para consistencia del frontend
        if (response.ok) {
            const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
            localOrders.push({
                clientName: customerName || "Cliente Anónimo",
                address: direccionEntrega || "No especificada",
                status: "En preparación",
                total: total,
                products: products,
                date: new Date().toLocaleDateString()
            });
            localStorage.setItem("orders", JSON.stringify(localOrders));
        }

        const result =
            await response.json();

        alert(result.message);

        /**
         * REDIRECCIONAR
         */
        if (
            result.status ===
            "success"
        ) {

            window.location.href =
                "../orders/orders.html";
        }

    } catch (error) {

        console.error(error);

        alert(
            "Error registrando pedido"
        );
    }
}