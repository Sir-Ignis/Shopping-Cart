var shortDescriptions = [
  "A single page responsive website design, ideal for one page websites.",
  "A multiple page responsive website design, custom coded and ready to use.",
  "A professional responsive website design, custom coded and ready to use."];
  var descriptions = [
    "A single page responsive website design, ideal for one page websites." +
      " Custom coded to meet your specifications and ready to use." +
      " Includes hosting setup.",
    "A multiple page responsive website design, custom coded and ready to use."+
      " Includes everything from the Starter Tier plus" +
      " multimedia, webforms and a sitemap.",
    "A professional responsive website design, custom coded and ready to use." +
      " Includes everything from the Hobby Tier plus" +
      " a shopping cart, comments, security and SEO."
  ];

var LENGTH = 3;

if (localStorage.getItem("shopData") === null) {
  var names = ["Starter Website", "Hobby Website", "Business Website"];
  var addonNames = [[["Multimedia",0], ["Webforms",0], ["Comments",0], ["Security",0], ["SEO",0]],
                    [["Shopping Cart",0], ["SEO",0], ["Comments",0], ["Security",0]],
                    [["Advertising",0]]];
  var addonPrices = [[10.00, 20.00, 10.00, 40.00, 100.00],
                     [20.00, 100.00, 10.00, 40.00],
                     [200.00]]
  var prices = [20.0, 40.0, 100.0];

  var items = [];
  if(window.screen.width > 414) {
  for (var i = 0; i < names.length; i++) {
    items = [
      ...items,
      {
        "name": names[i],
        "description": descriptions[i],
        "price": prices[i],
        "quantity": 0,
        "addonNames": addonNames[i],
        "addonPrices": addonPrices[i]
      },
    ];
  }
  } else {
    for (var i = 0; i < names.length; i++) {
      items = [
        ...items,
        {
          "name": names[i],
          "description": shortDescriptions[i],
          "price": prices[i],
          "quantity": 0,
          "addonNames": addonNames[i],
          "addonPrices": addonPrices[i]
        },
      ];
    }
  }
  var shopData = { shopItems: items, totalPrice: 0, payerName: "", orderId: "", code: ""};
  localStorage.setItem("shopData", JSON.stringify(shopData));
} else {
  changeDescriptions();
}

function changeDescriptions() {
    var x = JSON.parse(localStorage.getItem("shopData"));
    var y = Object.values(x);
    var items = y;
    if(window.screen.width > 414) {
    for (var i = 0; i < LENGTH; i++) {
      items[0][i].description = descriptions[i]
    }
    } else {
      for (var i = 0; i < LENGTH; i++) {
        items[0][i].description = shortDescriptions[i]
      }
    }
  y = items;
  x = y;
  localStorage.setItem("shopData", JSON.stringify(x));
}

var width = window.screen.width;

window.onresize = function() {
  if(width <= 414 && window.screen.width > 414 ||
    width > 414 && window.screen.width <= 414) {
    console.log("called!");
    changeDescriptions();
    document.getElementById("basket-container").innerHTML = null;
    renderBasket();
    width = window.screen.width;
  }
}

function addItem(i) {
  if (
    Object.values(JSON.parse(localStorage.getItem("shopData")))[0][i]
      .quantity === 0
  ) {
    var x = JSON.parse(localStorage.getItem("shopData"));
    var y = Object.values(x);
    y[0][i].quantity++;
    y[1] += y[0][i].price;
    x = y;//Object.assign(x, y);
    localStorage.setItem("shopData", JSON.stringify(x));
  }
}

function setItemQuantity(i, quantity) {
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][i].quantity = quantity;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}
