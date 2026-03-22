type ZenQuote = {
  q: string;
  a: string;
};

type BoredActivityResponse = {
  activity?: string;
};

const BORED_API_URL = "https://www.boredapi.com/api/activity/";
const QUOTE_CACHE_KEY = "mini-webshop-zenquote";
const QUOTE_CACHE_DATE_KEY = "mini-webshop-zenquote-date";
const FALLBACK_QUOTE: ZenQuote = {
  q: "Små steg hver dag blir store resultater over tid.",
  a: "Dominique Zargon"
};

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

function renderQuote(text: string, author: string) {
  const textEl = document.getElementById("quote-text");
  const authorEl = document.getElementById("quote-author");

  if (!textEl || !authorEl) return;

  textEl.textContent = `"${text}"`;
  authorEl.textContent = author ? `- ${author}` : "";
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage errors (e.g. private mode restrictions)
  }
}

function loadQuoteFromCache(): boolean {
  const cachedDate = readStorage(QUOTE_CACHE_DATE_KEY);
  const cachedRaw = readStorage(QUOTE_CACHE_KEY);

  if (!cachedDate || !cachedRaw) return false;
  if (cachedDate !== getTodayKey()) return false;

  try {
    const cached = JSON.parse(cachedRaw) as ZenQuote;
    renderQuote(cached.q, cached.a);
    return true;
  } catch {
    return false;
  }
}

async function fetchQuote(): Promise<ZenQuote> {
  const response = await fetch(BORED_API_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = (await response.json()) as BoredActivityResponse;

  if (!data.activity || typeof data.activity !== "string") {
    throw new Error("Mangler activity-data");
  }

  return {
    q: data.activity,
    a: "Bored API"
  };
}

async function loadHeaderQuote() {
  const hasQuoteNodes = document.getElementById("quote-text") && document.getElementById("quote-author");
  if (!hasQuoteNodes) {
    return;
  }

  if (loadQuoteFromCache()) return;

  try {
    const quote = await fetchQuote();

    renderQuote(quote.q, quote.a);
    writeStorage(QUOTE_CACHE_KEY, JSON.stringify(quote));
    writeStorage(QUOTE_CACHE_DATE_KEY, getTodayKey());
  } catch {
    renderQuote(FALLBACK_QUOTE.q, FALLBACK_QUOTE.a);
  }
}

loadHeaderQuote();