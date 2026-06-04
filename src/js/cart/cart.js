document.addEventListener("DOMContentLoaded", () => {

    setupAddToCart();

});


function setupAddToCart() {

    const buttons =
        document.querySelectorAll(".add-to-cart");


    buttons.forEach((button) => {

        button.addEventListener("click", (e) => {

            e.preventDefault();


            const product = {

                name:
                    button.dataset.name,

                price:
                    parseInt(button.dataset.price),

                image:
                    button.dataset.image,

                status:
                    button.dataset.status,

                quantity: 1

            };


            addProductToCart(product);

        });

    });

}


export function addToCart(product) {

    // OBTENER CARRITO
    const cart =
        JSON.parse(
            localStorage.getItem("cart")
        ) || [];

    // BUSCAR PRODUCTO EXISTENTE
    const existingProduct =
        cart.find(item =>

            item.name === product.name
        );

    // SI YA EXISTE
    if (existingProduct) {

        existingProduct.quantity += 1;

    }

    else {

        // AGREGAR NUEVO
        cart.push({

            ...product,

            quantity: 1

        });

    }

    // GUARDAR
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    alert(
        "Producto agregado al carrito"
    );

}