const decks = [
  {
    id: "hot-takes",
    title: "Hot Takes",
    accent: "#f45d5f",
    icon: "🔥",
    prompts: [
      "AI will make managers more important, not less",
      "Work-life balance is mostly a myth",
      "Meetings ARE the work",
      "Convince me aliens does not exist",
      "Remote work made people socially weaker",
      "Mount Everest is not the tallest mountain",
      "Ice skating is water skating",
      "Wearing shoes indoors should be illegal.",
    ],
  },
  {
    id: "confessions",
    title: "Confessions",
    accent: "#b66cff",
    icon: "✦",
    prompts: [
      "A completely irrational fear.",
      "A weird habit.",
      "A thing you pretend to understand.",
      "A food combination you defend.",
      "Something embarrassingly old-fashioned about you.",
      "A useless talent.",
      "What tiny thing do you take way too seriously?",
      "What's a product you aggressively recommend?",
      "What's a social norm you reject?",
      "What's your most irrational turn-off?",
      "What's something attractive that shouldn't be?",
      "What's a trait people pretend not to care about?",
      "What dating advice is complete nonsense?",
    ],
  },
  {
    id: "social-experiments",
    title: "Social Experiments",
    accent: "#3ec9a7",
    icon: "◎",
    prompts: [
      "Find a shared unpopular opinion.",
      "Find someone who has one thing you strongly disagree on.",
      "Find someone who hates your favorite food.",
      "Find someone who has never seen your favorite movie.",
      "Find someone who peaked in high school.",
      "Find someone who has quit a job dramatically.",
      "Find someone with a toxic trait they defend.",
      "Find someone who thinks jealousy is normal.",
    ],
  },
  {
    id: "red-green",
    title: "Red Flag - Green Flag",
    accent: "#f6c85f",
    icon: "⚑",
    prompts: [
      "Still texts their ex.",
      "No hobbies.",
      "Irons bedsheets.",
      "Reads self-help books.",
      "Never posts on social media.",
      "Sleeps with socks on.",
      "Astrology.",
      "Has tons of tabs open",
      "Sends messages saying only 'hi'",
    ],
  },
];

const deckGrid = document.querySelector("#deckGrid");
const drawView = document.querySelector("#drawView");
const drawCard = document.querySelector("#drawCard");
const deckLabel = document.querySelector("#deckLabel");
const promptText = document.querySelector("#promptText");
const backButton = document.querySelector("#backButton");
const drawAgainButton = document.querySelector("#drawAgainButton");
const installButton = document.querySelector("#installButton");

let activeDeck = null;
let deferredInstallPrompt = null;
let lastPrompt = "";

function drawPrompt(deck) {
  if (deck.prompts.length === 1) {
    return deck.prompts[0];
  }

  let nextPrompt = deck.prompts[Math.floor(Math.random() * deck.prompts.length)];

  while (nextPrompt === lastPrompt) {
    nextPrompt = deck.prompts[Math.floor(Math.random() * deck.prompts.length)];
  }

  lastPrompt = nextPrompt;
  return nextPrompt;
}

function showDeck(deck) {
  activeDeck = deck;
  lastPrompt = "";
  deckGrid.hidden = true;
  drawView.hidden = false;
  drawCard.style.setProperty("--accent", deck.accent);
  deckLabel.textContent = deck.title;
  promptText.textContent = drawPrompt(deck);
}

function showGrid() {
  activeDeck = null;
  drawView.hidden = true;
  deckGrid.hidden = false;
}

function renderDecks() {
  const cards = decks.map((deck) => {
    const card = document.createElement("button");
    card.className = "deck-card";
    card.type = "button";
    card.style.setProperty("--accent", deck.accent);
    card.setAttribute("aria-label", `Draw a ${deck.title} card`);
    card.innerHTML = `
      <span class="deck-icon" aria-hidden="true">${deck.icon}</span>
      <span class="deck-title">${deck.title}</span>
      <span class="deck-count">${deck.prompts.length} cards</span>
    `;
    card.addEventListener("click", () => showDeck(deck));
    return card;
  });

  deckGrid.replaceChildren(...cards);
}

drawAgainButton.addEventListener("click", () => {
  if (!activeDeck) return;
  promptText.textContent = drawPrompt(activeDeck);
});

backButton.addEventListener("click", showGrid);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  installButton.hidden = false;
});

installButton.addEventListener("click", async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js");
  });
}

renderDecks();
