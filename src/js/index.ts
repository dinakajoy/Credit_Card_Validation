import "../css/style.scss";
import "./loader.ts";
import myProducts from "./productsStore.js";

if (!("indexedDB" in window)) {
  console.log("Your browser doesn\"t support a stable version of IndexedDB. Some feature will not be available.");
}

const loadProd = () => {
  let productDB: IDBOpenDBRequest = indexedDB.open("productDB", 1);

  productDB.onerror = function() {
    console.log("Could not load products");
  };

  productDB.onsuccess = () => {
    let db = productDB.result;
    if (!db.objectStoreNames.contains("products")) {
      let objectStore = db.createObjectStore("products", { keyPath: "id", autoIncrement:true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("price", "price", { unique: false });
      objectStore.createIndex("img", "img", { unique: false });

      objectStore.transaction.oncomplete = () => {
        let productsObjectStore = db.transaction("products", "readwrite").objectStore("products");
        myProducts.forEach((product) => {
          productsObjectStore.add(product);
        });
      };
    };
  };

  productDB.onupgradeneeded = () => {
    let db = productDB.result;
    if (!db.objectStoreNames.contains("products")) {
      let objectStore = db.createObjectStore("products", { keyPath: "id", autoIncrement:true });
      objectStore.createIndex("name", "name", { unique: false });
      objectStore.createIndex("price", "price", { unique: false });
      objectStore.createIndex("img", "img", { unique: false });

      objectStore.transaction.oncomplete = () => {
        let productsObjectStore = db.transaction("products", "readwrite").objectStore("products");
        myProducts.forEach((product) => {
          productsObjectStore.add(product);
        });
      };
    }
  };
}

const imageExists = (url: string): string  => {
  if (url.includes("fakepath")) {
    return `no_logo.gif`;
  }
  if (`img/${url}`) {
    return `${url}`;
  }
};

const displayProd = () => {
  let db: any;
  
  let productDB: IDBOpenDBRequest = indexedDB.open("productDB", 1);
  productDB.onerror = ():void => {
    console.log("productDB Database failed to open");
  };
  productDB.onsuccess = ():void => {
    db = productDB.result;
    displayProducts();
    // db.close();
  };

  const displayProducts = (): void => {
    let products = document.querySelector(".products");
    let prod = "";
    let objectStore = db
      .transaction(["products"], "readonly")
      .objectStore("products");
    objectStore.openCursor().onsuccess = (event: any) => {
      let cursor = event.target.result;
      if (cursor) {
        let img = imageExists(cursor.value.img);
        prod += `<div class="product">
									<a href="productDetails.html?id=${cursor.value.id}">
										<img src="./img/products/${img}" alt="${cursor.value.name}">
										<p>${cursor.value.name}</p>
										<span>NGN${cursor.value.price}.00</span>
									</a>
				</div>`;
        cursor.continue();
      }
      products.innerHTML = prod;
    };
  };
}

window.addEventListener("load", () => {
  loadProd();
  displayProd();
});