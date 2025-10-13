const restaurants = [
  {
    name: "Bronze Cafe",
    img: "restaurant-logos/bronzecafe-logo.jpg",
    link: "bronzecafe.html",
    tags: ["sammich", "drinkies", "unique", "handheld", "utensils"],
    flavor: ["savory", "sweet"],
  },
  {
    name: "Burger King",
    img: "restaurant-logos/burgerking-logo.png",
    link: "burgerking.html",
    tags: ["borg", "classic", "handheld"],
    flavor: ["savory"],
  },
  {
    name: "Chef Kenny's",
    img: "restaurant-logos/chefkennys-logo.webp",
    link: "chefkennys.html",
    tags: ["asian", "chikky", "unique", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Cinnaholic",
    img: "restaurant-logos/cinnaholic-logo.webp",
    link: "cinnaholic.html",
    tags: ["sweets", "unique", "utensils"],
    flavor: ["sweet"],
  },
  {
    name: "Garden Grill",
    img: "restaurant-logos/gardengrill-logo2.jpg",
    link: "gardengrill.html",
    tags: ["savory", "chikky", "unique", "handheld", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Ike's",
    img: "restaurant-logos/ikes-logo.svg",
    link: "ikes.html",
    tags: ["sammich", "unique", "handheld"],
    flavor: ["savory"],
  },
  {
    name: "Peinto Thai",
    img: "restaurant-logos/peinto-logo3.png",
    link: "peinto.html",
    tags: ["asian", "spicy", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Plant Power",
    img: "restaurant-logos/plantpower-logo.avif",
    link: "plantpower.html",
    tags: ["borg", "chikky", "unique", "handheld", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Prone to Plants",
    img: "restaurant-logos/pronetoplants-logo2.png",
    link: "pronetoplants.html",
    tags: ["savory", "chikky", "unique", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Shinjuku Ramen",
    img: "restaurant-logos/shinjuku-logo.webp",
    link: "shinjuku.html",
    tags: ["asian", "spicy", "utensils"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Smash Me Baby",
    img: "restaurant-logos/smashmebaby-logo.webp",
    link: "smashmebaby.html",
    tags: ["borg", "unique", "handheld"],
    flavor: ["savory"],
  },
  {
    name: "Sonic",
    img: "restaurant-logos/sonic-logo.png",
    link: "sonic.html",
    tags: ["drinkies", "classic", "handheld"],
    flavor: ["savory", "sweet"],
  },
  {
    name: "Subway",
    img: "restaurant-logos/subway-logo2.png",
    link: "subway.html",
    tags: ["sammich", "classic", "handheld"],
    flavor: ["savory"],
  },
  {
    name: "Taco Bell",
    img: "restaurant-logos/tacobell-logo3.png",
    link: "tacobell.html",
    tags: ["tacos", "classic", "handheld"],
    flavor: ["savory", "spicy"],
  },
  {
    name: "Tacotarian",
    img: "restaurant-logos/tacotarian-logo2.jpg",
    link: "tacotarian.html",
    tags: ["tacos", "unique"],
    flavor: ["savory", "spicy", "handheld", "utensils"],
  },
  {
    name: "Yukon Pizza",
    img: "restaurant-logos/yukon-logo.png",
    link: "yukonpizza.html",
    tags: ["pizza", "unique", "handheld", "utensils"],
    flavor: ["savory"],
  },
];

const sortable = document.getElementById("sortable");
let draggedItem = null,
  placeholder = null;

function createPlaceholder() {
  const div = document.createElement("div");
  div.className = "ranking-placeholder";
  div.style.cssText =
    "height:40px;margin:5px 0;border:2px dashed var(--color-secondary);border-radius:4px;background:#f8fff8;opacity:0.6;pointer-events:none";
  return div;
}

sortable.querySelectorAll("li").forEach((item) => (item.draggable = true));

// dragging events
sortable.addEventListener("dragstart", (e) => {
  if (e.target.tagName !== "LI") return;
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  placeholder = createPlaceholder();
  setTimeout(() => {
    draggedItem.style.display = "none";
    draggedItem.parentNode.insertBefore(placeholder, draggedItem);
  }, 0);
});

sortable.addEventListener("dragend", (e) => {
  if (e.target.tagName !== "LI") return;
  draggedItem.classList.remove("dragging");
  draggedItem.style.display = "";
  if (placeholder?.parentNode) {
    placeholder.parentNode.insertBefore(draggedItem, placeholder);
    placeholder.remove();
  }
});

sortable.addEventListener("dragover", (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(sortable, e.clientY);
  const currentPlaceholder = sortable.querySelector(".ranking-placeholder");
  if (!currentPlaceholder || !draggedItem) return;

  const items = sortable.querySelectorAll("li:not(.dragging)");
  items.forEach(
    (item) => (item.dataset.oldY = item.getBoundingClientRect().top)
  );

  afterElement
    ? sortable.insertBefore(currentPlaceholder, afterElement)
    : sortable.appendChild(currentPlaceholder);

  items.forEach((item) => {
    const deltaY =
      parseFloat(item.dataset.oldY) - item.getBoundingClientRect().top;
    if (deltaY) {
      item.style.transition = "none";
      item.style.transform = `translateY(${deltaY}px)`;
      requestAnimationFrame(() => {
        item.style.transition = "transform 0.3s ease";
        item.style.transform = "translateY(0)";
      });
    }
  });
});

sortable.addEventListener("drop", (e) => e.preventDefault());

let draggedClone = null;

// Touch drag events
sortable.addEventListener("touchstart", (e) => {
  draggedItem = e.target.closest("li");
  if (!draggedItem) return;

  draggedItem.classList.add("dragging");

  placeholder = createPlaceholder();
  sortable.insertBefore(placeholder, draggedItem.nextSibling);

  draggedItem.style.display = "none";
});

sortable.addEventListener("touchmove", (e) => {
  e.preventDefault();
  if (!draggedItem) return;

  const touch = e.touches[0];
  const afterElement = getDragAfterElement(sortable, touch.clientY);
  const currentPlaceholder = sortable.querySelector(".ranking-placeholder");

  if (!currentPlaceholder) return;

  afterElement
    ? sortable.insertBefore(currentPlaceholder, afterElement)
    : sortable.appendChild(currentPlaceholder);
});

sortable.addEventListener("touchend", () => {
  if (!draggedItem) return;

  const currentPlaceholder = sortable.querySelector(".ranking-placeholder");

  if (currentPlaceholder) {
    sortable.insertBefore(draggedItem, currentPlaceholder);
    currentPlaceholder.remove();
  } else {
    sortable.appendChild(draggedItem);
  }

  draggedItem.classList.remove("dragging");
  draggedItem.style.display = "";
  draggedItem = null;
  placeholder = null;
});

function getDragAfterElement(container, y) {
  return [...container.querySelectorAll("li:not(.dragging)")].reduce(
    (closest, child) => {
      const offset =
        y - child.getBoundingClientRect().top - child.offsetHeight / 2;
      return offset < 0 && offset > closest.offset
        ? { offset, element: child }
        : closest;
    },
    { offset: -Infinity }
  ).element;
}

const flavorScore = (val) => {
  if (val <= 2) return -4;
  if (val > 3 && val < 5) return -2;
  if (val === 5) return 0;
  if (val > 5 && val < 8) return 2;
  if (val >= 8) return 4;
  return 0;
};

// snap sliders to center
document.querySelectorAll('input[type="range"]').forEach((slider) => {
  slider.addEventListener("change", () => {
    if (slider.value >= 4.6 && slider.value <= 5.4) slider.value = 5;
  });
});

// error modal
const modal = document.getElementById("error-modal");
const closeModalBtn = document.getElementById("close-modal");

function openModal() {
  modal.showModal();
}

closeModalBtn.addEventListener("click", () => {
  modal.close();
});

// submission validation
document.getElementById("quiz-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const form = e.target;
  const requiredGroups = [
    "handheld",
    "sammich-form",
    "style",
    "salad",
    "drinkie",
  ];
  const missing = requiredGroups.some(
    (name) => !form.querySelector(`input[name="${name}"]:checked`)
  );

  if (missing) {
    openModal();
    const firstMissing = requiredGroups.find(
      (name) => !form.querySelector(`input[name="${name}"]:checked`)
    );
    form
      .querySelector(`input[name="${firstMissing}"]`)
      .scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  const submitBtn = form.querySelector("button[type='submit']");
  submitBtn.disabled = true;

  const getVal = (id) => parseInt(document.getElementById(id).value);
  const getChoice = (name) => {
    const selected = document.querySelector(`input[name='${name}']:checked`);
    return selected ? selected.value : "unsure";
  };

  const spicy = getVal("spicy"),
    sweet = getVal("sweet"),
    savory = getVal("savory"),
    salad = getChoice("salad"),
    drinkie = getChoice("drinkie"),
    handheld = getChoice("handheld"),
    style = getChoice("style"),
    sammichForm = getChoice("sammich-form"),
    preferred = document.getElementById("preferred-choice").value;

  const ranked = [...sortable.children]
    .filter((li) => li.tagName === "LI")
    .map((li) => li.textContent.split(" ")[0].toLowerCase());

  const scores = Object.fromEntries(restaurants.map((r) => [r.name, 0]));
  console.log("Initial scores:");
  console.table(scores);

  // flavor points
  const scoringRules = [
    { type: "sweet", value: sweet },
    { type: "spicy", value: spicy },
    { type: "savory", value: savory },
  ].map(({ type, value }) => ({
    type,
    targets: restaurants
      .filter((r) => r.flavor.includes(type))
      .map((r) => r.name),
    score: value ? flavorScore(value) : 0,
  }));

  console.group("Flavor Points");
  scoringRules.forEach((rule) => {
    rule.targets.forEach((r) => {
      scores[r] += rule.score;
      console.log(
        `${r} ${rule.score >= 0 ? "+" : ""}${rule.score} (flavor: ${
          rule.type
        }) -> ${scores[r]}`
      );
    });
  });
  console.groupEnd();

  // handheld vs utensils
  if (handheld !== "unsure") {
    console.group("Handheld / Utensils");
    const oppositeTag = handheld === "handheld" ? "utensils" : "handheld";
    const penalty = -4;
    restaurants.forEach((r) => {
      if (r.tags.includes(oppositeTag) && !r.tags.includes(handheld)) {
        scores[r.name] += penalty;
        console.log(
          `${r.name} (tag: ${oppositeTag}) ${penalty} -> ${scores[r.name]}`
        );
      } else {
        console.log(`${r.name} (tag: ${handheld}) 0 -> ${scores[r.name]}`);
      }
    });
    console.groupEnd();
  }

  // sammich
  if (sammichForm !== "unsure") {
    console.group("Sammich Bonus");
    const sammichRestaurants = [
      "Bronze Cafe",
      "Burger King",
      "Ike's",
      "Smash Me Baby",
      "Subway",
    ];

    restaurants.forEach((r) => {
      let delta = 0;
      if (sammichForm === "yes") {
        delta = sammichRestaurants.includes(r.name) ? 3 : -3;
      } else {
        delta = sammichRestaurants.includes(r.name) ? -3 : 3;
      }
      scores[r.name] += delta;
      console.log(
        `${r.name} ${delta >= 0 ? "+" : ""}${delta} (sammich) -> ${
          scores[r.name]
        }`
      );
    });
    console.groupEnd();
  }

  // style
  if (style !== "unsure") {
    console.group("Classic vs. Unique");
    restaurants.forEach((r) => {
      let delta = r.tags.includes(style) ? 2 : -2;
      scores[r.name] += delta;
      const restaurantStyle = r.tags.includes("classic") ? "classic" : "unique";
      console.log(
        `${r.name} (style: ${restaurantStyle}) ${
          delta >= 0 ? "+" : ""
        }${delta} -> ${scores[r.name]}`
      );
    });
    console.groupEnd();
  }

  // salad
  if (salad !== "unsure") {
    console.group("Salad");
    if (salad === "yes") {
      ["Bronze Cafe", "Garden Grill", "Plant Power", "Yukon Pizza"].forEach(
        (r) => {
          scores[r] += 4;
          console.log(`${r} +4 (salad) -> ${scores[r]}`);
        }
      );
    } else {
      ["Bronze Cafe"].forEach((r) => {
        scores[r] -= 2;
        console.log(`${r} -2 (no salad) -> ${scores[r]}`);
      });
    }
    console.groupEnd();
  }

  // drinks
  if (drinkie !== "unsure") {
    console.group("Drinks");
    if (drinkie === "yes") {
      ["Sonic", "Bronze Cafe", "Plant Power", "Taco Bell"].forEach((r) => {
        scores[r] += 2;
        console.log(`${r} +2 (drinks) -> ${scores[r]}`);
      });
    } else {
      ["Bronze Cafe", "Sonic", "Taco Bell"].forEach((r) => {
        scores[r] -= 4;
        console.log(`${r} -4 (no drinks) -> ${scores[r]}`);
      });
    }
    console.groupEnd();
  }

  // rank boosts
  console.group("Rank Boosts");
  const rankBoosts = [4, 3, 2, 1, 0, 0, -1, -2];
  ranked.forEach((category, i) => {
    if (!rankBoosts[i]) return;
    restaurants
      .filter((r) => r.tags.includes(category))
      .forEach((r) => {
        scores[r.name] += rankBoosts[i];
        console.log(
          `${r.name} +${rankBoosts[i]} (rank: ${category}) -> ${scores[r.name]}`
        );
      });
  });
  console.groupEnd();

  // preferred choice
  if (preferred) {
    scores[preferred] += 4;
    console.log(`Preferred choice: ${preferred} +4 -> ${scores[preferred]}`);
  }

  // conditional deductions
  if (handheld === "utensils" && salad !== "yes") {
    ["Bronze Cafe", "Plant Power", "Yukon Pizza"].forEach((r) => {
      scores[r] -= 4;
      console.log(`${r} -4 (utensils + no/unsure salad) -> ${scores[r]}`);
    });
  }

  if (sammichForm === "no" && salad !== "yes") {
    ["Bronze Cafe", "Plant Power", "Yukon Pizza"].forEach((r) => {
      scores[r] -= 4;
      console.log(`${r} -4 (no sammichForm + no/unsure salad) -> ${scores[r]}`);
    });
  }

  console.log("Final Scores:");
  console.table(scores);

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const [mainRestaurant, backupRestaurant] = sorted
    .slice(0, 2)
    .map(([name]) => restaurants.find((r) => r.name === name));

  const updateResult = (prefix, r) => {
    document.getElementById(`${prefix}-restaurant-name`).textContent = r.name;
    document.getElementById(`${prefix}-restaurant-img`).src = r.img;
    document.getElementById(`${prefix}-restaurant-link`).href = r.link;
  };

  updateResult("main", mainRestaurant);
  updateResult("backup", backupRestaurant);

  document.getElementById("result").classList.remove("hidden");
  document
    .getElementById("main-restaurant-img")
    .scrollIntoView({ behavior: "smooth", block: "center" });

  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { ticks: 200, zIndex: 9999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      submitBtn.disabled = false;
      return;
    }

    const particleCount = 25;
    confetti(
      Object.assign({}, defaults, {
        particleCount,
        spread: 160,
        startVelocity: 40 + Math.random() * 20,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: [
          "#ff0a54",
          "#ff477e",
          "#ff85a1",
          "#fbb1b9",
          "#fae0e4",
          "#c5f0a4",
          "#00ffe7",
          "#4c5fd7",
        ],
      })
    );
  }, 50);
});
