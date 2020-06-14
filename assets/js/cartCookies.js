let fileName = window.location.pathname
  .split("/")
  .filter(function (c) {
    return c.length;
  })
  .pop();

function incCookie(name, props) {
  props.quantity += 1;
  Cookies.set(name, JSON.stringify(props));
  render(name, props);
}

function decCookie(name, props) {
  props.quantity -= 1;
  Cookies.set(name, JSON.stringify(props));
  render(name, props);
}

function isOnPage(name) {
  var titles = document.getElementsByClassName("cart-item-title");
  for (var i = 0; i < titles.length; i++) {
    if (titles[i] === name) {
      return true;
    }
  }
  return false;
}

function renderNewItem(cookie) {
  props = JSON.parse(cookie[1]);
  var html = `<div id="${cookie[0]}" class="row item-row">
            <div class="col item-col">
                <div class="row row-nowrap">
                    <div class="col cart-item-col d-flex justify-content-start align-items-center">
                        <h4 class="cart-item-title">${props.name}</h4>
                    </div>
                </div>
                <div class="row row-nowrap">
                    <div class="col cart-item-col d-flex justify-content-start align-items-center"><img class="item-img" src="assets/img/${
                      props.image
                    }"></div>
                    <div class="col item-desc-col d-flex">
                        <p class="item-desc">${props.description}</p>
                    </div>
                </div>
                <div class="row row-nowrap">
                    <div class="col cart-item-col pad">
                        <h5 class="item-subtitle"></h5>
                    </div>
                    <div class="col item-control-col">
                        <div class="row">
                            <div class="col control-col">
                                <div class="row control-row">
                                    <div class="col quantity-title-col d-flex justify-content-end">
                                        <h6>Quantity</h6>
                                    </div>
                                    <div class="col price-title-col d-flex justify-content-end">
                                        <h6>Price</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col control-col">
                                <div class="row row-nowrap control-row">
                                    <div class="col d-flex quantity-control-col d-flex justify-content-center">
                                        <div class="row row-nowrap">
                                            <div class="col inc-dec-col d-flex justify-content-end align-items-center"><button class="dec-btn" onclick="incDec(this, false)"><div class="fas fa-minus inc-dec-icon"></div></button></div>
                                            <div class="col quantity-col d-flex justify-content-center" style="padding: 0;">
                                                <h5 class="item-quantity">${
                                                  props.quantity
                                                }</h5>
                                            </div>
                                            <div class="col inc-dec-col d-flex justify-content-start align-items-center"><button class="inc-btn" onclick="incDec(this, true)"><div class="fas fa-plus inc-dec-icon"></div></button></div>
                                        </div>
                                    </div>
                                    <div class="col price-col d-flex justify-content-center">
                                        <h5 class="item-price">£${
                                          props.price * props.quantity
                                        }</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
  document
    .getElementById("shop-container")
    .insertAdjacentHTML("beforeend", html);
  document.getElementById("total-heading-col").style.opacity = "1";
  document.getElementById("total-price").innerHTML = "£" + getTotal();
}

function renderUpdateItem(cookie) {
  var items = document.getElementsByClassName("item-row");
  for (var i = 0; i < items.length; i++) {
    document.getElementsByClassName("item-quantity")[i] = cookie[1].quantity;
    document.getElementsByClassName("item-price")[i] = cookie[1].price;
  }
  if (items.length > 0) {
    document.getElementById("total-heading-col").style.opacity = "1";
    document.getElementById("total-price").innerHTML = "£" + getTotal();
  } else {
    document.getElementById("cart-is-empty").style.opacity = "1";
  }
}

if (fileName === "shopping-cart.html") {
  window.onload = function renderCart() {
    console.log("called on load");
    if (document.getElementsByClassName("item-row").length > 0) {
      document.getElementById("cart-is-empty").style.opacity = "0";
    }
    if (
      document.getElementsByClassName("cart-item-title")[0].innerHTML ===
      "Item Title"
    ) {
      document.getElementsByClassName("item-row")[0].remove();
    }
    if (document.getElementsByClassName("cart-item-title")[0] === undefined) {
      console.log("case1a");
      document.getElementById("total-heading-col").style.opacity = "0";
    } else {
      console.log("case1b");
      document.getElementById("total-heading-col").style.opacity = "1";
    }
    if (document.getElementById("total-price").innerHTML === "£99.99") {
      console.log("case2");
      document.getElementById("total-price").innerHTML = "";
    }
    var o = Cookies.get();
    var sortedCookies = Object.keys(o)
      .sort()
      .reduce((r, k) => ((r[k] = o[k]), r), {});
    for (var i = 0; i < Reflect.ownKeys(sortedCookies).length; i++) {
      var cookie = Object.entries(sortedCookies)[i];
      try {
        if (
          !isOnPage(JSON.parse(cookie[1]).name) &&
          JSON.parse(cookie[1]).quantity > 0
        ) {
          console.log("render new item");
          renderNewItem(cookie);
        } else {
          console.log("called update item");
          renderUpdateItem(cookie);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
}

function addItem(name, props) {
  if (Cookies.get(name) !== undefined) {
    incCookie(name, props);
  } else {
    Cookies.set(name, props);
  }
}

function incDec(item, opInc) {
  var btns =
    opInc === true
      ? document.getElementsByClassName("inc-btn")
      : document.getElementsByClassName("dec-btn");
  btns = [].slice.call(btns);
  var index = btns.indexOf(item);
  var cookieKey = document.getElementsByClassName("item-row")[index].id;
  if (opInc === true) {
    incCookie(cookieKey, JSON.parse(Cookies.get(cookieKey)));
  } else {
    decCookie(cookieKey, JSON.parse(Cookies.get(cookieKey)));
  }
}

function getTotal() {
  var prices = document.getElementsByClassName("item-price");
  var total = 0;
  for (var i = 0; i < prices.length; i++) {
    console.log(prices[i].innerHTML.substring(1));
    total += parseInt(prices[i].innerHTML.substring(1));
  }
  return total;
}

function render(name, props) {
  var item = document.getElementById(name);
  item.querySelector(".item-quantity").innerHTML = props.quantity;
  item.querySelector(".item-price").innerHTML =
    "£" + parseFloat(props.price * props.quantity);
  document.getElementById("total-price").innerHTML = "£" + getTotal();
  if (props.quantity === 0) {
    document.getElementById(name).remove();
  }
  if (document.getElementsByClassName("cart-item-title")[0] === undefined) {
    document.getElementById("total-heading-col").style.opacity = "0";
    document.getElementById("total-price").innerHTML = "";
    document.getElementById("cart-is-empty").style.opacity = "1";
  }
}
