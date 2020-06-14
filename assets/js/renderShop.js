let shopDisplayedItems = null;
try {
  Object.entries(Cookies.get())[1][0];
  //shopDisplayedItems = Object.entries(JSON.parse(shopReq.response))[0][1];
  if (fileName === "index.html" || fileName === undefined) {
    renderCart();
  }
} catch (err) {
  console.log(err);
  console.log("making another request");
  let shopReq = new XMLHttpRequest();
  shopReq.open(
    "GET",
    "https://api.jsonbin.io/b/5ee569560e966a7aa368db34/6",
    true
  );
  shopReq.send();
  shopReq.onreadystatechange = () => {
    if (shopReq.readyState == XMLHttpRequest.DONE) {
      shopReqDone = true;
      console.log("shop request done: " + shopReqDone);
      shopDisplayedItems = Object.entries(JSON.parse(shopReq.response))[0][1];
      for (var i = 0; i < shopDisplayedItems.length; i++) {
        Cookies.set("item" + i, JSON.stringify(shopDisplayedItems[i]));
      }
      renderCart();
    }
  };
}

function renderCart() {
  var o = Cookies.get();
  var sortedCookies = Object.keys(o)
    .sort()
    .reduce((r, k) => ((r[k] = o[k]), r), {});
  for (var i = 0; i < Reflect.ownKeys(sortedCookies).length; i++) {
    var cookie = Object.entries(sortedCookies)[i];
    renderShopItem(cookie, i);
  }
}

function itemOnPage(cookie) {
  var shopItems = document.getElementsByClassName("shop-item-col");
  for (var i = 0; i < shopItems.length; i++) {
    if (shopItems[i].id === document.getElementsByClassName(cookie[0])) {
      return true;
    }
  }
  return false;
}

function renderShopItem(cookie, i) {
  var shopItemData = JSON.parse(cookie[1]);
  document.getElementsByClassName("shop-item-col")[i].id = cookie[0];
  document.getElementsByClassName("shop-item-img")[i].src =
    "assets/img/" + shopItemData.image;
  document.getElementsByClassName("shop-item-price")[i].innerHTML =
    "£" + shopItemData.price;
  document.getElementsByClassName("shop-item-name")[i].innerHTML =
    shopItemData.name;
  document.getElementsByClassName("shop-item-description")[i].innerHTML =
    shopItemData.description;
  document.getElementsByClassName("shop-add-item-btn")[
    i
  ].onclick = function () {
    shopItemData.quantity += 1;
    try {
      Cookies.set(cookie[0], JSON.stringify(shopItemData));
    } catch (err) {
      console.log(err);
    }
  };
}
