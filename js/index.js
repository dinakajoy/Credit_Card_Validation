window.addEventListener('load', () => {
    let request = self.indexedDB.open("allProducts", 1);

    // onerror handler signifies that the database didn't open successfully
    request.onerror = () => {
        console.log('Database failed to open');
    };
    
    // onsuccess handler signifies that the database opened successfully
    request.onsuccess = () => {
        console.log('Database opened successfully');
        db = request.result;
        // Run the displayData() function to display the notes already in the IDB
        displayProducts();
    };

    const displayProducts = () => {
        let products = document.querySelector(".products");
        let prod = '';
        // Open object store and then get a cursor - which iterates through all the products in the store
        let objectStore = db.transaction(["products"], "readonly").objectStore('products');
        objectStore.openCursor().onsuccess = (e) => {
            // Get a reference to the cursor
            let cursor = e.target.result;
            if(cursor) {
                prod += `<div>
                        <a href="productDetails.html" id="${cursor.value.id}" onClick=myFunc(this.id)>
                            <img src="img/${cursor.value.img}" alt="${cursor.value.name}">
                            <p>${cursor.value.name}</p>
                            <span class="hidden">cursor.value.price</span>
                        </a>
                    </div>`;
                cursor.continue();
            }
            products.innerHTML = prod;
        }     
    }
});
const myFunc = (id) => {
    localStorage.setItem('index', id);
};
