## Oxido - zadanie rekrutacyjne

### Opis

Prosta aplikacja, która przekazuje treść pliku tekstowego `/in/artykul.txt` do OpenAI i generuje na jego podstawie artykuł gotowy do użycia na stronie internetowej. Wystarczy, że umieścisz zawartość utworzonego pliku `/out/artykul.html` między tagami `<body>`. Mozesz do tego wykorzystać `podglad.html`.

### Instalacja

```bash
git clone https://github.com/vuuzo/oxido.git
```

Zmień nazwę `.env.example` na `.env` i umieść w nim klucz do OpenAI API

Następnie

```bash
pnpm i
pnpm generate
```
