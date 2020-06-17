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

window.onload = function () {
  for (var i = 0; i < imgs.length; i++) {
    var html = `<div class="item">
            <div class="img"><img style="width: 100%; height: 100%;" src="img/${imgs[i]}"/></div>
            <div class="title" style="background-color: #f6f6f6;"><h4>${titles[i]}</h4></div>
            <div class="price" style="background-color: #f6f6f6;"><h5>£${prices[i]}</h5></div>
            <div class="button" style="background-color: #f6f6f6;"><button>Add to Basket</button></div>
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
  console.log(gridRowCount, gridColumnCount);
  renderGridBorder(gridColumnCount, gridRowCount, gridCells);

  window.addEventListener("resize", function (event) {
    gridComputedStyle = window.getComputedStyle(grid);
    gridRowCount = gridComputedStyle
      .getPropertyValue("grid-template-rows")
      .split(" ").length;
    gridColumnCount = gridComputedStyle
      .getPropertyValue("grid-template-columns")
      .split(" ").length;
    gridCells = grid.childNodes.length;
    console.log("cells: " + gridCells);
    console.log(gridRowCount, gridColumnCount);
    renderGridBorder(gridColumnCount, gridRowCount, gridCells);
  });
};

function renderGridBorder(gridColumnCount, gridRowCount, gridCells) {
  console.log(gridColumnCount);
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
  //correct border if last row not full
  //if (gridCells % gridColumnCount != 0) {
  item[gridCells - 1].getElementsByClassName("img")[0].style.borderRight =
    "1px solid #737373";
  item[gridCells - 1].getElementsByClassName("title")[0].style.borderRight =
    "1px solid #737373";
  item[gridCells - 1].getElementsByClassName("price")[0].style.borderRight =
    "1px solid #737373";
  item[gridCells - 1].getElementsByClassName("button")[0].style.borderRight =
    "1px solid #737373";
  //}
}
