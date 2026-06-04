import {
    addToCart
}
from "./cart.js";


export function setupCartButtons() {

    const buttons =
        document.querySelectorAll(
            ".addToCartBtn"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",

            () => {

                const product = {

                    name:
                        button.dataset.name,

                    price:
                        Number(
                            button.dataset.price
                        ),

                    image:
                        button.dataset.image

                };


                addToCart(product);

            }
        );

    });

}