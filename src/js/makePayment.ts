import "../css/style.scss";
import "./loader";

const cardDetails = document.querySelector<HTMLElement>(".card__details")! as HTMLDivElement;
const cardDigits:NodeListOf<HTMLInputElement> = document.querySelectorAll(".card--digits input");
const cardInfo:NodeListOf<HTMLInputElement> = document.querySelectorAll(".card--info input");

const result = document.querySelector<HTMLElement>(".result");
const success = document.querySelector<HTMLElement>(".alert-success");
const error = document.querySelector<HTMLElement>(".alert-danger");

const buyer_name = localStorage.getItem ("buyer_name");
const prodName = localStorage.getItem ("prodName");
const prodImg = localStorage.getItem ("prodImage");
const prodPrice = localStorage.getItem ("prodPrice");

const buyer_country = localStorage.getItem ("buyer_country");
const num_of_items = localStorage.getItem ("num_of_items");

document.querySelector<HTMLElement>(".buyerName").textContent = buyer_name;
document.querySelector<HTMLElement>(".prodName").textContent = `Make Payment For ${num_of_items} ${prodName} at `;
document.querySelector<HTMLImageElement>(".prodImg").src = `./img/products/${prodImg}`;
document.querySelector<HTMLInputElement>(".cardN").value = buyer_name;

const appCardDigits:any = [];

type ICard = {
  code: string;
  currency: string;
  currencyName: string;
  country: string;
};

const countries: ICard[] = [
  {
    code: "US",
    currency: "USD",
    currencyName: "",
    country: "United States"
  },
  {
    code: "NG",
    currency: "NGN",
    currencyName: "",
    country: "Nigeria"
  },
  {
    code: "KE",
    currency: "KES",
    currencyName: "",
    country: "Kenya"
  },
  {
    code: "UG",
    currency: "UGX",
    currencyName: "",
    country: "Uganda"
  },
  {
    code: "RW",
    currency: "RWF",
    currencyName: "",
    country: "Rwanda"
  },
  {
    code: "TZ",
    currency: "TZS",
    currencyName: "",
    country: "Tanzania"
  },
  {
    code: "ZA",
    currency: "ZAR",
    currencyName: "",
    country: "South Africa"
  },
  {
    code: "CM",
    currency: "XAF",
    currencyName: "",
    country: "Cameroon"
  },
  {
    code: "GH",
    currency: "GHS",
    currencyName: "",
    country: "Ghana"
  }
];

const formatAsMoney = (amount:number, buyerCountry: string) => {
  const country = countries.find(country => country.country === buyerCountry);
  if(country) {
    return amount.toLocaleString(`en-${country.code}`, {style:"currency", currency: country.currency});
  } else {
    return amount.toLocaleString(`en-${countries[0].code}`, {style: "currency", currency: countries[0].currency});
  }
};

const displayCartTotal = () => {
  let bill:number = parseInt(num_of_items) * parseInt(prodPrice);
  let billFormatted = formatAsMoney(bill, buyer_country);
  document.querySelector("#bill").textContent = billFormatted;
};

const flagIfInvalid = (field:any, isValid:any) => {
  if(isValid) {
    if(field.className === "is-invalid") {
      field.classList.remove("is-invalid");
    }
    field.classList.remove("is-invalid");
  } else {
    if(field.className !== "is-invalid") {
      field.classList.add("is-invalid");
    }
    field.classList.add("is-invalid");
  }
};

const expiryDateFormatIsValid = (field:any) => {
  const format = /^(0?[1-9]|1[0-2])\/?([0-9]{2})$/;
  if(format.test(field)) {
    return true;
  } else {
    result.textContent = "Please, Your Card Date Shoud Be In This Format - MM/YY. Thank You";
    error.style.display = "block";
    success.style.display = "none";
    return false;
  }
};

const validateCardExpiryDate = () => {
  const card_date = cardInfo[1];
  const cardDate = card_date.value;
  if(expiryDateFormatIsValid(cardDate)) {
    const date = new Date();
    const currentMonth = date.getMonth() + 1;
    const currentYear = date.getFullYear().toString().slice(-2);

    let cardMonth:string = cardDate.split("/")[0];
    let cardYear:string = cardDate.split("/")[1];

    if( (+cardMonth < currentMonth && cardYear <= currentYear) || (cardYear < currentYear) ) {
      flagIfInvalid(card_date, false);
      result.textContent = "Oh No, Your Card Has Expired";
      error.style.display = "block";
      success.style.display = "none";
      return false;
    } else {
      flagIfInvalid(card_date, true);
      return true;
    }
  } else {
    flagIfInvalid(card_date, false);
    return false;
  }
};

const validateCardHolderName = () => {
  const card_name = cardInfo[0];
  const cardName = card_name.value;
  const format = /^([a-zA-Z]{3,})\s([a-zA-Z]{3,})$/;
  if(format.test(cardName)) {
    flagIfInvalid(card_name, true);
    return true;
  } else {
    flagIfInvalid(card_name, false);
    result.textContent = "Oh No, Your Name(s) Is Not Long Enough";
    error.style.display = "block";
    success.style.display = "none";
    return false;
  }
};

const detectCardType = (first4Digits:any) => {
  if(Number.parseInt(first4Digits[0]) === 4) {
    cardDetails.classList.add("is-visa");
    cardDetails.classList.remove("is-mastercard");
    return "is-visa";
  } else if(Number.parseInt(first4Digits[0]) === 5) {
    cardDetails.classList.add("is-mastercard");
    cardDetails.classList.remove("is-visa");
    return "is-mastercard";
  } else {
    cardDetails.classList.remove("is-visa");
    cardDetails.classList.remove("is-mastercard");
    cardDetails.classList.add("none");
    console.log("Oooops, You Card Is Not A Master Card Or A Visa Card");
  }
};

const validateWithLuhn = (digits:[]) => {
  let total = 0;
  const newDigits = digits.reverse();
  newDigits.forEach((value, index) => {
    if((index % 2) > 0) {
      let doubled = Number.parseInt(value) * 2;
      if(doubled > 9) {
        total += doubled - 9;
      } else {
        total += doubled;
      }
    } else {
      total += Number.parseInt(value) ;
    }
  });
  if((total % 10) === 0) {
    return true;
  } else {
    return false;
  }
};

const validateCardNumber = () => {
  if(cardDigits[0].value === "" || cardDigits[1].value === "" || cardDigits[2].value === "" || cardDigits[3].value === "") {
    result.textContent = "Nooopee, Please Enter Card Numbers";
    error.style.display = "block";
    success.style.display = "none";
  } else {
    const digits = appCardDigits.flat();
    if(digits.length !== 16) {
      result.textContent = "Ooh Nooo, Can You Please Enter Complete Card Numbers";
      error.style.display = "block";
      success.style.display = "none";
      return;
    }
    if(validateWithLuhn(digits)) {
      flagIfInvalid(cardDigits[0], true);
      flagIfInvalid(cardDigits[1], true);
      flagIfInvalid(cardDigits[2], true);
      flagIfInvalid(cardDigits[3], true);
      result.textContent = "Welldone. Payment Was Successful";
      error.style.display = "none";
      success.style.display = "block";
      document.querySelector<HTMLElement>(".payButton").style.display = "none";
    } else {
      result.textContent = "Oooops, You Cannot Use An Invalid Card";
      error.style.display = "block";
      success.style.display = "none";
      flagIfInvalid(cardDigits[0], false);
      flagIfInvalid(cardDigits[1], false);
      flagIfInvalid(cardDigits[2], false);
      flagIfInvalid(cardDigits[3], false);
    }
  }
};

const validatePayment = (): void => {
  validateCardNumber();
  validateCardHolderName();
  validateCardExpiryDate();
};

const smartInput = (event:any, fieldIndex:number, fields:any) => {
  const A_KEYS = ["Backspace", "Delete", "Tab", "Shift", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
  const acceptedKeys = A_KEYS.includes(event.key);
  let userKey = false;

  if(fieldIndex < 4) {
    userKey = (event.key >= "0" && event.key <= "9");
  } else if(fieldIndex === 4) {
    userKey = (event.key >= "a" && event.key <= "z") || (event.key >= "A" && event.key <= "Z") || (event.key === " ");
  } else {
    userKey = (event.key >= "0" && event.key <= "9") || (event.key === "/");
  }

  if(!userKey && !acceptedKeys) {
    event.preventDefault();
    return;
  }

  const target:any = event.target;
  let {selectionStart, value} = target;

  if(userKey) {
    if(fieldIndex < 4) {
      if(typeof appCardDigits[fieldIndex] === "undefined") {
        appCardDigits[fieldIndex] = [];
      }
      if(typeof appCardDigits[fieldIndex][selectionStart] === "undefined") {
        appCardDigits[fieldIndex][selectionStart] = [];
      }
      event.preventDefault();

      appCardDigits[fieldIndex][selectionStart] += event.key;
      target.value = value.substr(0, selectionStart) + event.key + value.substr(selectionStart + 1);
      appCardDigits[fieldIndex] = target.value.split("").map((cardVal:any, index:number) => (cardVal >= "0" && cardVal <= "9") ? cardVal : appCardDigits[fieldIndex][index]);
      setTimeout(() => {
        appCardDigits[fieldIndex] = target.value.split("").map((cardVal:any, index:number) => (cardVal >= "0" && cardVal <= "9") ? cardVal : appCardDigits[fieldIndex][index]);
        target.value = (fields[fieldIndex].nextElementSibling === null) ? target.value : target.value.replace(/\d/g, "$");
      }, 500);
    }
  } else {
    if(fieldIndex < 4) {
      if(event.key === "Backspace" || event.key === "Delete") {
        if(event.key === "Backspace") {
          event.preventDefault();
          selectionStart = (selectionStart - 1 > 0) ? selectionStart - 1 : 0;
        }
        appCardDigits[fieldIndex].splice(selectionStart, 1);
        target.value = appCardDigits[fieldIndex].map((val:number) => "$").join("");
        target.selectionStart = selectionStart;
      }
    }
  }

  if(fieldIndex === 0) {
    const dig = appCardDigits[0];
    detectCardType(dig);
  }
  smartCursor(event, fieldIndex, fields);
};

const smartCursor = (event:any, fieldIndex:number, fields:any) => {
  const size = parseInt(fields[fieldIndex].getAttribute("size"));
  if((fields[fieldIndex].value.length) === size) {
    if(fields[fields.length - 1]) {
      fields[fields.length - 1].blur();
    }
    if(fields[fieldIndex] !== fields[fields.length - 1]) {
      fields[fieldIndex + 1].focus();
    }
  };
}

const enableSmartTyping = () => {
  const fields = [cardDigits[0], cardDigits[1], cardDigits[2], cardDigits[3], cardInfo[0], cardInfo[1]];
  fields.forEach((field, index, fields) => {
    console.log("fields", fields);
    field.addEventListener("keydown", (event:any) => smartInput(event, index, fields));
  });
};

const uiCanInteract = ():void => {
  displayCartTotal();
  cardDigits[0].focus();
  enableSmartTyping();
  document.querySelector(".payButton").addEventListener("click", validatePayment);
};

window.addEventListener("load", uiCanInteract);
