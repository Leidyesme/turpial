document.addEventListener("DOMContentLoaded", () => {

    setupAddProduct();

    setupForm();

    setupOrderType();

});


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

    const productName =
        prompt("Nombre del producto");

    const productPrice =
        parseFloat(
            prompt("Precio producto")
        );

    const quantity =
        parseInt(
            prompt("Cantidad")
        );


    // VALIDAR
    if (
        !productName ||
        isNaN(productPrice) ||
        isNaN(quantity)
    ) {

        alert("Datos inválidos");

        return;

    }


    const product = {

        name: productName,

        price: productPrice,

        quantity: quantity

    };


    products.push(product);


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
     * FORM DATA
     */
    const formData =
        new FormData();

    formData.append(
        "nombreClienteOpcional",
        customerName
    );

    formData.append(
        "tipoEntrega",
        orderType
    );

    formData.append(
        "numeroMesa",
        numeroMesa
    );

    formData.append(
        "direccionEntrega",
        direccionEntrega
    );

    formData.append(
        "observaciones",
        observation
    );

    formData.append(
        "total",
        total
    );

    try {

        /**
         * ENVIAR PEDIDO
         */
        const response =
            await fetch(
                "http://localhost:8080/turpial/pedido",
                {
                    method: "POST",
                    body: formData
                }
            );

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