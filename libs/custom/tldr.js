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
  { id: "zh", name: "Mandarin Chinese", native: "普通话", dir: "ltr", lines: [
    "我是 Yingjie Xiao，一名计算语言学学生，着迷于语言背后的隐藏结构。",
    "我研究人类和语言模型如何感知因果关系、进行推理，并将所学推广到未见过的情境。",
    "我希望把我们对智能的理解转化为服务科研、医疗和更好决策的实用系统。"
  ]},
  { id: "ja", name: "Japanese", native: "日本語", dir: "ltr", lines: [
    "私は Yingjie Xiao です。言語の隠れた構造に魅了されている計算言語学の学生です。",
    "人間と言語モデルが因果関係をどう捉え、推論し、未知の状況へ一般化するのかを研究しています。",
    "知能への理解を、研究・医療・より良い意思決定に役立つシステムへつなげたいと考えています。"
  ]},
  { id: "ko", name: "Korean", native: "한국어", dir: "ltr", lines: [
    "저는 언어의 숨은 구조에 매료된 전산언어학도 Yingjie Xiao입니다.",
    "인간과 언어 모델이 인과관계를 어떻게 인식하고 추론하며, 경험하지 않은 상황으로 일반화하는지 연구합니다.",
    "지능에 대한 이해를 연구와 의료, 더 나은 의사결정에 유용한 시스템으로 발전시키고 싶습니다."
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
  { id: "ar", name: "Arabic", native: "العربية", dir: "rtl", lines: [
    "أنا Yingjie Xiao، طالب في اللسانيات الحاسوبية، ومفتون بالبُنى الخفية للغة.",
    "أدرس كيف يدرك البشر ونماذج اللغة السببية، وكيف يستدلون ويعمّمون إلى ما وراء ما شاهدوه.",
    "أريد أن أحوّل فهمنا للذكاء إلى أنظمة مفيدة للبحث والطب واتخاذ قرارات أفضل."
  ]},
  { id: "hi", name: "Hindi", native: "हिन्दी", dir: "ltr", lines: [
    "मैं Yingjie Xiao हूँ, संगणकीय भाषाविज्ञान का विद्यार्थी, और भाषा की छिपी संरचनाओं से आकर्षित हूँ।",
    "मैं अध्ययन करता हूँ कि मनुष्य और भाषा मॉडल कारणता को कैसे समझते हैं, तर्क करते हैं और देखी हुई चीज़ों से आगे सामान्यीकरण करते हैं।",
    "मैं बुद्धिमत्ता की हमारी समझ को शोध, चिकित्सा और बेहतर निर्णय लेने के लिए उपयोगी प्रणालियों में बदलना चाहता हूँ।"
  ]},
  { id: "sw", name: "Swahili", native: "Kiswahili", dir: "ltr", lines: [
    "Mimi ni Yingjie Xiao, mwanafunzi wa isimu kompyuta ninayevutiwa na miundo iliyofichika ya lugha.",
    "Ninachunguza jinsi binadamu na modeli za lugha zinavyotambua usababisho, kufikiri na kujumlisha zaidi ya yale walivyoona.",
    "Ninataka kugeuza uelewa wetu wa akili kuwa mifumo yenye manufaa kwa utafiti, tiba na maamuzi bora."
  ]},
  { id: "tr", name: "Turkish", native: "Türkçe", dir: "ltr", lines: [
    "Ben Yingjie Xiao; dilin gizli yapılarına ilgi duyan bir hesaplamalı dilbilim öğrencisiyim.",
    "İnsanların ve dil modellerinin nedenselliği nasıl algıladığını, akıl yürüttüğünü ve gördüklerinin ötesine nasıl genellediğini araştırıyorum.",
    "Zekâ anlayışımızı araştırma, tıp ve daha iyi karar verme için yararlı sistemlere dönüştürmek istiyorum."
  ]},
  { id: "fi", name: "Finnish", native: "Suomi", dir: "ltr", lines: [
    "Olen Yingjie Xiao, laskennallisen kielitieteen opiskelija, jota kielet ja niiden piilevät rakenteet kiehtovat.",
    "Tutkin, miten ihmiset ja kielimallit havaitsevat syy-yhteyksiä, päättelevät ja yleistävät näkemänsä ulkopuolelle.",
    "Haluan muuttaa ymmärryksemme älykkyydestä hyödyllisiksi järjestelmiksi tutkimukseen, lääketieteeseen ja parempaan päätöksentekoon."
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
