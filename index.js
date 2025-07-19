import { menuArray } from "./data";
const menuWrapper = document.getElementById("menu-id");
const cartWrapper = document.getElementById("cart-wrapper");
const cartDiv = document.getElementById("cart-items");
const totalPrice = document.getElementById("total-price");
const orderBtn = document.getElementById("order-btn");
const cardModalContainer = document.getElementById("card-modal-container");
const thanksTextContainer = document.getElementById("thanks-text-container");
import { v4 as uuidv4 } from "uuid";

const openCardModal = () => {
  cardModalContainer.innerHTML = `
        <form class='card-form-container'>
          <h2 class='card-title'>Enter card details</h2>
          <input 
            type='text' 
            name='name'
            placeholder="Enter your name" 
            required />
          <input
            type="text"
            name='cardNumber'
            id="card-number"
            maxlength="19"
            placeholder="Enter card number"
            required
          />
          <input
            type="text"
            name='cvv'
            id="card-cvv"
            maxlength="4"
            placeholder="Enter CVV"
            required
          />
         <button class='pay-btn' data-pay-btn='user paid'>Pay</button>
        </form>
    `;
  cardModalContainer.style.display = "flex";
};

orderBtn.addEventListener("click", openCardModal);

document.addEventListener("click", (e) => {
  if (e.target.dataset.addItemBtn) {
    addToCart(e.target.dataset.addItemBtn);
  } else if (e.target.dataset.removeItem) {
    removeFromCart(e.target.dataset.removeItem);
  } else if (e.target.dataset.payBtn) {
    e.preventDefault(); // prevent page reload
    const form = e.target.closest("form");
    const formData = new FormData(form);
    const name = formData.get("name");
    userPaid(name);
  }
});

let shoppingCart = [];

const addToCart = (id) => {
  const menuItem = menuArray.filter((item) => {
    return item.id === Number(id);
  })[0];
  menuItem["uuid"] = uuidv4();
  shoppingCart.push(menuItem);
  render();
};

const removeFromCart = (id) => {
  const indexToRemove = shoppingCart.findIndex((item) => item.uuid === id);

  if (indexToRemove !== -1) {
    shoppingCart.splice(indexToRemove, 1);
  }
  render();
};

const userPaid = (name) => {
  cardModalContainer.style.display = "none";
  shoppingCart = [];
  render();
  thanksTextContainer.innerHTML = `
    <p class='thanks-text'>Thanks, ${name}! Your order is on its way!</p>
    `;
  thanksTextContainer.style.display = "flex";
  setTimeout(() => {
    thanksTextContainer.style.display = "none";
  }, 4000);
};

const getMenu = () => {
  const menuHTML = menuArray
    .map((item) => {
      const { name, ingredients, price, emoji, id } = item;
      return `
          <div class='menu-container'>
              <div class='menu-item-container'>
                   <div class='emoji'>${emoji}</div> 
                  <div class='item-description'>
                      <h3 class='item-name'>${name}</h3>
                      <p class='item-ingredients'>${ingredients}</p>
                      <p class='item-price'>$${price}</p>
                  </div>
                  <div class='icon-container'>
                      <i class="fa-solid fa-plus icon" data-add-item-btn='${id}'></i>
                  </div>
              </div>
          </div>
      `;
    })
    .join("");
  return menuHTML;
};

const render = () => {
  menuWrapper.innerHTML = getMenu();
  if (shoppingCart.length > 0) {
    if (cartWrapper.classList.contains("hidden")) {
      cartWrapper.classList.toggle("hidden");
    }
    const cartItems = shoppingCart
      .map((item) => {
        return `
        <div class='cart-items-container'>
            <h3 class='cart-item-name'>${item.name}</h3>
            <p class='remove' data-remove-item=${item.uuid}>remove</p>
            <p class='item-price cart-price'>$${item.price}</p>
        </div>
        `;
      })
      .join("");
    const totalCartPrice = shoppingCart.reduce((total, currentItem) => {
      return total + currentItem.price;
    }, 0);
    cartDiv.innerHTML = cartItems;
    totalPrice.innerHTML = ` 
        <h3 class='total-price'>Total Price</h3>
        <p class='item-price cart-price'>$${totalCartPrice}</p>
    `;
  } else {
    cartDiv.innerHTML = ``;
    totalPrice.innerHTML = ``;
    if (
      shoppingCart.length === 0 &&
      !cartWrapper.classList.contains("hidden")
    ) {
      cartWrapper.classList.toggle("hidden");
    }
  }
};

render();
