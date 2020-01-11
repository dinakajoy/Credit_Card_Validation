let myProducts = [
    {
        name: "Female Wear",
        price: "45",
        img: "eight.jpg"
    },
    {
        "name": "Cold Jacket",
        "price": "15",
        "img": "five.jpg"
    },
    {
        "name": "Classy",
        "price": "30",
        "img": "one.jpg"
    },
    {
        "name": "Gown",
        "price": "25",
        "img": "seven.jpg"
    },
    {
        "name": "Female Shoe",
        "price": "45",
        "img": "six.jpg"
    },
    {
        "name": "Skirt",
        "price": "15",
        "img": "ten.jpg"
    },
    {
        "name": "Suit",
        "price": "50",
        "img": "three.jpg"
    },
    {
        "name": "Male Shoe",
        "price": "38",
        "img": "two.jpg"
    },
    {
        "name": "Female Top",
        "price": "20",
        "img": "four.jpg"
    },
];

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Some feature will not be available.");
}

window.onload = () => {
    let request = indexedDB.open('allProducts', 1);
    // Setup the database tables if this has not already been done
    request.onupgradeneeded = (e) => {
        let db = e.target.result;
        // Create an objectStore to store our products in (basically like a single table)
        let objectStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement:true }); //key
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('price', 'price', { unique: false });
        objectStore.createIndex('img', 'img', { unique: false });
        console.log('Database setup complete');
        objectStore.transaction.oncomplete = (e) => {
            var productsObjectStore = db.transaction("products", "readwrite").objectStore("products");
            myProducts.forEach((product) => {
                productsObjectStore.add(product);
            });
        };
        request.onsuccess = () => {
            console.log("Products has been added to the store", request.result);
        };

        request.onerror = () => {
            console.log("Error", request.error);
        };
    };
};