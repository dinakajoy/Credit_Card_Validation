let myProducts = [
  {
    name: "Black Gown",
    price: "4000",
    img: "black-gown.jpg"
  },
  {
    "name": "Black Jacket",
    "price": "2500",
    "img": "black-jacket.png"
  },
  {
    "name": "Black Skirt",
    "price": "3000",
    "img": "black-skirt.png"
    },
  {
    name: "Gold Gown",
    price: "4500",
    img: "gold-gown.png"
  },
  {
    "name": "Blue Shirt",
    "price": "2000",
    "img": "blue-shirt.png"
  },
  {
    "name": "Cold Top",
    "price": "4500",
    "img": "cold-top-longsleeve.png"
  },
  {
    "name": "Kid's Jacket",
    "price": "2000",
    "img": "kids-jacket.png"
  },
  {
    "name": "Cold Top",
    "price": "1500",
    "img": "cold-top.png"
  },
  {
    "name": "Kid's Gown",
    "price": "2000",
    "img": "kids-gown.png"
  },
  {
    "name": "Army Shirt",
    "price": "2000",
    "img": "army-shirt.jpg"
  },
  {
    "name": "Red Gown",
    "price": "5000",
    "img": "red-gown.png"
  },
  {
    "name": "Sweater",
    "price": "3800",
    "img": "sweater.png"
  },
  {
    "name": "Summer Gown",
    "price": "2000",
    "img": "summer-gown.jpg"
  },
  {
    "name": "White Gown",
    "price": "2000",
    "img": "white-gown.png"
  },
  {
    "name": "Yellow Cold Jacket",
    "price": "2000",
    "img": "yellow-cold-jacket.png"
  },
  {
    "name": "Pink Gown",
    "price": "2000",
    "img": "pink-gown.jpg"
  },
];

if (!('indexedDB' in window)) {
  console.log("Your browser doesn't support a stable version of IndexedDB. Some feature will not be available.");
}

window.onload = () => {
  let productDB = indexedDB.open('productDB', 1);
  productDB.onupgradeneeded = (e) => {
    let db = e.target.result;
    let objectStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement:true }); //key
    objectStore.createIndex('name', 'name', { unique: false });
    objectStore.createIndex('price', 'price', { unique: false });
    objectStore.createIndex('img', 'img', { unique: false });
    console.log('Database setup complete');
    objectStore.transaction.oncomplete = (e) => {
      let productsObjectStore = db.transaction("products", "readwrite").objectStore("products");
      myProducts.forEach((product) => {
        productsObjectStore.add(product);
      });
    };
    productDB.onsuccess = () => {
      console.log("Products has been added to the productDB store", request.result);
    };

    productDB.onerror = () => {
      console.log("Error", request.error);
    };
  };
};