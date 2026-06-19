document.addEventListener("DOMContentLoaded",
    async () => {

        await loadProducts();

        setupAddProduct();

        setupForm();

        setupOrderType();

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
                `${product.nombre} - $${product.precio}`;

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


    addProductBtn.addEventListener("click", () => {
    
        addProduct();

    });

}


function addProduct() {

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