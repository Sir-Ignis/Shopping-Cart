window.onload = function () {
  renderBasket();
};

//renders the basket
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
    renderCheckoutContainer();
  } else {
    emptyBasket();
  }
}

//displays that the basket is empty if it has no items
function emptyBasket() {
  var html = `<div id="empty-basket"><h3>Your basket is empty.</h3></div>`;
  document
    .getElementById("basket-container")
    .insertAdjacentHTML("afterbegin", html);
}

//adds the summary container to the page
function renderSummary() {
  if (document.getElementById("basket-total") === null) {
    var html = `<div id="basket-summary">
                  <div id="basket-total">Basket Total:</div>
                  <div id="total-value"></div>
                </div>
                `;
    document
      .getElementById("basket-container")
      .insertAdjacentHTML("beforeend", html);
  }
  document.getElementById("total-value").innerText = "£" + getTotal();
}
//adds the checkout container to the page
function renderCheckoutContainer() {
  const CHECKOUT_MESSAGE = `Welcome to Clone42! 50% off on your first order. Enter your unique promocode <button id="promo-drop-dwn" style="color:green" class="transparent-btn">here</button>.`
  if(document.getElementById("checkout-container") === null) {
    var html = `<div id="checkout-container">
                <div id="basket-checkout-total"><span>Basket Total: </span><span id="checkout-total-value"></span></div>
                <div id="checkout-btns"><div id="paypal-paypal-btn-container"></div><div id="paypal-card-btn-container"></div></div>
                <div id="checkout-message"><p>${CHECKOUT_MESSAGE}</p></div>
                </div>
                `;
    document
      .getElementById("main-container")
      .insertAdjacentHTML("beforeend", html);
    var stylesTemplateAreas = getComputedStyle(document.getElementById("checkout-container")).gridTemplateAreas;
    var stylesRows = getComputedStyle(document.getElementById("checkout-container")).gridTemplateRows;
    document.getElementById("checkout-container").style.gridTemplateAreas = stylesTemplateAreas;
    document.getElementById("checkout-container").style.gridTemplateAreas = stylesRows;
    var oldTemplateAreas = document.getElementById("checkout-container").style.gridTemplateAreas;
    var oldRows = document.getElementById("checkout-container").style.gridTemplateRows;
    document.getElementById("promo-drop-dwn").addEventListener("click", function(){promoDropDwn(oldRows, oldTemplateAreas)});
  }
  document.getElementById("checkout-total-value").innerText = "£" + getTotal();
  if(document.getElementById("paypal-paypal-btn-container").innerHTML === "") {
    renderPaypalBtn();
  }
  if(document.getElementById("paypal-card-btn-container").innerHTML === "") {
    renderPaypalCardBtn();
  }
}

//renders the paypal button and sets up the order properties
function renderPaypalBtn(FUNDING_SOURCES) {
  var FUNDING_SOURCES = [
    paypal.FUNDING.PAYPAL,
    paypal.FUNDING.VENMO,
    paypal.FUNDING.CREDIT,
    paypal.FUNDING.CARD
  ];
paypal.Buttons({
  env: 'sandbox',
  commit: true,
  fundingSource: FUNDING_SOURCES[0],
  // Configure environment
  client: {
    sandbox: 'Af9_JLbIYd9RXQbiGRr8D4p0Gdheaiw9IplHBEZ4hbRYtnvURir2QC5WcxNIqZys9qvZJDOurPR34TEj',
    production: 'demo_production_client_id'
  },
  onClick: function(){renderOrderSummary(false)},
  // Set up order
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: getTotal().toFixed(2),
          currency_code: 'GBP',
          breakdown: {
            item_total: {
              value: getTotal().toFixed(2),
              currency_code: 'GBP'
            }
          }
        },
        description: "Clone42 Ltd. Website Development Service",
        items: getOrderItems()
      }],
    });
  },
  onApprove: function(data, actions) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function(details) {
      memOrderInfo(details.payer.name.given_name, data.orderID);
      window.location.replace('order_complete.html');
    });
  }
}).render('#paypal-paypal-btn-container');
}

function memOrderInfo(payerName, orderId) {
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[2] = payerName;
  y[3] = orderId;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}

/*renders the paypal card button and adds an onclick function
  to it which removes the shop item grid and replaces it with
  a new order summary grid*/
function renderPaypalCardBtn(FUNDING_SOURCES) {
  var FUNDING_SOURCES = [
    paypal.FUNDING.PAYPAL,
    paypal.FUNDING.VENMO,
    paypal.FUNDING.CREDIT,
    paypal.FUNDING.CARD
  ];
  var button = paypal.Buttons({
  env: 'sandbox',
  commit: true,
  fundingSource: FUNDING_SOURCES[3],
  onClick: function(){
    renderOrderSummary(true)
  },
  // Set up order
  createOrder: function(data, actions) {
    return actions.order.create({
      purchase_units: [{
        amount: {
          value: getTotal().toFixed(2),
          currency_code: 'GBP',
          breakdown: {
            item_total: {
              value: getTotal().toFixed(2),
              currency_code: 'GBP'
            }
          }
        },
        description: "Clone42 Ltd. Website Development Service",
        items: getOrderItems()
      }],
    });
  },
  onApprove: function(data, actions) {
    // This function captures the funds from the transaction.
    return actions.order.capture().then(function(details) {
      memOrderInfo(details.payer.name.given_name, data.orderID);
      window.location.replace('order_complete.html');
    });
  }
  });
  button.render("#paypal-card-btn-container");
}

/*renders order summary, if card is true
  then the card and order panels are rendered
  and paypal-paypal-btn-container is removed
  else paypal-card-btn-container is remove
  and just the order panel is rendered
*/
function renderOrderSummary(card) {
    document.getElementById("basket-container").style.display = "none";
    document.getElementById("main-container").style.gridTemplateColumns = "100%";
    document.getElementById("main-container").style.gridTemplateAreas = `"checkout-container"`;
    document.getElementById("checkout-container").style.margin = "0";
    document.getElementById("checkout-container").style.padding = "15px 15px 0 15px";
    if(card) {
      document.getElementById("paypal-paypal-btn-container").remove();
      document.getElementById("paypal-card-btn-container").style.maxWidth = "100%";
      document.getElementById("paypal-card-btn-container").style.width = "100%";
    } else {
      document.getElementById("checkout-btns").style.display = "none";
    }
    document.getElementById("basket-title").remove()
    if(card) {
      document.getElementById("checkout-container").style.gridTemplateRows = "auto";
      if(window.screen.width > 1200) {
        document.getElementById("checkout-container").style.gridTemplateAreas = `"checkout-btns checkout-order-summary"`;
        document.getElementById("checkout-btns").style.paddingRight = "15px";
        if(window.width > 1400) {
          document.getElementById("checkout-container").style.gridTemplateColumns = "50% 50%";
        } else {
          document.getElementById("checkout-container").style.gridTemplateColumns = "45% 55%";
        }
      } else {
        document.getElementById("checkout-container").style.gridTemplateColumns = "100%";
        document.getElementById("checkout-container").style.gridTemplateAreas = `
        "checkout-btns"
        "checkout-order-summary"`;
      }
    } else {
      document.getElementById("checkout-container").style.gridTemplateAreas = `"checkout-order-summary"`;
      if(window.screen.width < 1600) {
        document.getElementById("checkout-container").style.gridTemplateColumns = "100%";
      } else {
        document.getElementById("checkout-container").style.gridTemplateColumns = "50%";
      }
      document.getElementById("checkout-container").style.gridTemplateRows = "auto";
    }
    /*if(card && window.width > 1400) {
      document.getElementById("checkout-container").style.gridTemplateRows = "auto auto";
    }*/
    if(window.width < 414) {
      document.getElementById("checkout-container").style.padding = "0";
    }
    document.getElementById("checkout-message").remove();
    document.getElementById("checkout-total-value").remove();
    document.getElementById("basket-checkout-total").remove();
    var html = `<div id="checkout-order-summary">
                  <div id="checkout-order-headings">
                    <div id="order-summary-heading">Order Summary</div>
                    <div id="order-item-name-heading">Item Name</div>
                    <div id="order-item-addons-heading">Item Addons</div>
                    <div id="order-item-price-heading">Item Total Price</div>
                  </div>
                  <div id="order-items"></div>
                  <div id="orderTotal"></div>
                  <div><a style="color:black" href="basket.html">return to basket</a></div>
                </div>`;
    document
      .getElementById("checkout-container")
      .insertAdjacentHTML("beforeend", html)
    document.querySelector("#checkout-order-summary div a").parentNode.style.padding = "20px 0";
    var items = Object.values(JSON.parse(localStorage.getItem("shopData")))[0];
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (item.quantity > 0) {
        var itemSummary = `<div class="item-order-summarized">
                            <div class="order-item-name">${item.name}</div>
                            <div class="order-item-addons">${getOrderAddons(item)}</div>
                            <div class="order-item-price">£${item.price}</div>
                           </div>`
        document
          .getElementById("order-items")
          .insertAdjacentHTML("beforeend", itemSummary)
      }
    }
    var orderPriceArea = document.getElementsByClassName("order-item-price");
    document.getElementsByClassName("order-item-price")[orderPriceArea.length-1].style.borderRadius = "0 0 5px";
    var orderTotal = `
                        <div id="order-total-heading">Order total:</div>
                        <div id="order-total-value">£${getTotal()}</div>
                      `
    document
      .getElementById("orderTotal")
      .insertAdjacentHTML("beforeend", orderTotal);
}

//returns the addons as a single string with each addon seperated by a comma
function getOrderAddons(item) {
  var addons = item.addonNames;
  var hasAddons = []
  for(var i = 0; i < addons.length; i++) {
    if(addons[i][1] === 1) {
      hasAddons = [
        ...hasAddons, addons[i][0]];
    }
  }
  if(hasAddons.length === 0) {
    return "none";
  }
  return hasAddons.join(", ");
}

//returns the addons total price for item
function getOrderAddonsPrices(item) {
  var addons = item.addonNames;
  var addonPrices = item.addonPrices;
  var totalPrice = 0;
  for(var i = 0; i < addons.length; i++) {
    if(addons[i][1] === 1) {
      totalPrice += addonPrices[i][0];
    }
  }
  return totalPrice;
}

//returns the item total as an int
function getTotal() {
  var items = document.getElementsByClassName("basket-item");
  var total = 0;
  for(var i = 0; i < items.length; i++) {
    total += parseInt(document.getElementsByClassName("item-price")[i].innerText.substring(1));
  }
  return total;
}

//returns an array of order items
function getOrderItems() {
  var items = Object.values(JSON.parse(localStorage.getItem("shopData")))[0];
  var orderedItems = []
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (item.quantity > 0) {
      orderedItems = [
        ...orderedItems,
        {
          name: item.name,
          unit_amount: {
                          value:item.price+'.00',
                          currency_code: 'GBP'
                       },
          quantity: item.quantity+""
        },
      ];
    }
  }
  return orderedItems;
}

//value = <symbol><number>
//eg +10 to increment price by 10
function renderTotalPrice(value) {
  var price = document.getElementById("total-value").innerText.substring(1);
  if(value.slice(0,1) === "+") {
    document.getElementById("total-value").innerText = "£" + (parseInt(price) + parseInt(value.slice(1)));
    document.getElementById("checkout-total-value").innerText = "£" + (parseInt(price) + parseInt(value.slice(1)));
  } if(value.slice(0,1) === "-") {
    document.getElementById("total-value").innerText = "£" + (parseInt(price) - parseInt(value.slice(1)));
    document.getElementById("checkout-total-value").innerText = "£" + (parseInt(price) - parseInt(value.slice(1)));
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
    document.getElementById("basket-summary").remove();
    document.getElementById("checkout-container").remove();
    emptyBasket();
  }
}

//removes the addon container
function renderRemoveAddon(index, addonContainerID) {
  document.getElementsByClassName("addons-container")[addonContainerID].remove();
  document.getElementsByClassName("basket-item")[index].style = null;
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
  document.getElementsByClassName("basket-item")[index].style.gridAutoRows = "auto"
  if(window.screen.width > 499) {
  document.getElementsByClassName("basket-item")[index].style.gridTemplateAreas =
    `". . ."
    "item-icon item-name item-price"
    "item-icon item-description ."
    ". item-menu-bar ."
    ". addons-container ."`;
  } else {
    document.getElementsByClassName("basket-item")[index].style.gridTemplateAreas =
      `". . ."
      "item-icon item-name item-price"
      "item-icon item-description item-description"
      ". item-menu-bar ."
      ". addons-container addons-container"`;
  }
  //document.getElementsByClassName("item-icon")[index].style.marginTop = "70px";
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

//returns true if item has an addon container otherwise false
function hasAddonContainer(item) {
  for(var j = item.children.length-1; j > 0; j--){
    if(item.children[j].className === "addons-container") {
      return true;
    }
  }
  return false;
}

//returns the addon container id
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

/*displays the item addons with "radio buttons" acting
  as selectors for each addon*/
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

//renders a button that mimicks radio button behaviour
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

/*sets the basket addon item to 0 if the button is not selected
  indicated it should not be coloured else 1 if it is selected
  and coloured*/
function memColour(id, i, selected) {
  var id = document.getElementsByClassName("basket-item")[id].children[1].id.slice(-1);
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][id].addonNames[i][1] = selected ? 1 : 0;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}

/*updates the item and total prices in localStorage to
  the current item and total prices*/
function memPrice(id, itemPrice, totalPrice) {
  var id = document.getElementsByClassName("basket-item")[id].children[1].id.slice(-1);
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][id].price = itemPrice;
  y[1] = totalPrice;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}

/*renders the addon buttons with correct colours depending on
  thei selected states*/
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

/*creates the promocode form if it's not on the screen and if the code
hasn't been entered before*/
function promoDropDwn(oldRows, oldTemplateAreas) {
  if(document.getElementById('promo-drop-dwn-contents') === null && Object.values(JSON.parse(localStorage.getItem("shopData")))[4] !== "PROMO2020") {
    if(window.screen.width > 800) {
    var newTemplateAreas = oldTemplateAreas + " \"promo-drop-dwn-contents\"";
    } else {
        var newTemplateAreas = oldTemplateAreas + " \"promo-drop-dwn-contents promo-drop-dwn-contents\"";
    }
    var newRows = oldRows + " 40px";
    document.getElementById("checkout-container").style.gridTemplateAreas= newTemplateAreas;
    document.getElementById("checkout-container").style.gridTemplateRows = newRows;
    var html = `<div id="promo-drop-dwn-contents">
                  <form onsubmit="event.preventDefault(); validateMyForm();">
                     <input type="text" id="promo-code-value" name="promocode-value" placeholder="">
                     <input id="promo-code-submit" type="submit" value="Submit">
                  </form>
                </div>`;
    document
      .getElementById("checkout-message")
      .insertAdjacentHTML("afterend", html);
  } else if(document.getElementById('promo-drop-dwn-contents') !== null) {
    removePromoDropDwn(oldTemplateAreas, oldRows);
  }
}

//removes the promo code form
function removePromoDropDwn(oldTemplateAreas, oldRows) {
  document.getElementById("checkout-container").style.gridTemplateAreas = oldTemplateAreas;
  document.getElementById("checkout-container").style.gridTemplateRows = oldRows;
  document.getElementById('promo-drop-dwn-contents').remove();
}

/*checks if the code that's been entered is valid
; updates prices and closes the form if it's valid*/
function validateMyForm() {
 var code = document.getElementById('promo-code-value').value;
 //TODO: implement promo code getter
 if(code === "PROMO2020" && Object.values(JSON.parse(localStorage.getItem("shopData")))[4] !== code) {
   var x = JSON.parse(localStorage.getItem("shopData"))
   var y = Object.values(x)
   y[4] = code;
   for(var i = 0; i < document.getElementsByClassName('basket-item').length; i++) {
     y[0][i].price *= 0.5;
     updateItemPrices(y[0][i].price, i);
   }
   updateTotalPrices();
   Object.assign(x, y);
   localStorage.setItem("shopData", JSON.stringify(x));
   removePromoDropDwn();
 }
}

//sets the basket item price with index i to itemPrice
function updateItemPrices(itemPrice,i) {
  var idStr = "ID"+i;
  var index = getIndexOfClassEle(document.getElementById(idStr))
  var prices = document.getElementsByClassName("item-price");
  prices[index].children[0].innerText = "£"+itemPrice;
}

//updates the total prices to current total price
function updateTotalPrices() {
  document.getElementById("total-value").innerText = "£" + getTotal();
  document.getElementById("checkout-total-value").innerText = "£" + getTotal();
}


//returns the index of the element
function getIndexOfClassEle(item) {
  var className = document.getElementsByClassName(item.className);
  className = [].slice.call(className);
  return className.indexOf(item);
}
