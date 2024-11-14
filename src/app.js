require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  console.error("Brak klucza API.");
  process.exit(1);
}

const filePath = path.join(__dirname, "../in/artykul.txt");
const output = path.join(__dirname, "../out/artykul.html");

const readFile = () => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    console.error("Nie udalo sie wczytac pliku: ", e.message);
    process.exit(1);
  }
};

const saveToHTML = (content) => {
  try {
    fs.writeFileSync(output, content, "utf8");
    console.log(`Saved in: ${output}`);
  } catch (e) {
    console.error("Nie udalo sie utworzyc pliku: ", e.message);
  }
};

const processFile = async (content) => {
  try {
    const res = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              'Przekształć podany artykuł w semantyczny kod HTML5, zawierający wyłącznie elementy do umieszczenia wewnątrz <body>. Zastosuj następujące zasady:\n\n1. Wykorzystuj semantyczne elementy HTML5, takie jak <header>, <main>, <section>, <article>, <footer>.\n2. Dodaj obrazy tam, gdzie pasują, używając tagów <img> z atrybutami:\n   - src="image_placeholder.jpg"\n   - alt z dokładnym opisem jako prompt dla obrazu.\n3. Obrazy otaczaj tagiem <figure>, a opis umieszczaj w <figcaption>.\n\nZwróć wyłącznie czysty kod HTML. Unikaj bloków markdown, komentarzy i dodatkowego tekstu. Odpowiedź ma być gotowa do umieszczenia wewnątrz <body>.',
          },
          { role: "user", content: content },
        ],
        max_tokens: 2048,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.data.choices[0].message.content.trim();
  } catch (e) {
    console.error("Blad podczas przetwarzania pliku (OpenAI): ", e.message);
    process.exit(1);
  }
};

const run = async () => {
  const content = readFile();
  const htmlContent = await processFile(content);
  saveToHTML(htmlContent);
};

run();
