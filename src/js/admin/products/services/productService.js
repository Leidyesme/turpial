const DEFAULT_PRODUCTS = [
    { id: 1, name: "Huevos revueltos con vegetales", price: 6000, stock: 15, category: "Desayuno", image: "../../../../public/breakfast/breakfast1.png", status: "Disponible" },
    { id: 2, name: "Panqueques y hot cakes caceros", price: 8000, stock: 10, category: "Desayuno", image: "../../../../public/breakfast/breakfast2.png", status: "Disponible" },
    { id: 3, name: "Sandwich de pavo, queso y lechuga", price: 8000, stock: 12, category: "Desayuno", image: "../../../../public/breakfast/breakfast3.png", status: "Disponible" },
    { id: 4, name: "Sandwich de jamon y queso en pan integral", price: 5000, stock: 20, category: "Desayuno", image: "../../../../public/breakfast/breakfast4.png", status: "Disponible" },
    { id: 5, name: "Yogur griego con cereales y frutos secos", price: 7000, stock: 8, category: "Desayuno", image: "../../../../public/breakfast/breakfast5.png", status: "Disponible" },
    { id: 6, name: "Waffles de zanahoria con avena", price: 7000, stock: 10, category: "Desayuno", image: "../../../../public/breakfast/breakfast6.png", status: "Disponible" },
    { id: 7, name: "Tostadas de aguacate y huevo", price: 6000, stock: 15, category: "Desayuno", image: "../../../../public/breakfast/breakfast7.png", status: "Disponible" },
    { id: 8, name: "Tortilla de espinacas y huevo", price: 5000, stock: 15, category: "Desayuno", image: "../../../../public/breakfast/breakfast8.png", status: "Disponible" },
    
    { id: 9, name: "Arroz con pollo", price: 12000, stock: 10, category: "Almuerzo", image: "../../../../public/lunch/lunch1.png", status: "Disponible" },
    { id: 10, name: "Ajiaco Santafereño", price: 15000, stock: 8, category: "Almuerzo", image: "../../../../public/lunch/lunch2.png", status: "Disponible" },
    { id: 11, name: "Sudado de pollo y papa", price: 13000, stock: 12, category: "Almuerzo", image: "../../../../public/lunch/lunch3.png", status: "Disponible" },
    
    { id: 12, name: "Salchipapa", price: 8000, stock: 25, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood1.avif", status: "Disponible" },
    { id: 13, name: "Choripapa", price: 9000, stock: 20, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood2.png", status: "Disponible" },
    { id: 14, name: "Empanadas", price: 2500, stock: 50, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood3.webp", status: "Disponible" },
    { id: 15, name: "Papas", price: 4000, stock: 30, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood4.jpg", status: "Disponible" },
    { id: 16, name: "Perros", price: 8000, stock: 15, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood5.jpg", status: "Disponible" },
    { id: 17, name: "Hamburguesas", price: 12000, stock: 15, category: "Comida Rápida", image: "../../../../public/fastFood/fastFood6.webp", status: "Disponible" },
    
    { id: 18, name: "Smootjie de frutas y espinacas", price: 7000, stock: 15, category: "Bebidas", image: "../../../../public/drinks/drinks1.png", status: "Disponible" },
    { id: 19, name: "Licuado de manzana y canela", price: 6000, stock: 15, category: "Bebidas", image: "../../../../public/drinks/drinks2.png", status: "Disponible" },
    { id: 20, name: "Smoothie de fresa", price: 7000, stock: 15, category: "Bebidas", image: "../../../../public/drinks/drinks3.png", status: "Disponible" },
    
    { id: 21, name: "Pastel de pollo", price: 4000, stock: 30, category: "Panadería", image: "../../../../public/bakery/bakery1.png", status: "Disponible" },
    { id: 22, name: "Pandeyuca", price: 2000, stock: 40, category: "Panadería", image: "../../../../public/bakery/bakery2.png", status: "Disponible" },
    { id: 23, name: "Almojábana", price: 2000, stock: 45, category: "Panadería", image: "../../../../public/bakery/bakery3.png", status: "Disponible" },
    
    { id: 24, name: "Ensalada de frutas", price: 6000, stock: 15, category: "Promociones", image: "../../../../public/promotions/promotions2.png", status: "Disponible" },
    { id: 25, name: "Torta de auyama", price: 3500, stock: 10, category: "Promociones", image: "../../../../public/promotions/promotions3.png", status: "Disponible" },
    { id: 26, name: "Hamburguesa", price: 10000, stock: 15, category: "Promociones", image: "../../../../public/promotions/promotions4.png", status: "Disponible" }
];

function sanitizeProductImage(img) {
    if (!img) return "../../../../public/turpial.png";
    let s = String(img);
    if (s.includes("promotion2.png")) return s.replace("promotion2.png", "promotions2.png");
    if (s.includes("promotion3.png")) return s.replace("promotion3.png", "promotions3.png");
    if (s.includes("promotion4.png")) return s.replace("promotion4.png", "promotions4.png");
    if (s.includes("fastFood1.png")) return s.replace("fastFood1.png", "fastFood1.avif");
    if (s.includes("fastFood3.png")) return s.replace("fastFood3.png", "fastFood3.webp");
    if (s.includes("fastFood4.png")) return s.replace("fastFood4.png", "fastFood4.jpg");
    if (s.includes("fastFood5.png")) return s.replace("fastFood5.png", "fastFood5.jpg");
    if (s.includes("fastFood6.png")) return s.replace("fastFood6.png", "fastFood6.webp");
    return s;
}

export function getProducts() {
    const productsRaw = localStorage.getItem("products");
    if (!productsRaw) {
        localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
    try {
        let parsed = JSON.parse(productsRaw);
        let updated = false;
        parsed.forEach(p => {
            let fixedImg = sanitizeProductImage(p.image);
            if (fixedImg !== p.image) {
                p.image = fixedImg;
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem("products", JSON.stringify(parsed));
        }
        return parsed;
    } catch (e) {
        localStorage.setItem("products", JSON.stringify(DEFAULT_PRODUCTS));
        return DEFAULT_PRODUCTS;
    }
}


export function saveProducts(products) {

    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

}