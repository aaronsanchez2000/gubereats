const restaurants = [
  {
    name: "Bronze Cafe",
    img: "restaurant-logos/bronzecafe-logo.jpg",
    link: "bronzecafe.html",
    tags: ["sammich", "drinkies", "unique", "handheld"],
  },
  {
    name: "Burger King",
    img: "restaurant-logos/burgerking-logo.png",
    link: "burgerking.html",
    tags: ["borg", "classic", "handheld"],
  },
  {
    name: "Chef Kenny's",
    img: "restaurant-logos/chefkennys-logo.webp",
    link: "chefkennys.html",
    tags: ["asian", "chikky", "unique", "utensils"],
  },
  {
    name: "Cinnaholic",
    img: "restaurant-logos/cinnaholic-logo.webp",
    link: "cinnaholic.html",
    tags: ["sweets", "unique", "utensils"],
  },
  {
    name: "Garden Grill",
    img: "restaurant-logos/gardengrill-logo2.jpg",
    link: "gardengrill.html",
    tags: ["savory", "chikky", "unique", "utensils"],
  },
  {
    name: "Ike's",
    img: "restaurant-logos/ikes-logo.svg",
    link: "ikes.html",
    tags: ["sammich", "unique", "handheld"],
  },
  {
    name: "Peinto Thai",
    img: "restaurant-logos/peinto-logo3.png",
    link: "peinto.html",
    tags: ["asian", "spicy", "utensils"],
  },
  {
    name: "Plant Power",
    img: "restaurant-logos/plantpower-logo.avif",
    link: "plantpower.html",
    tags: ["borg", "chikky", "unique", "handheld"],
  },
  {
    name: "Prone to Plants",
    img: "restaurant-logos/pronetoplants-logo2.png",
    link: "pronetoplants.html",
    tags: ["savory", "chikky", "unique", "utensils"],
  },
  {
    name: "Shinjuku Ramen",
    img: "restaurant-logos/shinjuku-logo.webp",
    link: "shinjuku.html",
    tags: ["asian", "spicy", "utensils"],
  },
  {
    name: "Smash Me Baby",
    img: "restaurant-logos/smashmebaby-logo.webp",
    link: "smashmebaby.html",
    tags: ["borg", "unique", "handheld"],
  },
  {
    name: "Sonic",
    img: "restaurant-logos/sonic-logo.png",
    link: "sonic.html",
    tags: ["drinkies", "classic", "handheld"],
  },
  {
    name: "Subway",
    img: "restaurant-logos/subway-logo.png",
    link: "subway.html",
    tags: ["sammich", "classic", "handheld"],
  },
  {
    name: "Taco Bell",
    img: "restaurant-logos/tacobell-logo.png",
    link: "tacobell.html",
    tags: ["tacos", "classic", "handheld"],
  },
  {
    name: "Tacotarian",
    img: "restaurant-logos/tacotarian-logo2.jpg",
    link: "tacotarian.html",
    tags: ["tacos", "unique", "handheld"],
  },
  {
    name: "Yukon Pizza",
    img: "restaurant-logos/yukon-logo.png",
    link: "yukonpizza.html",
    tags: ["pizza", "unique", "utensils"],
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

// dragging stuff
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

const weightedScore = (val, weights) =>
  weights[Math.min(Math.floor((val - 1) / 2), weights.length - 1)] || 0;

// snap sliders to center
document.querySelectorAll('input[type="range"]').forEach((slider) => {
  slider.addEventListener("change", () => {
    if (slider.value >= 4.6 && slider.value <= 5.4) slider.value = 5;
  });
});

document.getElementById("quiz-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const submitBtn = document.querySelector("#quiz-form button[type='submit']");
  submitBtn.disabled = true; // lock submit button (no spam clicks)

  const getVal = (id) => parseInt(document.getElementById(id).value);
  const getChoice = (name) =>
    document.querySelector(`input[name='${name}']:checked`).value;

  const spicy = getVal("spicy"),
    sweet = getVal("sweet"),
    savory = getVal("savory"),
    drinkie = getChoice("drinkie"),
    handheld = getChoice("handheld"),
    style = getChoice("style"),
    sammichForm = getChoice("sammich-form");

  const ranked = [...sortable.children]
    .filter((li) => li.tagName === "LI")
    .map((li) => li.textContent.split(" ")[0].toLowerCase());
  const scores = Object.fromEntries(restaurants.map((r) => [r.name, 0]));

  // flavor points
  const scoringRules = [
    {
      targets: ["Cinnaholic", "Bronze Cafe"],
      score: weightedScore(sweet, [-4, -2, 0, 2, 4]),
    },
    {
      targets: ["Peinto Thai", "Shinjuku Ramen", "Tacotarian", "Taco Bell"],
      score: weightedScore(spicy, [-4, -2, 0, 2, 4]),
    },
    {
      targets: ["Garden Grill", "Prone to Plants"],
      score: weightedScore(savory, [-4, -2, 0, 2, 4]),
    },
  ];
  scoringRules.forEach((rule) =>
    rule.targets.forEach((r) => (scores[r] += rule.score))
  );

  // drinks
  drinkie === "yes"
    ? ["Sonic", "Bronze Cafe", "Plant Power", "Taco Bell"].forEach(
        (r) => (scores[r] += 2)
      )
    : ["Bronze Cafe", "Sonic"].forEach((r) => (scores[r] -= 4));

  // sammich bonus
  ["Bronze Cafe", "Ike's", "Smash Me Baby", "Subway"].forEach(
    (r) => (scores[r] += sammichForm === "yes" ? 3 : -3)
  );

  // handheld/utensils
  restaurants
    .filter((r) =>
      r.tags.includes(handheld === "handheld" ? "handheld" : "utensils")
    )
    .forEach((r) => (scores[r.name] += 2));
  restaurants
    .filter((r) => r.tags.includes(style))
    .forEach((r) => (scores[r.name] += 2));

  // rank boosts
  const rankBoosts = [4, 3, 2, 1, 0, 0];
  ranked.forEach((category, i) => {
    if (!rankBoosts[i]) return;
    restaurants
      .filter((r) => r.tags.includes(category))
      .forEach((r) => (scores[r.name] += rankBoosts[i]));
  });

  const preferred = document.getElementById("preferred-choice").value;
  if (preferred) scores[preferred] += 4;

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

  // confetti time
  const duration = 2000;
  const animationEnd = Date.now() + duration;
  const defaults = { ticks: 200, zIndex: 9999 };

  const interval = setInterval(() => {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      submitBtn.disabled = false; // unlock button after confetti
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
          "#ffae34",
        ],
      })
    );
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
          "#ffae34",
        ],
      })
    );
  }, 150);
});
