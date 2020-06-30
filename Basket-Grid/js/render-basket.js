window.onload = function () {
  renderBasket();
};

function renderBasket() {
  var items = Object.values(JSON.parse(localStorage.getItem("shopData")))[0];
  var empty = true;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.quantity > 0) {
      empty = false;
      var html = `<div class="basket-item">
          <div class="item-icon"><i class="fas fa-globe"></i></div>
          <div class="item-name" id="ID${i}"><h2>${item.name}</h2></div>
          <div class="item-description"><p>${item.description}</p></div>
          <div class="item-price"><h3>£${item.price * item.quantity}</h3></div>
          <div class="item-menu-bar">
            <div class="item-addons"><button onclick="toggleAddons(this)" class="addons-btn transparent-btn">addons</button></div>
            <div class="item-delete"><button onclick="removeItem(this)" class="delete-btn transparent-btn">delete</button></div>
          </div>
        </div>`;
      document
        .getElementById("basket-container")
        .insertAdjacentHTML("afterbegin", html);
    }
  }
  if (!empty) {
    renderSummary();
  } else {
    emptyBasket();
  }
}

function emptyBasket() {
  var html = `<div id="empty-basket"><h2>Your basket is empty.</h2></div>`;
  document
    .getElementById("basket-container")
    .insertAdjacentHTML("afterbegin", html);
}

function renderSummary() {
  if (document.getElementById("basket-total") === null) {
    var html = `<div id="basket-total">Basket Total</div>
  <div id="total-value"></div>
  <div id="checkout-btns"></div>`;
    document
      .getElementById("basket-summary")
      .insertAdjacentHTML("afterbegin", html);
  }
  document.getElementById("total-value").innerText = "£" + getTotal();
}

function getTotal() {
  var items = document.getElementsByClassName("basket-item");
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    total += parseInt(document.getElementsByClassName("item-price")[i].innerText.substring(1));
  }
  return total;
}

function removeItem(item) {
  var btn = document.getElementsByClassName("delete-btn");
  btn = [].slice.call(btn);
  var index = btn.indexOf(item);
  var price = document.getElementById("total-value").innerText.substring(1);
  price -= parseInt(document.getElementsByClassName("item-price")[index].innerText.substring(1));
  document.getElementById("total-value").innerText = "£"+price;
  var id = document.getElementsByClassName("item-name")[index].id.substring(2);
  setItemQuantity(id, 0);
  document.getElementsByClassName("basket-item")[index].remove();
  if(document.getElementsByClassName("basket-item").length === 0) {
    document.getElementById("basket-summary").innerHTML = "";
    emptyBasket();
  }
}

function toggleAddons(item) {
  var btn = document.getElementsByClassName("addons-btn");
  btn = [].slice.call(btn);
  var index = btn.indexOf(item);
  var addonContainerID = getAddonContainerID(index);
  if(document.getElementsByClassName("addons-container")[addonContainerID] === undefined) {
    displayAddons(index);
} else {
    document.getElementsByClassName("addons-container")[addonContainerID].remove();
    document.getElementsByClassName("basket-item")[index].style = null;
    document.getElementsByClassName("basket-item")[index].style.gridTemplateRows = "30px 35px 55px 40px"
    document.getElementsByClassName("basket-item")[index].style.gridTemplateAreas =
    `"item-icon . ."
     "item-icon item-name ."
     "item-icon item-description item-price"
     "item-icon item-menu-bar .";`
    document.getElementsByClassName("item-icon")[index].style.marginTop = null;
}
}

function displayAddons(index) {
  var id = document.getElementsByClassName("item-name")[index].id.substring(2);
  document.getElementsByClassName("basket-item")[index].style.gridTemplateRows = "30px 35px 55px 40px 20px 160px";
  document.getElementsByClassName("basket-item")[index].style.gridTemplateAreas =
    `"item-icon . ."
    "item-icon item-name ."
    "item-icon item-description item-price"
    ". item-menu-bar ."
    ". addons-container ."`;
  document.getElementsByClassName("item-icon")[index].style.marginTop = "70px";
  var html = `<div class="addons-container">
              <div class="addon-item-heading">
                <div class="addon-title-heading">Addon</div>
                <div class="addon-price-heading">Price</div>
              </div>
            </div>`
  document
    .getElementsByClassName("item-menu-bar")[index]
    .insertAdjacentHTML("afterend", html);
  var addonContainerID = getAddonContainerID(index);
  getItemAddons(id, index, addonContainerID);
}

function getAddonContainerID(index) {
  var item = document.getElementsByClassName("basket-item")[index];
  for(var i = item.children.length-1; i > 0; i--) {
    if(item.children[i].className === "addons-container") {
      var addonsContainer = document.getElementsByClassName("addons-container");
      addonsContainer = [].slice.call(addonsContainer);
      return addonsContainer.indexOf(item.children[i]);
    }
  }
}


function getItemAddons(id, index, addonContainerID) {
  var addonNames = Object.values(JSON.parse(localStorage.getItem("shopData")))[0][id].addonNames;
  var addonPrices = Object.values(JSON.parse(localStorage.getItem("shopData")))[0][id].addonPrices;
  for(var i = 0; i < addonNames.length; i++) {
    var html = `<div class="addon-item">
                <div class="addon-title">${addonNames[i]}</div>
                <div class="addon-select-btn"><button class="radioBtnNotSelected" onclick="addAddon(${i}, ${index}, ${addonContainerID})"></button></div>
                <div class="addon-price">£${addonPrices[i]}</div>
                </div>`
      document
        .getElementsByClassName("addons-container")[addonContainerID]
        .insertAdjacentHTML("beforeend", html);
  }
}

function addAddon(addonIndex, itemIndex, addonContainerID) {
  console.log("addonIndex: "+addonIndex+" itemIndex : "+itemIndex+" addonContainerID: "+addonContainerID);
  var index = addonIndex+1;
  if(document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[1].children[0].className === "radioBtnNotSelected") {
    document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[1].children[0].className = "radioBtnSelected";
    document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[1].children[0].style.backgroundColor = "green";
    var cost = parseInt(document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[2].innerText.substring(1));
    var itemPrice = parseInt(document.getElementsByClassName("item-price")[itemIndex].children[0].innerText.substring(1));
    itemPrice += cost;
    document.getElementsByClassName("item-price")[itemIndex].children[0].innerText = "£"+itemPrice;
    var totalPrice = parseInt(document.getElementById("total-value").innerText.substring(1));
    totalPrice += cost;
    document.getElementById("total-value").innerText = "£"+totalPrice;
  } else {
    document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[1].children[0].className = "radioBtnNotSelected";
    document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[1].children[0].style.backgroundColor = "white";
    var cost = parseInt(document.getElementsByClassName("addons-container")[addonContainerID].children[index].children[2].innerText.substring(1));
    var itemPrice = parseInt(document.getElementsByClassName("item-price")[itemIndex].children[0].innerText.substring(1));
    itemPrice -= cost;
    document.getElementsByClassName("item-price")[itemIndex].children[0].innerText = "£"+itemPrice;
    var totalPrice = parseInt(document.getElementById("total-value").innerText.substring(1));
    totalPrice -= cost;
    document.getElementById("total-value").innerText = "£"+totalPrice;
  }
}
