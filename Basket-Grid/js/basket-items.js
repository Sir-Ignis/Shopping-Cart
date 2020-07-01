if (localStorage.getItem("shopData") === null) {
  var names = ["Starter Website", "Hobby Website", "Business Website"];
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
  var addonNames = [[["Multimedia",0], ["Webforms",0], ["Comments",0], ["Security",0], ["SEO",0]],
                    [["Shopping Cart",0], ["SEO",0], ["Comments",0], ["Security",0]],
                    [["Advertising",0]]];
  var addonPrices = [[10.00, 20.00, 10.00, 40.00, 100.00],
                     [20.00, 100.00, 10.00, 40.00],
                     [200.00]]
  var prices = [20.0, 40.0, 100.0];

  var items = [];
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
  var shopData = { shopItems: items, totalPrice: 0};
  localStorage.setItem("shopData", JSON.stringify(shopData));
}

function addItem(i) {
  if (
    Object.values(JSON.parse(localStorage.getItem("shopData")))[0][i]
      .quantity === 0
  ) {
    var x = JSON.parse(localStorage.getItem("shopData"));
    var y = Object.values(x);
    y[0][i].quantity++;
    Object.assign(x, y);
    localStorage.setItem("shopData", JSON.stringify(x));
  } /*else {
    console.log(
      Object.values(JSON.parse(localStorage.getItem("shopData")))[0][i].title +
        " is already in basket!"
    );
  }*/
}

function setItemQuantity(i, quantity) {
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  y[0][i].quantity = quantity;
  Object.assign(x, y);
  localStorage.setItem("shopData", JSON.stringify(x));
}
