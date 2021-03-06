let fileName = window.location.pathname
  .split("/")
  .filter(function (c) {
    return c.length;
  })
  .pop();

var imgs = [
  "google-pixel-4.jpg",
  "huawei-p30-pro.jpg",
  "iphonex-spacegray.jpeg",
  "oneplus.jpeg",
  "oppo-find-x2-neo-5g.jpg",
  "samsung-galaxy-s10.jpeg",
  "tcl-10-pro.jpg",
  "motorola-edge.jpg",
  "lg-v50-thinq.jpg",
  "honor-20-pro.jpg",
  "sony-xperia-5.jpeg",
  "asus-rog-zs600kl.jpg",
  "nokia-9-pureview.jpg",
  "xiamoi-mi-10.jpg",
];

var prices = [
  559.0,
  659.0,
  779.0,
  500.0,
  599.0,
  660.0,
  399.0,
  529.0,
  589.0,
  399.0,
  499.0,
  450.0,
  600.0,
  400.0,
];

var titles = [
  "Google Pixel 4",
  "Huawei P30 Pro",
  "iPhone X",
  "Oneplus 6",
  "Oppo Find X2 Neo",
  "Samsung Galaxy S10",
  "TCL 10 Pro",
  "Motorola Edge",
  "LG V50 ThinQ",
  "Honor 20 Pro",
  "Sony Xperia 5",
  "Asus ROG ZS600KL",
  "Nokia 9 Pureview",
  "Xiamoi Mi 10",
];

if (localStorage.getItem("shopData") === null) {
  var items = [];
  for (var i = 0; i < imgs.length; i++) {
    items = [
      ...items,
      { "title": titles[i], "price": prices[i], "quantity": 0, "img": imgs[i] },
    ];
  }
  var shopData = { "shopItems": items, "promoCode": ""};
  localStorage.setItem("shopData", JSON.stringify(shopData));
}

function addItem(i) {
  if(Object.values(JSON.parse(localStorage.getItem("shopData")))[0][i].quantity === 0) {
  var x = JSON.parse(localStorage.getItem("shopData"))
  var y = Object.values(x)
  y[0][i].quantity++
  Object.assign(x, y)
  localStorage.setItem("shopData", JSON.stringify(x))
} else {
  console.log(Object.values(JSON.parse(localStorage.getItem("shopData")))[0][i].title+" is already in basket!");
}
}

if (fileName === "grid-template.html") {
  window.onload = function () {
    for (var i = 0; i < imgs.length; i++) {
      var html = `<div class="item">
            <div class="img"><img style="width: 100%; height: 100%;" src="img/${imgs[i]}"/></div>
            <div class="title" style="background-color: #f6f6f6;"><h4>${titles[i]}</h4></div>
            <div class="price" style="background-color: #f6f6f6;"><h5>£${prices[i]}</h5></div>
            <div class="button" style="background-color: #f6f6f6;"><button onclick="addItem(${i})">Add to Basket</button></div>
          </div>`;
      document
        .getElementsByClassName("container")[0]
        .insertAdjacentHTML("beforeend", html);
    }
    var grid = document.getElementsByClassName("container")[0];
    var gridComputedStyle = window.getComputedStyle(grid);
    var gridRowCount = gridComputedStyle
      .getPropertyValue("grid-template-rows")
      .split(" ").length;
    var gridColumnCount = gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ").length;
    var gridCells = grid.childNodes.length;
    renderGridBorder(gridColumnCount, gridCells);

    window.addEventListener("resize", function (event) {
      gridComputedStyle = window.getComputedStyle(grid);
      gridRowCount = gridComputedStyle
        .getPropertyValue("grid-template-rows")
        .split(" ").length;
      gridColumnCount = gridComputedStyle
        .getPropertyValue("grid-template-columns")
        .split(" ").length;
      gridCells = grid.childNodes.length;
      renderGridBorder(gridColumnCount, gridCells);
    });
  };

  function renderGridBorder(gridColumnCount, gridCells) {
    var item = document.getElementsByClassName("item");
    //first row
    for (var i = 0; i < gridColumnCount; i++) {
      item[i].style.borderTop = "1px solid #737373";
      item[i].style.borderRight = "1px solid #737373";
      item[i].style.borderLeft = "1px solid #737373";
    }
    //last row
    for (var i = gridCells - 1; i > gridCells - gridColumnCount - 1; i--) {
      item[i].style.borderTop = "1px solid #737373";
      item[i].style.borderRight = "1px solid #737373";
      item[i].style.borderBottom = "1px solid #737373";
      item[i].style.borderLeft = "1px solid #737373";
    }
    //rest of rows
    for (var i = gridColumnCount; i <= gridCells - gridColumnCount; i++) {
      item[i].style.borderTop = "1px solid #737373";
      item[i].style.borderRight = "1px solid #737373";
      item[i].style.borderLeft = "1px solid #737373";
    }
    //last cells in each row
    for (
      var i = gridColumnCount - 1;
      i < gridCells /*&& i + gridColumnCount < gridCells*/;
      i += gridColumnCount
    ) {
      item[i].getElementsByClassName("img")[0].style.borderRight =
        "1px solid #737373";
      item[i].getElementsByClassName("title")[0].style.borderRight =
        "1px solid #737373";
      item[i].getElementsByClassName("price")[0].style.borderRight =
        "1px solid #737373";
      item[i].getElementsByClassName("button")[0].style.borderRight =
        "1px solid #737373";
    }

    item[gridCells - 1].getElementsByClassName("img")[0].style.borderRight =
      "1px solid #737373";
    item[gridCells - 1].getElementsByClassName("title")[0].style.borderRight =
      "1px solid #737373";
    item[gridCells - 1].getElementsByClassName("price")[0].style.borderRight =
      "1px solid #737373";
    item[gridCells - 1].getElementsByClassName("button")[0].style.borderRight =
      "1px solid #737373";
  }
} else if (fileName === "basket.html") {
  window.onload = function () {
    var items = Object.values(JSON.parse(localStorage.getItem("shopData")))[0];
    var empty = true;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if(item.quantity > 0) {
        empty = false;
      var html = `<div class="basket-item">
            <div class="item-img"><img style="width: 100%; height: 100%;" src="img/${item.img}"/></div>
            <div class="item-title"><h4>${item.title}</h4></div>
            <div class="item-price"><h5>£${item.price*item.quantity}</h5></div>
            <div class="item-quantity"><h5 class="quantity-text">Quantity</h5><h5 class="quantity-value">${item.quantity}</h5><button class="drop-dwn" onclick="dropDwn(this)"><i class="fas fa-angle-down"></i></button></div>
          </div>`;
      document
        .getElementsByClassName("basket-container")[0]
        .insertAdjacentHTML("beforeend", html);
      }
    }
    if(!empty){
      renderSummary();
    } else {
      emptyBasket();
    }
  };
  function emptyBasket() {
    var html = `<div id="empty-basket"><h2>Your basket is empty.</h2></div>`;
    document
      .getElementsByClassName("basket-container")[0]
      .insertAdjacentHTML("afterend", html);
  }
  var dropDownId = -1;

  // Close the dropdown if the user clicks outside of it
  window.onclick = function (event) {
    if (!event.target.matches(".fa-angle-down")) {
      try {
        document.getElementsByClassName("drop-dwn-content")[0].remove();
      } catch {
        console.log("drop down was already removed!");
      }
    }
  };

  function getIndexOfItem(name) {
    var x = JSON.parse(localStorage.getItem("shopData"))
    var y = Object.values(x)
    var z = y[0];
    for(var i = 0; i < z.length; i++) {
      if(z[i].title === name) {
        return i;
      }
    }
    return -1;
  }

  function dropDwn(item) {
    var dwn = document.getElementsByClassName("drop-dwn");
    dwn = [].slice.call(dwn);
    var index = dwn.indexOf(item);
    dropDownId = index;
    if (document.getElementsByClassName("drop-dwn-content")[0] === undefined) {
      var html = `  <div class="drop-dwn-content">
    <button class="quantity-btn" onclick="setQuantity(0, ${index})">0</button>
    <button class="quantity-btn" onclick="setQuantity(1, ${index})">1</button>
    <button class="quantity-btn" onclick="setQuantity(2, ${index})">2</button>
    <button class="quantity-btn" onclick="setQuantity(3, ${index})">3</button>
  </div>`;
      document
        .getElementsByClassName("drop-dwn")
        [index].insertAdjacentHTML("afterend", html);
    } else {
      document.getElementsByClassName("drop-dwn-content")[0].remove();
    }
  }

  function setQuantity(i, index) {
    var name = document.getElementsByClassName('item-title')[index].children[0].innerHTML;
    var itemIndex = getIndexOfItem(name);
    var x = JSON.parse(localStorage.getItem("shopData"))
    var y = Object.values(x)
    y[0][itemIndex].quantity = i;
    Object.assign(x, y)
    localStorage.setItem("shopData", JSON.stringify(x))
    if(i > 0) {
      document.getElementsByClassName("quantity-value")[index].innerHTML = i;
      document.getElementsByClassName("item-price")[index].children[0].innerHTML =
      "£"+i*Object.values(JSON.parse(localStorage.getItem("shopData")))[0][itemIndex].price;
      document.getElementById('subtotal-value').children[0].innerHTML = " ";
      document.getElementById('total-value').children[0].innerHTML = " ";
    } else {
      document.getElementsByClassName("basket-item")[index].remove();
    }
    if(document.getElementsByClassName("basket-item").length > 0) {
      renderSummary();
    } else {
      document.getElementById("summary-container").innerHTML = "";
      emptyBasket();
    }
  }

  function renderButtons() {
    paypal.Buttons({
      style: {
        size: 'responsive'
      },
      createOrder: function(data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: `${getSubtotal()}`
            }
          }]
        });
      },
      onApprove: function(data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function(details) {
          // This function shows a transaction success message to your buyer.
          alert('Transaction completed by ' + details.payer.name.given_name);
        });
      }
    }).render('#paypal-button-container');
    //This function displays Smart Payment Buttons on your web page.
  }

  function renderSummary() {
    if(document.getElementById('summary-title') === null) {
    var html = `<div id="summary-title"><h1>Summary</h1></div>
  <div id="promo-code-text"><h5>Do you have a Promo Code?</h5><button onclick="promoDropDwn()"><i class="fas fa-angle-down"></i></button></div>
          <div id="promo-drop-dwn"></div>
          <div id="subtotal-text"><h5>Subtotal</h5></div>
          <div id="subtotal-value"><h5></h5></div>
          <div id="total-text"><h4>Total</h4></div>
          <div id="total-value"><h4></h4></div>
          <div id="paypal-button-container"></div>
        </div>`;
    document
      .getElementById("summary-container")
      .insertAdjacentHTML("beforeend", html);
    }
    document.getElementById('subtotal-value').children[0].innerHTML = "£"+getSubtotal();
    document.getElementById('total-value').children[0].innerHTML = "£"+getTotal();
    if(document.getElementById('paypal-button-container').innerHTML === "") {
      renderButtons();
    }
  }

  function validateMyForm() {
    var code = document.getElementById('promo-code-value').value;
    //TODO: implement promo code getter
    if(code === "PROMO") {
      var x = JSON.parse(localStorage.getItem("shopData"))
      var y = Object.values(x)
      y[1] = code;
      Object.assign(x, y)
      localStorage.setItem("shopData", JSON.stringify(x))
    }
    renderSummary();
    removePromoDropDwn();
  }

  function promoDropDwn() {
    var promo = document.getElementById('promo-drop-dwn');
    if(promo.style.display === "" || promo.style.display === "none") {
      promo.style.display = "block";
      if(window.innerWidth < 600) {
        document.getElementById('summary-container').style.gridTemplateRows = "70px 20px 40px 20px 40px 140px";
      } else if (window.innerWidth > 600 && window.screen.width < 1025) {
        document.getElementById('summary-container').style.gridTemplateRows = "70px 30px 60px 30px 40px 140px";
      } else if (window.innerWidth > 1024) {
        document.getElementById('summary-container').style.gridTemplateRows = "70px 35px 80px 35px 40px 140px";
      }
      var html = `<form onsubmit="event.preventDefault(); validateMyForm();">
                     <input type="text" id="promo-code-value" name="promocode-value" placeholder="">
                     <input id="promo-code-submit" type="submit" value="Submit">
                  </form>`;
      document
        .getElementById("promo-drop-dwn")
        .insertAdjacentHTML("beforeend", html);
    } else {
      removePromoDropDwn();
    }
  }

  function removePromoDropDwn() {
    var promo = document.getElementById('promo-drop-dwn');
    document
      .getElementById("promo-drop-dwn").innerHTML = "";
    promo.style.display = "none";
    if(window.screen.width < 600) {
      document.getElementById('summary-container').style.gridTemplateRows = "70px 20px 0 20px 40px 140px";
    } else if (window.screen.width > 600 && window.screen.width < 1025) {
      document.getElementById('summary-container').style.gridTemplateRows = "70px 30px 0 30px 40px 140px";
    } else if (window.screen.width > 1024) {
      document.getElementById('summary-container').style.gridTemplateRows = "70px 35px 0 35px 40px 140px";
    }
  }

  function getSubtotal() {
    var subtotal = 0;
    var prices = document.getElementsByClassName('item-price');
    for(var i = 0; i < prices.length; i++) {
      subtotal += parseInt(document.getElementsByClassName('item-price')[i].children[0].innerHTML.substr(1))
    }
    return subtotal;
  }

  function getTotal() {
    if(Object.values(JSON.parse(localStorage.getItem("shopData")))[1] === "PROMO") {
      return 0.75*getSubtotal();
    }
    return getSubtotal();
  }
}
