emailjs.init("oMh6h2Ca2O8LCjM0L"); // initializing emailjs for checkout

function fitTextToCard() {
  const cardTitles = document.querySelectorAll(".restaurant-card h3");

  cardTitles.forEach((title) => {
    let fontSize = parseInt(window.getComputedStyle(title).fontSize); // starting font size
    const maxWidth = title.parentElement.clientWidth - 20; // small padding buffer

    // Shrink font until it fits
    while (title.scrollWidth > maxWidth && fontSize > 12) {
      fontSize -= 1;
      title.style.fontSize = fontSize + "px";
    }
  });
}

// Run on page load
window.addEventListener("load", fitTextToCard);

// Optional: run on window resize to stay responsive
window.addEventListener("resize", fitTextToCard);

// ===== Sidebar Toggle =====
const cartLink = document.getElementById("cart-link");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const closeCartBtn = document.getElementById("close-cart");

cartLink.addEventListener("click", (e) => {
  e.preventDefault();
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("active");
});

closeCartBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
});

cartOverlay.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("active");
});

// ===== Cart Logic =====
const addToCartButtons = document.querySelectorAll(".order-btn");
const cartContent = document.querySelector(".cart-content");
const cartTotalAmount = document.querySelector(".cart-total-amount");

let cart = []; // stores items as an array of names
let cartCount = 0;
const cartBadge = document.getElementById("cart-count");

// Update cart display and badge
function updateCart() {
  cartContent.innerHTML = "";

  cart.forEach((itemName, index) => {
    const row = document.createElement("div");
    row.classList.add("cart-row");
    row.style.display = "flex";
    row.style.justifyContent = "space-between";
    row.style.alignItems = "center";
    row.style.marginBottom = "1rem";

    // add ❌ button
    row.innerHTML = `
      <span>${itemName}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <span>1 boop</span>
        <button class="remove-btn" data-index="${index}" style="
          background:none;
          border:none;
          color:red;
          font-size:1rem;
          cursor:pointer;
        ">❌</button>
      </div>
    `;

    cartContent.appendChild(row);
  });

  // Update total
  cartTotalAmount.textContent = `${cart.length} boop${
    cart.length !== 1 ? "s" : ""
  }`;

  // Update badge
  cartCount = cart.length;
  if (cartCount > 0) {
    cartBadge.textContent = cartCount;
    cartBadge.style.visibility = "visible";
  } else {
    cartBadge.style.visibility = "hidden";
  }

  // attach event listeners to all remove buttons
  const removeButtons = cartContent.querySelectorAll(".remove-btn");
  removeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      cart.splice(index, 1); // remove that item
      updateCart(); // refresh cart
    });
  });
}

// Handle Add to Cart button
addToCartButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const menuItem = btn.closest(".menu-item");
    const itemName = menuItem.querySelector(".menu-item-name").textContent;

    cart.push(itemName);
    updateCart();
  });
});

// Initialize cart
updateCart();

const checkoutBtn = document.getElementById("checkout-btn");
const orderNotes = document.getElementById("order-notes");

// Handle checkout click
checkoutBtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  // Collect data
  const restaurantName =
    document.querySelector(".header-restaurant .restaurant-name")
      ?.textContent || "Unknown Restaurant";

  const cartDetails = cart.map((itemName) => `1x ${itemName}`).join("\n");
  const total = `${cart.length} boop${cart.length !== 1 ? "s" : ""}`;
  const notesText = orderNotes.value || "None";

  emailjs
    .send("service_k4iheu8", "template_cwyrl8j", {
      restaurant_name: restaurantName,
      items: cartDetails,
      notes: notesText,
      total: total,
      email: "aaronsanchez2000@yahoo.com",
    })
    .then(() => {
      console.log("Email sent successfully!");

      const orderMessage = document.createElement("div");
      orderMessage.textContent = "Order submitted!";
      orderMessage.style.fontWeight = "600";
      orderMessage.style.textAlign = "center";
      orderMessage.style.fontSize = "2rem";
      orderMessage.style.marginTop = "0.5rem";
      orderMessage.style.marginBottom = "0.5rem";
      orderMessage.style.color = "var(--color-secondary)";

      checkoutBtn.replaceWith(orderMessage);

      cart = [];
      updateCart();
      orderNotes.value = "";

      // Page refresh after 5 seconds
      setTimeout(() => {
        location.reload();
      }, 5000);
    })

    .catch((err) => {
      console.error("Email failed:", err);
      alert("Failed to submit order. Please try again.");
    });
});
