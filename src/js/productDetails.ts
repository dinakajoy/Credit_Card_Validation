import "../css/style.scss";
import "./loader";

document.getElementById("buyer_name").onkeypress = (e: KeyboardEvent): boolean => {
  if(("abcdefghijklmnopqrstuvwxyz ").indexOf(String.fromCharCode(e.keyCode)) === -1) {
    e.preventDefault();
    return false;
  }
}
document.getElementById("buyer_country").onkeypress = (e: KeyboardEvent): boolean => {
  if(("abcdefghijklmnopqrstuvwxyz ").indexOf(String.fromCharCode(e.keyCode)) === -1) {
    e.preventDefault();
    return false;
  }
}

window.onload = () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  let prodImg = document.querySelector("#prodImg")! as HTMLInputElement;
  let prodName = document.querySelector(".prodName")! as HTMLInputElement;
  let prodPrice = document.querySelector(".prodPrice")! as HTMLInputElement;

  let db;
  let productDB = indexedDB.open("productDB", 1);

  productDB.onerror = () => {
    console.log("productDB Database failed to open");
  };

  productDB.onsuccess = () => {
    db = productDB.result;
    let transaction: IDBTransaction = db.transaction(["products"], "readonly");

    let objectStore = transaction.objectStore("products");
    objectStore.get(Number.parseInt(id)).onsuccess = function(event:any) {
      let res = event.target.result;
      let img = imageExists(res.img);
      prodImg.src = `./img/products/${img}`;
      prodName.textContent = res.name;
      prodPrice.textContent = `NGN${res.price}.00`;

      localStorage.setItem("id", res.id);
      localStorage.setItem("prodName", res.name);
      localStorage.setItem("prodImage", img);
      localStorage.setItem("prodPrice", res.price);
    };
  };
};

function imageExists(url: string): string {
  if (url.includes("fakepath")) {
    return `no_logo.gif`;
  }
  if(`img/${url}`) {
    return `${url}`;
  } 
}

const userDetails = (e: Event) => {
  e.preventDefault();
  let buyer_name_element = document.querySelector("#buyer_name")! as HTMLInputElement;
  let buyer_country_element = document.querySelector("#buyer_country")! as HTMLInputElement;
  let num_of_items_element = document.querySelector("#num_of_items")! as HTMLInputElement;

  localStorage.setItem ("buyer_name", buyer_name_element.value);
  localStorage.setItem ("buyer_country", buyer_country_element.value);
  localStorage.setItem ("num_of_items", num_of_items_element.value);
  window.location.replace("./makePayment.html");
};

let buyerDetails = document.querySelector("#buyerDetails");
buyerDetails.addEventListener("submit", userDetails);