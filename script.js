// change this language code to your preferred target language
config = {
  targetLanguage: "es",
};

async function translate(text, source, target) {
  const response = await fetch(
    `https://translate.googleapis.com/translate_a/single?client=gtx&hl=en-US&dt=qca&dt=t&dt=bd&dj=1&source=icon&sl=${source}&tl=${target}&q=${text}`
  );
  const json = await response.json();
  const translated = json.sentences[0].trans;
  return translated;
}

function speak(text, language) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = synth
    .getVoices()
    .find(
      (voice) =>
        voice.lang.split("-")[0].toLowerCase() ===
        language.split("-")[0].toLowerCase()
    );
  synth.speak(utterance);
}

function getSelectionText() {
  var text = "";
  var activeEl = document.activeElement;
  var activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
  if (
    activeElTagName == "textarea" ||
    (activeElTagName == "input" &&
      /^(?:text|search|password|tel|url)$/i.test(activeEl.type) &&
      typeof activeEl.selectionStart == "number")
  ) {
    text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
  } else if (window.getSelection) {
    text = window.getSelection().toString();
  }
  return text;
}

async function translateAndReadPageInLanguage(language) {
  const text = getSelectionText().replace(/\n+/g, " ");
  if (!text) return;
  const translated = await translate(text, "auto", language);
  console.log("reading the page contents in language " + language, translated);
  speak(translated, language);
}

document.onmouseup = () =>
  translateAndReadPageInLanguage(config.targetLanguage);
