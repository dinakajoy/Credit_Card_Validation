document.getElementById('buyer_name').onkeypress = (e) => {
  if(("abcdefghijklmnopqrstuvwxyz ").indexOf(String.fromCharCode(e.keyCode)) === -1) {
      e.preventDefault();
      return false;
  }
}
document.getElementById('buyer_country').onkeypress = (e) => {
  if(("abcdefghijklmnopqrstuvwxyz ").indexOf(String.fromCharCode(e.keyCode)) === -1) {
      e.preventDefault();
      return false;
  }
}

window.onload = () => {
  let prodImg = document.querySelector('#prodImg');
  let prodName = document.querySelector('.prodName');
  let index = localStorage.getItem('index');
  localStorage.removeItem('index');

  let db;
  let productDB = indexedDB.open("productDB", 1);
  productDB.onerror = () => {
      console.log('productDB Database failed to open');
  };
  productDB.onsuccess = () => {
      db = event.target.result;
      let transaction = db.transaction(["products"], "readonly");
      transaction.onsuccess = function(event) {
          console.log('[Transaction] ALL DONE!');
      };
      let objectStore = transaction.objectStore('products');
      objectStore.get(Number.parseInt(index)).onsuccess = function(event) {
          let res = event.target.result;
          let img = imageExists(res.img);
          prodImg.src = `img/${img}`;
          prodName.textContent = res.name;

          localStorage.setItem('id', res.id);
          localStorage.setItem('prodName', res.name);
          localStorage.setItem('prodImage', img);
          localStorage.setItem('prodPrice', res.price);
      };
  };
};

function imageExists(url) {
  if (url.includes("fakepath")) {
      return `no_logo.gif`;
  }
  if(`img/${url}`) {
      return `${url}`;
  } 
}

const userDetails = (e) => {
  e.preventDefault();
  let buyer_name = document.querySelector('#buyer_name').value;
  let buyer_country = document.querySelector('#buyer_country').value;
  let num_of_items = document.querySelector('#num_of_items').value;
  localStorage.setItem ('buyer_name', buyer_name);
  localStorage.setItem ('buyer_country', buyer_country);
  localStorage.setItem ('num_of_items', num_of_items);
  window.location.replace("./makePayment.html");
}; 
let buyerDetails = document.querySelector('#buyerDetails');
buyerDetails.addEventListener('submit', userDetails);