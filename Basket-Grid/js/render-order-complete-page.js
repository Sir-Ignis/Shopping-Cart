window.onload = function () {
  renderOrderDetails();
};

function renderOrderDetails() {
  var x = JSON.parse(localStorage.getItem("shopData"));
  var y = Object.values(x);
  document.getElementById('buyerName').innerText = y[2];
  document.getElementById('orderId').innerText += y[3];
  cleanUpLocalStorage();
}

function cleanUpLocalStorage() {
  localStorage.removeItem("shopData");
  localStorage.removeItem("__paypal_storage__");
}
