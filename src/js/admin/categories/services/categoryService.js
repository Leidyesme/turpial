const CATEGORIES_KEY =
    "categories";


export function getCategories() {

    return JSON.parse(

        localStorage.getItem(
            CATEGORIES_KEY
        )

    ) || [];

}


export function saveCategories(categories) {

    localStorage.setItem(

        CATEGORIES_KEY,

        JSON.stringify(categories)

    );

}