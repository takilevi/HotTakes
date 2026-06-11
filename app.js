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
      "Talent matters more than hard work.",
      "Team-building activities rarely build teams.",
      "Being busy is not the same as being productive.",
      "The best employee is not always the best manager.",
      "Open offices were a mistake.",
      "Loyalty to employers is outdated.",
      "AI will make average people more powerful than experts.",
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
      "A lie you still don't regret.",
      "The pettiest reason you've disliked someone.",
      "A popular thing you've pretended to enjoy.",
      "The dumbest thing you've spent money on.",
      "A skill people assume you have, but you don't.",
      "Something you've accidentally stolen.",
      "A bad habit you've successfully hidden.",
      "The most ridiculous thing you've been competitive about.",
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
      "Find someone who has never watched Star Wars.",
      "Find someone who prefers phone calls over texting.",
      "Find someone who would rather live in the mountains than by the sea.",
      "Find someone who has a hobby nobody at work knows about.",
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
      "Uses speakerphone in public.",
      "Has 5+ alarms every morning.",
      "Replies with voice messages only.",
      "Keeps their phone on 1% battery.",
      "Doesn't save contacts in their phone.",
      "Leaves browser tabs open for months.",
      "Doesn't use a calendar.",
      "Always arrives exactly on time, never early or late.",
      "Has over 10,000 unread emails.",
      "Watches movies at 1.5x speed.",
    ],
  },
];

const deckGrid = document.querySelector("#deckGrid");
const listView = document.querySelector("#listView");
const cardList = document.querySelector("#cardList");
const customView = document.querySelector("#customView");
const customForm = document.querySelector("#customForm");
const customTakeInput = document.querySelector("#customTakeInput");
const drawView = document.querySelector("#drawView");
const drawCard = document.querySelector("#drawCard");
const deckLabel = document.querySelector("#deckLabel");
const promptText = document.querySelector("#promptText");
const allCardsButton = document.querySelector("#allCardsButton");
const addTakeButton = document.querySelector("#addTakeButton");
const cancelCustomButton = document.querySelector("#cancelCustomButton");
const closeListButton = document.querySelector("#closeListButton");
const backButton = document.querySelector("#backButton");
const drawAgainButton = document.querySelector("#drawAgainButton");
const installButton = document.querySelector("#installButton");

let activeDeck = null;
let deferredInstallPrompt = null;
let lastPrompt = "";
let returnView = "grid";

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
  returnView = "grid";
  lastPrompt = "";
  backButton.setAttribute("aria-label", "Back to decks");
  deckGrid.hidden = true;
  listView.hidden = true;
  customView.hidden = true;
  drawView.hidden = false;
  drawCard.style.setProperty("--accent", deck.accent);
  deckLabel.textContent = deck.title;
  promptText.textContent = drawPrompt(deck);
  drawAgainButton.hidden = false;
}

function showCustomForm() {
  activeDeck = null;
  deckGrid.hidden = true;
  listView.hidden = true;
  drawView.hidden = true;
  customView.hidden = false;
  customTakeInput.value = "";
  customTakeInput.focus();
}

function showCustomTake(take) {
  activeDeck = null;
  returnView = "grid";
  backButton.setAttribute("aria-label", "Back to decks");
  customView.hidden = true;
  deckGrid.hidden = true;
  listView.hidden = true;
  drawView.hidden = false;
  drawCard.style.setProperty("--accent", "#f45d5f");
  deckLabel.textContent = "Your Hot Take";
  promptText.textContent = take;
  drawAgainButton.hidden = true;
}

function showGrid() {
  activeDeck = null;
  returnView = "grid";
  customView.hidden = true;
  drawView.hidden = true;
  listView.hidden = true;
  deckGrid.hidden = false;
  promptText.textContent = "";
  drawAgainButton.hidden = false;
}

function showList() {
  activeDeck = null;
  returnView = "grid";
  customView.hidden = true;
  drawView.hidden = true;
  deckGrid.hidden = true;
  listView.hidden = false;
  promptText.textContent = "";
  drawAgainButton.hidden = false;
}

function showListedCard(deck, prompt) {
  activeDeck = null;
  returnView = "list";
  backButton.setAttribute("aria-label", "Back to all cards");
  customView.hidden = true;
  deckGrid.hidden = true;
  listView.hidden = true;
  drawView.hidden = false;
  drawCard.style.setProperty("--accent", deck.accent);
  deckLabel.textContent = deck.title;
  promptText.textContent = prompt;
  drawAgainButton.hidden = true;
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

function renderCardList() {
  const cards = decks.flatMap((deck) =>
    deck.prompts.map((prompt) => {
      const card = document.createElement("button");
      card.className = "list-card";
      card.type = "button";
      card.style.setProperty("--accent", deck.accent);
      card.setAttribute("aria-label", `Open ${prompt} from ${deck.title}`);

      const text = document.createElement("span");
      text.className = "list-card-text";
      text.textContent = prompt;

      const label = document.createElement("span");
      label.className = "list-card-deck";
      label.textContent = deck.title;

      card.append(text, label);
      card.addEventListener("click", () => showListedCard(deck, prompt));
      return card;
    }),
  );

  cardList.replaceChildren(...cards);
}

allCardsButton.addEventListener("click", showList);
addTakeButton.addEventListener("click", showCustomForm);

customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const take = customTakeInput.value.trim();

  if (!take) {
    customTakeInput.focus();
    return;
  }

  showCustomTake(take);
});

cancelCustomButton.addEventListener("click", showGrid);
closeListButton.addEventListener("click", showGrid);

drawAgainButton.addEventListener("click", () => {
  if (!activeDeck) return;
  promptText.textContent = drawPrompt(activeDeck);
});

backButton.addEventListener("click", () => {
  if (returnView === "list") {
    showList();
    return;
  }

  showGrid();
});

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
renderCardList();
