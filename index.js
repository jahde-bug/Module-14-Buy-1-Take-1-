// ==========================================
// Module 14: B1T1 Bundle Pricing Engine
// Procedural JavaScript. Arrays use array[index], for/while loops,
// if/else and console.log() only.
// ==========================================

// ------------------------------------------
// 1. Constants and state
// ------------------------------------------
var STD = 2100;      // standard price per shoe
var SINGLE = 1900;   // price of one leftover shoe
var BUNDLE = 3200;   // flat price for one B1T1 pair

// Categories that qualify for the B1T1 promo
var ELIGIBLE_CATEGORIES = ["Shoes"];
var ELIGIBLE_SIZE = 1;

// Cart: one category string per item, tracked with a manual counter
var cartCategory = [];
var cartCount = 0;

// B1T1 preset button state
var on = true;

// Start with 2 shoes in the cart
cartCategory[0] = "Shoes";
cartCategory[1] = "Shoes";
cartCount = 2;

// ------------------------------------------
// 2. Helper functions
// ------------------------------------------
function el(id) {
  return document.getElementById(id);
}

// Format a whole number as pesos, e.g. 3200 -> "₱3,200"
function formatPeso(n) {
  var sign = "";
  if (n < 0) {
    sign = "-";
    n = 0 - n;
  }
  var digits = "" + n;
  var len = digits.length;
  var out = "";
  for (var i = 0; i < len; i++) {
    out = out + digits[i];
    var left = len - 1 - i;
    if (left > 0 && left % 3 === 0) {
      out = out + ",";
    }
  }
  return sign + "₱" + out;
}

function isEligible(category) {
  for (var i = 0; i < ELIGIBLE_SIZE; i++) {
    if (ELIGIBLE_CATEGORIES[i] === category) {
      return true;
    }
  }
  return false;
}

// Step 1 of the process: count eligible items in the cart array
function countEligible() {
  var found = 0;
  for (var i = 0; i < cartCount; i++) {
    if (isEligible(cartCategory[i])) {
      found = found + 1;
    }
  }
  return found;
}

function stepItem(number, title, formula, value, note, active) {
  var classes = 'stp';
  if (active) {
    classes = classes + ' run';
  } else {
    classes = classes + ' wait';
  }

  return '<div class="' + classes + '">' +
    '<div class="hd"><span class="num">' + number + '</span> ' + title + '</div>' +
    '<div class="fm">' + formula + '</div>' +
    '<div class="val">' + value + '</div>' +
    '<div class="sb">' + note + '</div>' +
    '</div>';
}

function stepArrow() {
  return '<div class="arr">→</div>';
}

// ------------------------------------------
// 3. Cart actions
// ------------------------------------------
function addShoe() {
  cartCategory[cartCount] = "Shoes";
  cartCount = cartCount + 1;
}

function removeShoe() {
  if (cartCount > 0) {
    cartCount = cartCount - 1;
    cartCategory[cartCount] = "";
  }
}

// ------------------------------------------
// 4. Render
// ------------------------------------------
function render() {
  var count = countEligible();

  // Bundle pattern matching
  var remainingSingles = count % 2;
  var bundlePairs = (count - remainingSingles) / 2;
  var total = bundlePairs * BUNDLE + remainingSingles * SINGLE;
  var standard = count * STD;

  el("cnt").textContent = count;

  // Preset button state
  if (on) {
    el("b1t1").className = "preset on";
  } else {
    el("b1t1").className = "preset";
  }
  el("b1t1").setAttribute("aria-pressed", on);

  // Shoe tiles
  var singleTile =
    '<div class="tile"><div>Shoe<br><b>' + formatPeso(SINGLE) + '</b></div></div>';
  var g = "";

  if (on) {
    for (var p = 0; p < bundlePairs; p++) {
      g = g +
        '<div class="pair">' +
        '<div class="tag">B1T1 ' + formatPeso(BUNDLE) + '</div>' +
        '<div class="tile"><div>Shoe<br><b>Buy 1</b></div></div>' +
        '<div class="tile"><div>Shoe<br><b>Take 1</b></div></div>' +
        '</div>';
    }
    if (remainingSingles === 1) {
      g = g + singleTile;
    }
  } else {
    for (var s = 0; s < count; s++) {
      g = g + singleTile;
    }
  }

  if (g === "") {
    g = '<span style="color:var(--mute)">No shoes yet. Use + to add.</span>';
  }
  el("grid").innerHTML = g;

  // Process steps
  var steps = "";
  if (on) {
    steps =
      stepItem(1, "Eligible items", "countEligible()", count, "eligible shoes in cart", true) +
      stepArrow() +
      stepItem(2, "Pairs & singles", bundlePairs + " pairs = " + count + " ÷ 2; " + remainingSingles + " singles = " + count + " % 2", "Pairs: " + bundlePairs + " · Singles: " + remainingSingles, "bundle pattern match", true) +
      stepArrow() +
      stepItem(3, "Total price", "(" + bundlePairs + " × " + BUNDLE + ") + (" + remainingSingles + " × " + SINGLE + ")", formatPeso(total), "final bundle total", true);
  } else {
    steps =
      stepItem(1, "Eligible items", "countEligible()", count, "waiting for bundle mode", false) +
      stepArrow() +
      stepItem(2, "Pairs & singles", "bundle pattern disabled", "--", "B1T1 preset off", false) +
      stepArrow() +
      stepItem(3, "Total price", "individual pricing", formatPeso(count * SINGLE), "single-item pricing", false);
  }

  el("steps").innerHTML = '<div class="flow">' + steps + '</div>';

  var procText = "Bundle pattern matching: " + count + " eligible shoes -> " + bundlePairs + " pairs and " + remainingSingles + " leftover shoe(s).";
  el("proc").textContent = procText;

  // Output numbers
  var bundleApplied = false;
  if (on && bundlePairs > 0) {
    bundleApplied = true;
  }

  var shownTotal = count * SINGLE;
  if (on) {
    shownTotal = total;
  }
  var savings = 0;
  if (bundleApplied) {
    savings = standard - total;
  }

  el("std").textContent = formatPeso(standard);
  el("tot").textContent = formatPeso(shownTotal);
  el("sav").textContent = formatPeso(savings);

  // Output line
  var line = "";
  if (!on) {
    line = "B1T1 Bundle not selected. Shoes priced individually at " + formatPeso(SINGLE) + " each.";
  } else if (bundleApplied) {
    line =
      "[BUNDLE APPLIED] B1T1 Promo: " + count + " Shoes selected | Standard Price: " +
      formatPeso(standard) + " | B1T1 Bundle Price: " + formatPeso(total) +
      " | Savings: " + formatPeso(standard - total);
  } else {
    line = "Add at least 2 shoes to form a B1T1 bundle.";
  }
  el("out").textContent = line;
  console.log(line);
}

// ------------------------------------------
// 5. Events and first render
// ------------------------------------------
el("inc").onclick = function () {
  addShoe();
  render();
};

el("dec").onclick = function () {
  removeShoe();
  render();
};

el("b1t1").onclick = function () {
  if (on) {
    on = false;
  } else {
    on = true;
  }
  render();
};

render();
