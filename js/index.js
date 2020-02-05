window.addEventListener('load', () => {
  let productDB = self.indexedDB.open("productDB", 1);
  productDB.onerror = () => {
    console.log('productDB Database failed to open');
  };
  productDB.onsuccess = () => {
    console.log('productDB Database opened successfully');
    db = productDB.result;
    displayProducts();
  };

  const displayProducts = () => {
    let products = document.querySelector(".products");
    let prod = '';
    let objectStore = db.transaction(["products"], "readonly").objectStore('products');
    objectStore.openCursor().onsuccess = (e) => {
			let cursor = e.target.result;
			if(cursor) {
				let img = imageExists(cursor.value.img);
				prod += `<div class="product">
									<a href="productDetails.html" id="${cursor.value.id}" onClick=myFunc(this.id)>
										<img src="img/${img}" alt="${cursor.value.name}">
										<p>${cursor.value.name}</p>
										<span>NGN${cursor.value.price}.00</span>
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

function imageExists(url) {
  if (url.includes("fakepath")) {
    return `no_logo.gif`;
  }
  if(`img/${url}`) {
    return `${url}`;
  } 
}