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
            content: ` 
                        Przekształć poniższy artykuł w semantyczny kod HTML, zawierający wyłącznie elementy do umieszczenia wewnątrz <body>. Uwzględnij:
                        Semantyczne elementy HTML5 takie jak <header>, <main>, <section>, <article>, <footer>, itd.
                        Obrazy tam, gdzie warto je dodać, w formie tagów <img> z następującymi atrybutami:
                        - src="image_placeholder.jpg"
                        - alt z precyzyjnym opisem służącym jako prompt do wygenerowania danego obrazu.
                        Tagi <figure> otaczające obrazy, z <figcaption> zawierającym opis grafiki.
                        Uwaga: Zwróć wyłącznie czysty kod w formacie HTML (nie używaj markdown) bez komentarzy ani dodatkowych wyjaśnień.
                        Kod ma działać po wrzuceniu go wewnątrz <body>.
                        `,
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
