import '../css/style.scss';

type IProducts = {
  name: string,
  price: string,
  img: string,
};

const addProduct = (e: Event) => {
  e.preventDefault();
  let prod_name_element: HTMLInputElement = document.querySelector('#prod_name')! as HTMLInputElement;
  let prod_name: string = prod_name_element.value;
  let prod_price_element: HTMLInputElement = document.querySelector('#prod_price')! as HTMLInputElement;
  let prod_price: string = prod_price_element.value;
  let prod_img_element: HTMLInputElement = document.querySelector('#prod_img')! as HTMLInputElement;
  let prod_img: string = prod_img_element.value;

  // grab the values entered into the form fields and store them in an object ready for being inserted into the DB
  let newItem: IProducts = {
    name: prod_name,
    price: prod_price,
    img: prod_img,
  };
  
  let DBOpenRequest: IDBOpenDBRequest = indexedDB.open('productDB', 1);
  DBOpenRequest.onerror = ():void => {
    console.log('productDB Database failed to open');
  };
  DBOpenRequest.onsuccess = ():void => {
    let db = DBOpenRequest.result;

    let transaction = db.transaction(['products'], 'readwrite');
    transaction.objectStore('products').add(newItem);
    
    transaction.oncomplete = (event: any) => {
      alert('Product added successfully');
      window.location.href = '/';
    };
    // db.close();
  };
};

let newProduct: Element = document.querySelector('#newProduct');
newProduct.addEventListener('submit', addProduct);
