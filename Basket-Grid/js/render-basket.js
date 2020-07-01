/*TODO: fix addonContainerID problems: the addonContainer
        addons are being printed in the wrong addonContainer
        plus there are bugs when deleting items*/
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

//value = <symbol><number>
//eg +10 to increment price by 10
function renderTotalPrice(value) {
  var price = document.getElementById("total-value").innerText.substring(1);
  if(value.slice(0,1) === "+") {
    document.getElementById("total-value").innerText = "£" + (parseInt(price) + parseInt(value.slice(1)));
  } if(value.slice(0,1) === "-") {
    document.getElementById("total-value").innerText = "£" + (parseInt(price) - parseInt(value.slice(1)));
  }
}

//deletes basket item
function removeItem(item) {
  var index = getIndexOfClassEle(item);
  var value = "-"+document.getElementsByClassName("item-price")[index].innerText.substring(1);
  var itemId = document.getElementsByClassName("item-name")[index].id.substring(2);
  renderTotalPrice(value)
  setItemQuantity(itemId, 0);
  document.getElementsByClassName("basket-item")[index].remove();
  if(document.getElementsByClassName("basket-item").length === 0) {
    document.getElementById("basket-summary").innerHTML = "";
    emptyBasket();
  }
}

//removes the addon container
function renderRemoveAddon(index, addonContainerID) {
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

//shows or removes basket item addons
function toggleAddons(item) {
  var index = getIndexOfClassEle(item);
  var addonContainerID = getAddonContainerID(index);
  var basketItem = document.getElementsByClassName("basket-item")[index];
  if(document.getElementsByClassName("addons-container")[addonContainerID] === undefined || !hasAddonContainer(basketItem)) {
    if(document.getElementsByClassName("addons-container")[addonContainerID] !== undefined) {
      document.getElementsByClassName("addons-container")[addonContainerID].style.display = "grid";
    }
    renderShowAddon(index, addonContainerID);
  } else {
    renderRemoveAddon(index, addonContainerID)
  }
}

//shows the addon container
function renderShowAddon(index, addonContainerID) {
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
  renderItemAddons(id, index, addonContainerID);
}

function hasAddonContainer(item) {
  for(var j = item.children.length-1; j > 0; j--){
    if(item.children[j].className === "addons-container") {
      return true;
    }
  }
  return false;
}

function getAddonContainerID(index) {
  var items = document.getElementsByClassName("basket-item");
  var addonContainers = 0;
  if(document.getElementsByClassName("addons-container") !== undefined) {
    for(var i = 0; i < items.length; i++) {
      if(i === index) {
        return addonContainers;
      }
      if(hasAddonContainer(items[i])) {
        addonContainers++;
      }
    }
  }
  return addonContainers;
}

function renderItemAddons(id, index, addonContainerID) {
  var addonNames = Object.values(JSON.parse(localStorage.getItem("shopData")))[0][id].addonNames;
  var addonPrices = Object.values(JSON.parse(localStorage.getItem("shopData")))[0][id].addonPrices;
  for(var i = 0; i < addonNames.length; i++) {
    var selected = addonNames[i][1] === 0 ? "radioBtnNotSelected" : "radioBtnSelected";
    var btnColour = addonNames[i][1] === 0 ? `white` : `green`;
    var html = `<div class="addon-item">
                <div class="addon-title">${addonNames[i][0]}</div>
                <div class="addon-select-btn"><button class="${selected}" onclick="addAddon(${i}, ${index}, getAddonContainerID(${index}))" style="background-color:${btnColour}"></button></div>
                <div class="addon-price">£${addonPrices[i]}</div>
                </div>`
      document
        .getElementsByClassName("addons-container")[addonContainerID]
        .insertAdjacentHTML("beforeend", html);
  }
}

function renderRadioBtn(radioBtn, addonContainerChildren, itemIndex, selected) {
  radioBtn.className = selected ? "radioBtnSelected" : "radioBtnNotSelected";
  radioBtn.style.backgroundColor = selected ? "green" : "white";
  var itemPrice = document.getElementsByClassName("item-price")[itemIndex].children[0].innerText.slice(1);
  var addonPrice = addonContainerChildren.children[2].innerText.substring(1);
  var cost = selected ? "+"+addonPrice : "-"+addonPrice;
  document.getElementsByClassName("item-price")[itemIndex].children[0].innerText = "£"+(parseInt(itemPrice)+parseInt(cost));
  itemPrice = document.getElementsByClassName("item-price")[itemIndex].children[0].innerText.slice(1);
  renderTotalPrice(cost)
  var totalPrice = document.getElementById("total-value").innerText.substring(1);
  memPrice(itemIndex, itemPrice, totalPrice);
}

function memColour(id, i, selected) {
  var id = document.getElementsByClassName("basket-item")[id].children[1].id.slice(-1);
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][id].addonNames[i][1] = selected ? 1 : 0;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}

function memPrice(id, itemPrice, totalPrice) {
  var id = document.getElementsByClassName("basket-item")[id].children[1].id.slice(-1);
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][id].price = itemPrice;
  y[1] = totalPrice;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}


function addAddon(addonIndex, itemIndex, addonContainerID) {
  var index = addonIndex+1;
  var addonContainerChildren = document.getElementsByClassName("addons-container")[addonContainerID].children[index];
  var radioBtn = addonContainerChildren.children[1].children[0];
  //wasn't selected before so now we can select it
  if(radioBtn.className === "radioBtnNotSelected") {
    memColour(itemIndex, addonIndex, true);
    renderRadioBtn(radioBtn, addonContainerChildren, itemIndex, true)
  } else {
    //was selected before so now we deselect it
    memColour(itemIndex, addonIndex, false);
    renderRadioBtn(radioBtn, addonContainerChildren, itemIndex, false)
  }
}

function getIndexOfClassEle(item) {
  var className = document.getElementsByClassName(item.className);
  className = [].slice.call(className);
  return className.indexOf(item);
}
