const languages = [
  { id: "en", name: "English", native: "English", dir: "ltr", lines: [
    "I’m Yingjie Xiao, a computational linguistics student fascinated by the hidden structures of language.",
    "I study how humans and language models perceive causality, reason, and generalize beyond what they have seen.",
    "I want to turn our understanding of intelligence into useful systems for research, medicine, and better decision-making."
  ]},
  { id: "de", name: "German", native: "Deutsch", dir: "ltr", lines: [
    "Ich bin Yingjie Xiao, Student der Computerlinguistik, fasziniert von den verborgenen Strukturen der Sprache.",
    "Ich untersuche, wie Menschen und Sprachmodelle Kausalität wahrnehmen, schlussfolgern und über Bekanntes hinaus generalisieren.",
    "Ich möchte unser Verständnis von Intelligenz in nützliche Systeme für Forschung, Medizin und bessere Entscheidungen übersetzen."
  ]},
  { id: "gsw", name: "Swiss German", native: "Schwiizerdütsch", dir: "ltr", lines: [
    "Ich bi Yingjie Xiao, studiere Computerlinguistik und bi fasziniert vo de verborgene Strukture vo de Sprach.",
    "Ich untersueche, wie Mänsche und Sprachmodell Kausalität wahrnähmed, Schlussfolgerige ziehnd und über s Bekannti use generalisiered.",
    "Ich möcht üses Verständnis vo Intelligenz in nützlechi System für d Forschig, d Medizin und besseri Entscheidige umsetze."
  ]},
  { id: "swg", name: "Swabian", native: "Schwäbisch", dir: "ltr", lines: [
    "I ben Yingjie Xiao, studier Computerlinguistik, ond mi faszinieret dia versteckte Struktura von dr Sproch.",
    "I untersuch, wie Leit ond Sprachmodelle Kausalität wahrnemmet, Schlussfolgerunge ziehet ond über des naus generalisieret, was se scho gseha hend.",
    "I will aus onsrem Verständnis von Intelligenz nützliche System für d Forschig, d Medizin ond bessere Entscheidunge macha."
  ]},
  { id: "zh", name: "Mandarin Chinese", native: "普通话", dir: "ltr", lines: [
    "我是 Yingjie Xiao，一名计算语言学学生，着迷于语言背后的隐藏结构。",
    "我研究人类和语言模型如何感知因果关系、进行推理，并将所学推广到未见过的情境。",
    "我希望把我们对智能的理解转化为服务科研、医疗和更好决策的实用系统。"
  ]},
  { id: "es", name: "Spanish", native: "Español", dir: "ltr", lines: [
    "Soy Yingjie Xiao, estudiante de lingüística computacional, fascinado por las estructuras ocultas del lenguaje.",
    "Estudio cómo los seres humanos y los modelos de lenguaje perciben la causalidad, razonan y generalizan más allá de lo que han visto.",
    "Quiero convertir nuestra comprensión de la inteligencia en sistemas útiles para la investigación, la medicina y una mejor toma de decisiones."
  ]},
  { id: "fr", name: "French", native: "Français", dir: "ltr", lines: [
    "Je suis Yingjie Xiao, étudiant en linguistique informatique, fasciné par les structures cachées du langage.",
    "J’étudie comment les humains et les modèles de langage perçoivent la causalité, raisonnent et généralisent au-delà de ce qu’ils ont observé.",
    "Je souhaite transformer notre compréhension de l’intelligence en systèmes utiles à la recherche, à la médecine et à de meilleures décisions."
  ]},
  { id: "pt", name: "Portuguese", native: "Português", dir: "ltr", lines: [
    "Sou Yingjie Xiao, estudante de linguística computacional, fascinado pelas estruturas ocultas da linguagem.",
    "Estudo como os seres humanos e os modelos de linguagem percebem a causalidade, raciocinam e generalizam para além do que já viram.",
    "Quero transformar nossa compreensão da inteligência em sistemas úteis para a pesquisa, a medicina e uma melhor tomada de decisões."
  ]},
  { id: "nb", name: "Norwegian Bokmål", native: "Norsk", dir: "ltr", lines: [
    "Jeg er Yingjie Xiao, student i datalingvistikk, fascinert av språkets skjulte strukturer.",
    "Jeg studerer hvordan mennesker og språkmodeller oppfatter årsakssammenhenger, resonnerer og generaliserer utover det de har sett.",
    "Jeg ønsker å omsette vår forståelse av intelligens til nyttige systemer for forskning, medisin og bedre beslutninger."
  ]},
  { id: "sv", name: "Swedish", native: "Svenska", dir: "ltr", lines: [
    "Jag är Yingjie Xiao, student i datorlingvistik, fascinerad av språkets dolda strukturer.",
    "Jag studerar hur människor och språkmodeller uppfattar orsakssamband, resonerar och generaliserar bortom det de har sett.",
    "Jag vill omvandla vår förståelse av intelligens till användbara system för forskning, medicin och bättre beslutsfattande."
  ]},
  { id: "ru", name: "Russian", native: "Русский", dir: "ltr", lines: [
    "Я Yingjie Xiao, студент компьютерной лингвистики, увлечённый скрытыми структурами языка.",
    "Я изучаю, как люди и языковые модели воспринимают причинность, рассуждают и обобщают за пределами увиденного.",
    "Я хочу превращать наше понимание интеллекта в полезные системы для науки, медицины и принятия более обоснованных решений."
  ]},
  { id: "nl", name: "Dutch", native: "Nederlands", dir: "ltr", lines: [
    "Ik ben Yingjie Xiao, student computationele taalkunde, gefascineerd door de verborgen structuren van taal.",
    "Ik onderzoek hoe mensen en taalmodellen causaliteit waarnemen, redeneren en generaliseren voorbij wat ze hebben gezien.",
    "Ik wil ons begrip van intelligentie omzetten in bruikbare systemen voor onderzoek, geneeskunde en betere besluitvorming."
  ]},
  { id: "it", name: "Italian", native: "Italiano", dir: "ltr", lines: [
    "Sono Yingjie Xiao, studente di linguistica computazionale, affascinato dalle strutture nascoste del linguaggio.",
    "Studio come le persone e i modelli linguistici percepiscono la causalità, ragionano e generalizzano oltre ciò che hanno osservato.",
    "Voglio trasformare la nostra comprensione dell’intelligenza in sistemi utili per la ricerca, la medicina e decisioni migliori."
  ]},
  { id: "yue", name: "Cantonese", native: "粵語", dir: "ltr", lines: [
    "我係 Yingjie Xiao，一個讀計算語言學、對語言背後隱藏結構好着迷嘅學生。",
    "我研究人類同語言模型點樣理解因果關係、推理，同埋將學到嘅嘢應用喺未見過嘅情境。",
    "我希望將我哋對智能嘅理解，轉化成幫助科研、醫療同作出更好決策嘅實用系統。"
  ]}
];

document.addEventListener("DOMContentLoaded", () => {
  const picker = document.querySelector("[data-language-picker]");
  const list = document.querySelector("[data-language-list]");
  const view = document.querySelector("[data-sentence-view]");
  const sentence = document.querySelector("[data-sentence]");
  const languageName = document.querySelector("[data-language-name]");
  const count = document.querySelector("[data-sentence-count]");
  const next = document.querySelector("[data-continue]");
  let selected = null;
  let sentenceIndex = 0;

  languages.forEach((language) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "language-option";
    button.textContent = language.native;
    button.lang = language.id;
    button.dir = language.dir;
    button.setAttribute("aria-label", `Continue in ${language.name}`);
    button.addEventListener("click", () => selectLanguage(language));
    list.appendChild(button);
  });

  function selectLanguage(language) {
    selected = language;
    sentenceIndex = 0;
    picker.hidden = true;
    view.hidden = false;
    renderSentence();
  }

  function renderSentence() {
    sentence.textContent = selected.lines[sentenceIndex];
    sentence.lang = selected.id;
    sentence.dir = selected.dir;
    languageName.textContent = `${selected.native} · ${selected.name}`;
    count.textContent = `${sentenceIndex + 1} / 3`;
  }

  function continueJourney() {
    if (sentenceIndex === 2) {
      window.location.href = "/";
      return;
    }
    sentenceIndex += 1;
    renderSentence();
    if (view.animate && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      sentence.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, easing: "ease-out" });
    }
  }

  next.addEventListener("click", continueJourney);
  document.addEventListener("keydown", (event) => {
    if (!view.hidden && (event.key === "ArrowRight" || event.key === "Enter")) continueJourney();
  });
});
