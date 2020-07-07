const delay = (ms) => new Promise((res) => setTimeout(res, ms));

window.onload = async function() {
  gapi.load('auth2', function(){
      auth2 = gapi.auth2.init({
          client_id: '156164805906-2ask5uccvq8elrrc4ktqbl6chg54t35h.apps.googleusercontent.com'
      });
  });
  await delay(500);
  var forename = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName();
  document.getElementById("user-forename").innerText = forename;
}

function profileLogout() {
  gapi.auth2.getAuthInstance().signOut()
  gapi.auth2.getAuthInstance().disconnect()
  window.location = "basket.html";
}

function renderReferForm() {
  if(document.getElementById("referForm") === null) {
  document.getElementById("profile-main-container").style.gridTemplateRows = "70px 150px";
  var referFriendHeading = `<div id="refer-friend-heading"><h2>Refer a friend</h2></div>`;
  if(document.getElementById("profile-welcome") !== null) {
    document.getElementById("profile-welcome").remove();
  }
  if(document.getElementById("discount-codes-heading") !== null) {
    document.getElementById("discount-codes-heading").remove();
    document.getElementById("discount-codes-container").remove();
  }
  document
    .getElementById("profile-main-container")
    .insertAdjacentHTML("afterbegin", referFriendHeading);
  var form = `<div id="referForm">
                <form onsubmit="event.preventDefault(); validateMyForm();">
                  <label id="friend-label" for="friend-value">Friend's name</label>
                  <input type="text" id="friend-value" name="friend-value" placeholder="">
                  <input id="referFormSubmit" type="submit" value="Submit">
                </form>
              </div>`;
  document
    .getElementById("refer-friend-heading")
    .insertAdjacentHTML("afterend", form);
  }
}

function renderDiscountCodes() {
  if(document.getElementById("discount-codes-container") === null) {
    if(document.getElementById("profile-welcome") !== null) {
      document.getElementById("profile-welcome").remove();
    }
    if(document.getElementById("refer-friend-heading") !== null) {
      document.getElementById("refer-friend-heading").remove();
      document.getElementById("referForm").remove();
    }
  document.getElementById("profile-main-container").style.gridTemplateRows = "70px 150px";
  var discountCodesContent = `<div id="discount-codes-heading"><h2>Your Discount Codes</h2></div>
  <div id="discount-codes-container"></div>`
  document
    .getElementById("profile-main-container")
    .insertAdjacentHTML("afterbegin", discountCodesContent);
  }
}
