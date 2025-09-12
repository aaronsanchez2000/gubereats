// ======= Restaurant Data =======
const restaurants = [
  {
    name: "Tacotarian",
    items: [
      {
        name: "Carne Asada Fries",
        price: "$10.99",
        description: "Fries topped with carne asada, cheese, and guacamole",
        image: "images/carne-asada-fries.jpg",
      },
      {
        name: "Tacos",
        price: "$3.50 each",
        description: "Choice of carne asada, chicken, or veggie",
        image: "images/tacos.jpg",
      },
      {
        name: "Bean Burrito",
        price: "$7.99",
        description: "Flour tortilla with refried beans, cheese, and salsa",
        image: "images/bean-burrito.jpg",
      },
    ],
  },
  {
    name: "Garden Grill",
    items: [
      {
        name: "Chicken Tenders",
        price: "$8.99",
        description: "Crispy tenders served with your choice of sauce",
        image: "images/chicken-tenders.jpg",
      },
      {
        name: "Quesadilla",
        price: "$6.50",
        description: "Cheese quesadilla with optional chicken or veggies",
        image: "images/quesadilla.jpg",
      },
      {
        name: "Caesar Salad",
        price: "$7.50",
        description: "Romaine lettuce, parmesan, croutons, and Caesar dressing",
        image: "images/caesar-salad.jpg",
      },
    ],
  },
  {
    name: "Prone to Plants",
    items: [
      {
        name: "Chicken Wings",
        price: "$9.99",
        description: "10 wings tossed in your choice of sauce",
        image: "images/chicken-wings.jpg",
      },
      {
        name: "Chicken Sandwich",
        price: "$8.50",
        description:
          "Grilled or crispy chicken sandwich with lettuce and tomato",
        image: "images/chicken-sandwich.jpg",
      },
      {
        name: "Fries",
        price: "$3.99",
        description: "Crispy golden fries with optional seasoning",
        image: "images/fries.jpg",
      },
    ],
  },
];

document.addEventListener("DOMContentLoaded", () => {
  // ===== Sidebar Toggle =====
  const sidebar = document.getElementById("sidebar");
  const hamburger = document.getElementById("menu-icon");

  if (sidebar && hamburger) {
    hamburger.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  // ===== Restaurant List (for index.html) =====
  const restaurantList = document.getElementById("restaurant-list");
  if (restaurantList) {
    restaurants.forEach((rest) => {
      const li = document.createElement("li");
      li.textContent = rest.name;

      li.addEventListener("click", () => {
        const fileName = rest.name.toLowerCase().replace(/\s+/g, "") + ".html";
        window.location.href = fileName;
      });

      restaurantList.appendChild(li);
    });
  }
});

// ======= Restaurant Page + Modal Logic =======
const restaurantNameEl = document.getElementById("restaurant-name");
const menuItemsEl = document.getElementById("menu-items");
const modal = document.getElementById("item-modal");
const modalImage = document.getElementById("modal-image");
const modalTitle = document.getElementById("modal-title");
const modalDescription = document.getElementById("modal-description");
const modalPrice = document.getElementById("modal-price");
const closeModalBtn = document.getElementById("close-modal");

if (restaurantNameEl && menuItemsEl) {
  // Determine which restaurant based on HTML file name
  const fileName = window.location.pathname.split("/").pop(); // e.g., tacotarian.html
  const restaurant = restaurants.find(
    (r) => r.name.toLowerCase().replace(/\s+/g, "") + ".html" === fileName
  );

  if (!restaurant) return; // fallback if no match

  restaurantNameEl.textContent = restaurant.name;

  // Populate menu grid
  restaurant.items.forEach((item) => {
    const card = document.createElement("div");
    card.className = "menu-item";

    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3>
      <p class="description">${item.description}</p>
      <p class="price">${item.price}</p>
      <button class="order-btn">See Details</button>
    `;

    // Show modal with item details
    card.querySelector(".order-btn").addEventListener("click", () => {
      modalImage.src = item.image;
      modalImage.alt = item.name;
      modalTitle.textContent = item.name;
      modalDescription.textContent =
        "Here you can select meat, quantity, etc. (placeholder)";
      modalPrice.textContent = item.price;
      modal.showModal();
    });

    menuItemsEl.appendChild(card);
  });

  // Close modal button
  closeModalBtn.addEventListener("click", () => {
    modal.close();
  });
}
