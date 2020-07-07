function moveToProfile(googleUser) {
  if(localStorage.getItem("userProfileData") === null) {
    var userProfileData = {userData : googleUser};
    localStorage.setItem("userProfileData", JSON.stringify(userProfileData));
  }
  window.location = "profile_page.html";
}

function onSuccess(googleUser) {
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
  document.getElementById("google-btn").replaceWith(document.getElementById("google-btn").cloneNode(true));
  document.getElementById("google-btn").addEventListener("click", function(){moveToProfile(googleUser)});
}
function onFailure(error) {
  console.log(error);
}
function renderButton() {
  gapi.signin2.render('google-btn', {
    'scope': 'profile',
    'width': 150,
    'height': 35,
    'longtitle': false,
    'theme': 'light',
    'onsuccess': onSuccess,
    'onfailure': onFailure
  });
}
