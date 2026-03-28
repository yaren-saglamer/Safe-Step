(function () {
  const TRUSTED_CONTACT_KEY = "safe-step-trusted-contact";
  const REQUEST_ENDPOINT = "/.netlify/functions/support";

  const elements = {
    textarea: document.getElementById("notes"),
    supportButton: document.getElementById("support-btn"),
    responseOutput: document.getElementById("response-output"),
    responseTools: document.getElementById("response-tools"),
    responseShorterBtn: document.getElementById("response-shorter-btn"),
    responseSofterBtn: document.getElementById("response-softer-btn"),
    responseDirectBtn: document.getElementById("response-direct-btn"),
    responseNextStepBtn: document.getElementById("response-next-step-btn"),
    actionHint: document.getElementById("action-hint"),
    contactHint: document.getElementById("contact-hint"),
    subtitleText: document.getElementById("subtitle-text"),
    supportWhisperText: document.getElementById("support-whisper-text"),
    modeLabel: document.getElementById("mode-label"),
    responseHeadingText: document.getElementById("response-heading-text"),
    responseToolsLabel: document.getElementById("response-tools-label"),
    urgentPanel: document.getElementById("urgent-panel"),
    urgentPanelTitleText: document.getElementById("urgent-panel-title-text"),
    urgentPanelText: document.getElementById("urgent-panel-text"),
    urgentPanelHelpBtn: document.getElementById("urgent-panel-help"),
    urgentPanelTextContactBtn: document.getElementById("urgent-panel-text-contact"),
    actionsTitle: document.getElementById("actions-title"),
    readyTextBtn: document.getElementById("action-ready-text"),
    findSupportBtn: document.getElementById("action-find-support"),
    emergencyHelpBtn: document.getElementById("action-emergency-help"),
    contactTitle: document.getElementById("contact-title"),
    contactCopyText: document.getElementById("contact-copy-text"),
    trustedContactNameInput: document.getElementById("trusted-contact-name"),
    trustedContactPhoneInput: document.getElementById("trusted-contact-phone"),
    saveContactBtn: document.getElementById("save-contact-btn"),
    textContactBtn: document.getElementById("text-contact-btn"),
    callContactBtn: document.getElementById("call-contact-btn"),
    whatsappContactBtn: document.getElementById("whatsapp-contact-btn"),
    groundingTitle: document.getElementById("grounding-title"),
    groundingCopyText: document.getElementById("grounding-copy-text"),
    groundingStartBtn: document.getElementById("grounding-start-btn"),
    groundingStopBtn: document.getElementById("grounding-stop-btn"),
    groundingPanel: document.getElementById("grounding-panel"),
    groundingTimer: document.getElementById("grounding-timer"),
    groundingStepText: document.getElementById("grounding-step-text"),
    suggestionsTitle: document.getElementById("suggestions-title"),
    suggestionsCopyText: document.getElementById("suggestions-copy-text"),
    suggestionsHint: document.getElementById("suggestions-hint"),
    suggestionWalkBtn: document.getElementById("suggestion-walk-btn"),
    suggestionWalkTitle: document.getElementById("suggestion-walk-title"),
    suggestionWalkText: document.getElementById("suggestion-walk-text"),
    suggestionWaterBtn: document.getElementById("suggestion-water-btn"),
    suggestionWaterTitle: document.getElementById("suggestion-water-title"),
    suggestionWaterText: document.getElementById("suggestion-water-text"),
    suggestionWindowBtn: document.getElementById("suggestion-window-btn"),
    suggestionWindowTitle: document.getElementById("suggestion-window-title"),
    suggestionWindowText: document.getElementById("suggestion-window-text"),
    suggestionShouldersBtn: document.getElementById("suggestion-shoulders-btn"),
    suggestionShouldersTitle: document.getElementById("suggestion-shoulders-title"),
    suggestionShouldersText: document.getElementById("suggestion-shoulders-text"),
    sideQuoteLeft: document.getElementById("side-quote-left"),
    sideQuoteRight: document.getElementById("side-quote-right"),
    modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
  };

  const uiLanguage = detectUiLanguage();
  const supportInfo = getSupportInfo(uiLanguage);

  const state = {
    selectedMode: null,
    lastUserText: "",
    groundingTimerId: null,
    groundingTimeLeft: 60,
  };

  const translations = {
    en: {
      subtitle: "A quiet place to pause, steady yourself, and reach real support.",
      whisper: "Pause here. Reach someone real.",
      modeLabel: "What do you need right now?",
      modes: {
        calm_down: "Calm down",
        overwhelmed: "Overwhelmed",
        confused: "Confused",
        talk: "Talk",
      },
      textareaPlaceholder: "Write what feels heaviest right now. You do not need to explain it perfectly.",
      textareaLabel: "Your message",
      supportBtn: "Get Support",
      loading: "Getting support...",
      responseHeading: "Response",
      responseToolsLabel: "Adjust this reply",
      responseShorter: "Shorter",
      responseSofter: "Softer",
      responseDirect: "More direct",
      responseNextStep: "Next step only",
      urgentTitle: "This feels important right now.",
      urgentHelp: "Get urgent help",
      urgentTextContact: "Text trusted contact",
      actionsTitle: "Take one safe next step",
      readyText: "Send a ready text",
      findSupport: "Find support near me",
      urgentNeed: "I need urgent help",
      contactTitle: "Trusted contact",
      contactCopy: "Save one person you can reach quickly when words are hard.",
      contactNamePlaceholder: "Contact name",
      contactPhonePlaceholder: "Phone number",
      saveContact: "Save contact",
      textSavedContact: "Text saved contact",
      callSavedContact: "Call saved contact",
      whatsappSavedContact: "WhatsApp saved contact",
      quoteLeft: "You do not have to carry this alone tonight.",
      quoteRight: "One safe step is enough for now.",
      emptyWarning: "Please write something in the box above before getting support.",
      genericError: "Something went wrong. Please try again.",
      serviceUnavailable: "Support is not configured yet. Add your server-side API key and redeploy.",
      readyTextMessage:
        "I'm having a really hard time right now and I don't want to be alone with it. Can you stay with me or call me when you can?",
      readyTextHint:
        "A short text is enough. You do not need to explain everything to ask someone to stay with you.",
      saveContactMissing: "Add both a name and phone number so this is ready when you need it.",
      saveContactDone: " is saved as your trusted contact.",
      saveContactFirst: "Save a trusted contact first so you can text them in one tap.",
      callContactFirst: "Save a trusted contact first so you can call them quickly.",
      whatsappContactFirst: "Save a trusted contact first so you can open WhatsApp in one tap.",
      openingMessageFor: "Opening a message for ",
      openingCallFor: "Calling ",
      openingWhatsappFor: "Opening WhatsApp for ",
      trustedContactFallback: "your trusted contact",
      shortMessageEnough: ". A short message is enough.",
      supportSearchPrefix: "Looking for support in ",
      supportSearchSuffix:
        ". If this feels urgent, do not wait for the perfect option. Reach a helpline or local support now.",
      urgentFollowup:
        "What you wrote sounds serious. Please use the urgent help option or bring in a real person right now.",
      urgentPanelFollowup:
        " You can also text your trusted contact now if reaching out feels easier than calling.",
      groundingTitle: "60-second reset",
      groundingCopy: "If everything feels too loud, use one quiet minute to come back to this moment.",
      groundingStart: "Start grounding",
      groundingStop: "Stop",
      groundingComplete:
        "That minute is done. You do not have to solve everything now. Just choose one safe next step.",
      suggestionsTitle: "Gentle ideas for right now",
      suggestionsCopy:
        "If reaching out feels like too much, try one very small action that softens the next few minutes.",
      suggestionWalkTitle: "Take a short walk",
      suggestionWalkText: "Even two quiet minutes can loosen the feeling a little.",
      suggestionWaterTitle: "Drink cold water",
      suggestionWaterText: "A simple body cue can interrupt the spiral for a moment.",
      suggestionWindowTitle: "Go near a window",
      suggestionWindowText: "Change the room around you before asking your mind to change.",
      suggestionShouldersTitle: "Drop your shoulders",
      suggestionShouldersText: "Release a little tension first. You do not need to solve everything yet.",
      suggestionWalkHint: "Keep it tiny. Just standing up and walking to the door counts.",
      suggestionWaterHint: "Slow your body first. A few sips are enough.",
      suggestionWindowHint: "A small change in light and air can help your mind unstick a little.",
      suggestionShouldersHint: "Let your jaw unclench too if you notice it holding tight.",
    },
    tr: {
      subtitle: "Durup nefes alabilecegin, kendini toparlayip gercek destege uzanabilecegin sakin bir alan.",
      whisper: "Burada dur. Gercek birine ulas.",
      modeLabel: "Su anda en cok neye ihtiyacin var?",
      modes: {
        calm_down: "Sakinlesmek",
        overwhelmed: "Bunalmisim",
        confused: "Kafam karisik",
        talk: "Konusmak",
      },
      textareaPlaceholder: "Su an en agir gelen seyi yaz. Kusursuz anlatmak zorunda degilsin.",
      textareaLabel: "Mesajin",
      supportBtn: "Destek Al",
      loading: "Destek hazirlaniyor...",
      responseHeading: "Yanit",
      responseToolsLabel: "Bu yaniti yeniden ayarla",
      responseShorter: "Kisalt",
      responseSofter: "Daha yumusak",
      responseDirect: "Daha net",
      responseNextStep: "Sadece sonraki adim",
      urgentTitle: "Bu an onemli gorunuyor.",
      urgentHelp: "Acil destek bul",
      urgentTextContact: "Guvendigim kisiye yaz",
      actionsTitle: "Guvenli bir sonraki adimi sec",
      readyText: "Hazir mesaj gonder",
      findSupport: "Yakinimda destek bul",
      urgentNeed: "Acil yardima ihtiyacim var",
      contactTitle: "Guvendigim kisi",
      contactCopy: "Kelimeler zor geldiginde hizlica ulasabilecegin bir kisiyi kaydet.",
      contactNamePlaceholder: "Kisi adi",
      contactPhonePlaceholder: "Telefon numarasi",
      saveContact: "Kisiyi kaydet",
      textSavedContact: "Kayitli kisiye mesaj at",
      callSavedContact: "Kayitli kisiyi ara",
      whatsappSavedContact: "WhatsApp ac",
      quoteLeft: "Bunu bu gece tek basina tasimak zorunda degilsin.",
      quoteRight: "Simdilik tek bir guvenli adim yeter.",
      emptyWarning: "Destek almadan once yukaridaki kutuya bir seyler yaz.",
      genericError: "Bir seyler ters gitti. Lutfen tekrar dene.",
      serviceUnavailable: "Destek henuz yapilandirilmadi. Sunucu tarafi API anahtarini ekleyip yeniden deploy et.",
      readyTextMessage:
        "Su an gercekten cok zorlaniyorum ve bununla tek basima kalmak istemiyorum. Musaitsen benimle kalabilir misin ya da beni arayabilir misin?",
      readyTextHint:
        "Kisa bir mesaj yeterli. Birinden yaninda olmasini istemek icin her seyi aciklamak zorunda degilsin.",
      saveContactMissing: "Bu hazir dursun diye hem isim hem telefon numarasi ekle.",
      saveContactDone: " artik guvendigin kisi olarak kaydedildi.",
      saveContactFirst: "Tek dokunusla mesaj atabilmek icin once guvendigin kisiyi kaydet.",
      callContactFirst: "Hizlica arayabilmek icin once guvendigin kisiyi kaydet.",
      whatsappContactFirst: "Tek dokunusla WhatsApp acmak icin once guvendigin kisiyi kaydet.",
      openingMessageFor: "Su kisiye mesaj aciliyor: ",
      openingCallFor: "Su kisi araniyor: ",
      openingWhatsappFor: "Su kisi icin WhatsApp aciliyor: ",
      trustedContactFallback: "guvendigin kisi",
      shortMessageEnough: ". Kisa bir mesaj yeterli.",
      supportSearchPrefix: "Su bolge icin destek araniyor: ",
      supportSearchSuffix:
        ". Bu acil geliyorsa mukemmel secenegi bekleme; bir hat ya da yerel destekle simdi baglanti kur.",
      urgentFollowup:
        "Yazdiklarin ciddi gorunuyor. Lutfen acil yardim secenegini kullan ya da hemen gercek birini devreye sok.",
      urgentPanelFollowup:
        " Aramak zor geliyorsa guvendigin kisiye simdi mesaj atmayi da secebilirsin.",
      groundingTitle: "60 saniyelik toparlanma",
      groundingCopy: "Her sey cok gurultulu geliyorsa, bu ana donmek icin sessiz bir dakikayi kullan.",
      groundingStart: "Baslat",
      groundingStop: "Durdur",
      groundingComplete:
        "Bu bir dakika bitti. Simdi her seyi cozmek zorunda degilsin. Sadece tek bir guvenli adim sec.",
      suggestionsTitle: "Su an icin yumusak oneriler",
      suggestionsCopy:
        "Birine ulasmak su an cok geliyorsa, onundeki birkac dakikayi biraz yumusatacak tek kucuk seyi sec.",
      suggestionWalkTitle: "Kisa bir yuruyus yap",
      suggestionWalkText: "Sessizce atacagin iki dakika bile yuku biraz gevetebilir.",
      suggestionWaterTitle: "Soguk su ic",
      suggestionWaterText: "Bedene gelen basit bir sinyal donguyu bir anligina kesebilir.",
      suggestionWindowTitle: "Bir pencereye yaklas",
      suggestionWindowText: "Zihninin degismesini istemeden once odanin hissini biraz degistir.",
      suggestionShouldersTitle: "Omuzlarini birak",
      suggestionShouldersText: "Once biraz gerginligi coz. Su an her seyi cozmek zorunda degilsin.",
      suggestionWalkHint: "Bunu kucucuk tut. Sadece kalkip kapiya kadar yurumen bile sayilir.",
      suggestionWaterHint: "Once bedenini yavaslat. Birkac yudum yeter.",
      suggestionWindowHint: "Isik ve hava degisimi zihninin biraz cozulmesine yardim edebilir.",
      suggestionShouldersHint: "Fark edersen ceneni de biraz serbest birak.",
    },
  };

  const groundingSteps = {
    en: [
      "Sit back if you can. Let your shoulders drop a little.",
      "Notice five things you can see without rushing.",
      "Let one slower breath leave your body. No need to force it.",
      "Feel where your feet, legs, or back touch something solid.",
      "Stay only with the next safe minute. Then choose one small step.",
    ],
    tr: [
      "Mumkunse biraz arkana yaslan. Omuzlarini biraz birak.",
      "Acele etmeden gorebildigin bes seyi fark et.",
      "Bir tane daha yavas nefes ver. Zorlaman gerekmiyor.",
      "Ayaklarinin, bacaklarinin ya da sirtinin temas ettigi saglam yeri hisset.",
      "Sadece onundeki guvenli bir dakikada kal. Sonra tek kucuk adimi sec.",
    ],
  };

  function detectUiLanguage() {
    const language = (navigator.language || "").toLowerCase();
    return language.startsWith("tr") ? "tr" : "en";
  }

  function t(key) {
    return translations[uiLanguage][key];
  }

  function getModeLabel(mode) {
    return translations[uiLanguage].modes[mode];
  }

  function detectMessageLanguage(userText) {
    const text = userText.toLowerCase();
    const turkishSignals =
      /[çğıöşü]/.test(text) ||
      text.includes("cok") ||
      text.includes("çok") ||
      text.includes("yardim") ||
      text.includes("yardım") ||
      text.includes("intihar") ||
      text.includes("istemiyorum");

    return turkishSignals ? "tr" : uiLanguage;
  }

  function detectRiskLevel(userText) {
    const text = userText.toLowerCase();
    const highRiskPatterns = [
      "kill myself",
      "end my life",
      "want to die",
      "don't want to live",
      "dont want to live",
      "suicide",
      "hurt myself",
      "harm myself",
      "self harm",
      "not be here anymore",
      "can't go on",
      "can’t go on",
      "intihar",
      "kendimi oldur",
      "kendimi öldür",
      "yasamak istemiyorum",
      "yasamak istemiyorum",
      "yasamak istemiyorum",
      "yasamak istemiyorum",
      "olmek istiyorum",
      "ölmek istiyorum",
    ];

    for (let i = 0; i < highRiskPatterns.length; i += 1) {
      if (text.includes(highRiskPatterns[i])) {
        return "high";
      }
    }

    return "low_or_medium";
  }

  function getModePrompt(mode) {
    switch (mode) {
      case "calm_down":
        return [
          "Selected mode: Calm down.",
          "Use a slower, grounding, calming tone.",
          "Encourage slowing down, lowering intensity, and staying with one small step.",
        ].join("\n");
      case "overwhelmed":
        return [
          "Selected mode: Overwhelmed.",
          "Use a supportive, simplifying tone.",
          "Make the next step feel manageable and small.",
        ].join("\n");
      case "confused":
        return [
          "Selected mode: Confused.",
          "Use a clarifying tone.",
          "Help the user name what they may be feeling without sounding clinical.",
        ].join("\n");
      case "talk":
        return [
          "Selected mode: Talk.",
          "Use a more conversational tone.",
          "Gently invite the user to keep writing.",
        ].join("\n");
      default:
        return "No mode selected. Use a general supportive tone.";
    }
  }

  function getRiskPrompt(userText) {
    if (detectRiskLevel(userText) === "high") {
      return [
        "Risk level: high.",
        "Use direct, warm, human language.",
        "Acknowledge seriousness clearly.",
        "Encourage immediate contact with a real person, emergency services, or a crisis helpline now.",
      ].join("\n");
    }

    return [
      "Risk level: low_or_medium.",
      "Focus on emotional regulation, feeling understood, and one realistic next step.",
    ].join("\n");
  }

  function getRefinementPrompt(variant) {
    switch (variant) {
      case "shorter":
        return uiLanguage === "tr"
          ? "Yaniti daha kisa tut. Sicakligi koru."
          : "Make the reply shorter while keeping the same warmth.";
      case "softer":
        return uiLanguage === "tr"
          ? "Yaniti biraz daha yumusak ve nazik yap."
          : "Make the reply a little softer and gentler.";
      case "direct":
        return uiLanguage === "tr"
          ? "Yaniti biraz daha net ve yonlendirici yap."
          : "Make the reply a little more direct and action-oriented.";
      case "next_step":
        return uiLanguage === "tr"
          ? "Yaniti tek bir guvenli sonraki adima odakla."
          : "Focus the reply on a single safe next step.";
      default:
        return "";
    }
  }

  function getResponseLanguagePrompt(userText) {
    return detectMessageLanguage(userText) === "tr"
      ? "Respond in Turkish. Use natural Turkish."
      : "Respond in English. Use natural conversational English.";
  }

  function buildPrompt(userText, mode, variant) {
    return [
      getResponseLanguagePrompt(userText),
      "",
      getModePrompt(mode),
      "",
      getRiskPrompt(userText),
      "",
      getRefinementPrompt(variant),
      "",
      "User message:",
      userText,
    ].join("\n");
  }

  function getSupportInfo(language) {
    const browserLanguage = (navigator.language || "").toLowerCase();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";

    if (browserLanguage.startsWith("tr") || timeZone === "Europe/Istanbul") {
      return {
        regionLabel: language === "tr" ? "Turkiye" : "Turkey",
        emergencySearchUrl:
          "https://www.google.com/search?q=112+acil+ruh+sagligi+yardimi+turkiye",
        supportSearchUrl:
          "https://www.google.com/search?q=ruh+sagligi+destek+hatti+yaknimda+turkiye",
        urgentMessage:
          language === "tr"
            ? "Turkiye'deysen ve guvende degilsen simdi 112'yi ara ya da hemen yanina gercek birini al."
            : "If you are in Turkey and you are not safe, call 112 now or get a real person with you right away.",
      };
    }

    if (browserLanguage.startsWith("en-us")) {
      return {
        regionLabel: "United States",
        emergencySearchUrl: "https://www.google.com/search?q=988+suicide+and+crisis+lifeline",
        supportSearchUrl: "https://www.google.com/search?q=mental+health+support+near+me",
        urgentMessage:
          language === "tr"
            ? "ABD'deysen ve guvende degilsen simdi 988'i ara ya da mesaj at; acil tehlike varsa 911'i ara."
            : "If you are in the United States and you are not safe, call or text 988 now. Call 911 if there is immediate danger.",
      };
    }

    return {
      regionLabel: language === "tr" ? "bulundugun bolge" : "your area",
      emergencySearchUrl: "https://www.google.com/search?q=emergency+mental+health+help+near+me",
      supportSearchUrl: "https://www.google.com/search?q=mental+health+support+near+me",
      urgentMessage:
        language === "tr"
          ? "Guvende degilsen simdi yerel acil yardim ya da kriz hatti ile baglanti kur ve gercek birini devreye sok."
          : "If you are not safe, contact local emergency support or a crisis line now and bring in a real person.",
    };
  }

  function getTrustedContact() {
    try {
      const raw = localStorage.getItem(TRUSTED_CONTACT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function setTrustedContact(contact) {
    localStorage.setItem(TRUSTED_CONTACT_KEY, JSON.stringify(contact));
  }

  function hydrateTrustedContact() {
    const contact = getTrustedContact();
    if (!contact) {
      return;
    }

    elements.trustedContactNameInput.value = contact.name || "";
    elements.trustedContactPhoneInput.value = contact.phone || "";
  }

  function showActionHint(message) {
    elements.actionHint.hidden = false;
    elements.actionHint.textContent = message;
  }

  function showContactHint(message) {
    elements.contactHint.hidden = false;
    elements.contactHint.textContent = message;
  }

  function hideUrgentPanel() {
    elements.urgentPanel.hidden = true;
    document.body.classList.remove("high-risk-mode");
  }

  function showUrgentPanel(message) {
    elements.urgentPanelText.textContent = message;
    elements.urgentPanel.hidden = false;
    document.body.classList.add("high-risk-mode");
  }

  function openSmsDraft(phone, message) {
    const target = phone ? encodeURIComponent(phone) : "";
    const body = message || t("readyTextMessage");
    window.location.href = "sms:" + target + "?&body=" + encodeURIComponent(body);
  }

  function openCall(phone) {
    window.location.href = "tel:" + phone.replace(/\s+/g, "");
  }

  function openWhatsApp(phone) {
    const sanitized = phone.replace(/[^\d+]/g, "").replace(/^\+/, "");
    window.open(
      "https://wa.me/" + sanitized + "?text=" + encodeURIComponent(t("readyTextMessage")),
      "_blank",
      "noopener,noreferrer"
    );
  }

  function sendTextToTrustedContact() {
    const contact = getTrustedContact();
    if (!contact || !contact.phone) {
      showContactHint(t("saveContactFirst"));
      return;
    }

    openSmsDraft(contact.phone);
    showContactHint(
      t("openingMessageFor") +
        (contact.name || t("trustedContactFallback")) +
        t("shortMessageEnough")
    );
  }

  function callTrustedContact() {
    const contact = getTrustedContact();
    if (!contact || !contact.phone) {
      showContactHint(t("callContactFirst"));
      return;
    }

    showContactHint(t("openingCallFor") + (contact.name || t("trustedContactFallback")));
    openCall(contact.phone);
  }

  function openWhatsAppForTrustedContact() {
    const contact = getTrustedContact();
    if (!contact || !contact.phone) {
      showContactHint(t("whatsappContactFirst"));
      return;
    }

    showContactHint(t("openingWhatsappFor") + (contact.name || t("trustedContactFallback")));
    openWhatsApp(contact.phone);
  }

  function setGroundingState(isActive) {
    elements.groundingPanel.hidden = !isActive;
    elements.groundingStopBtn.hidden = !isActive;
    elements.groundingStartBtn.hidden = isActive;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");
  }

  function getGroundingStep(secondsLeft) {
    const steps = groundingSteps[uiLanguage];
    const index = Math.min(steps.length - 1, Math.floor((60 - secondsLeft) / 12));
    return steps[index];
  }

  function stopGrounding(showCompletionHint) {
    if (state.groundingTimerId) {
      window.clearInterval(state.groundingTimerId);
      state.groundingTimerId = null;
    }

    state.groundingTimeLeft = 60;
    elements.groundingTimer.textContent = formatTime(state.groundingTimeLeft);
    elements.groundingStepText.textContent = "";
    setGroundingState(false);

    if (showCompletionHint) {
      showActionHint(t("groundingComplete"));
    }
  }

  function startGrounding() {
    stopGrounding(false);
    state.groundingTimeLeft = 60;
    elements.groundingTimer.textContent = formatTime(state.groundingTimeLeft);
    elements.groundingStepText.textContent = getGroundingStep(state.groundingTimeLeft);
    setGroundingState(true);

    state.groundingTimerId = window.setInterval(function () {
      state.groundingTimeLeft -= 1;
      elements.groundingTimer.textContent = formatTime(Math.max(state.groundingTimeLeft, 0));
      elements.groundingStepText.textContent = getGroundingStep(Math.max(state.groundingTimeLeft, 0));

      if (state.groundingTimeLeft <= 0) {
        stopGrounding(true);
      }
    }, 1000);
  }

  function showWarning(message) {
    elements.responseTools.hidden = true;
    elements.responseOutput.classList.add("warning");
    elements.responseOutput.classList.remove("is-visible");
    elements.responseOutput.innerHTML = "";
    elements.responseOutput.textContent = message;
  }

  function clearWarning() {
    elements.responseOutput.classList.remove("warning");
  }

  function renderReply(text) {
    const chunks = text
      .split(/\n\s*\n/)
      .map(function (chunk) {
        return chunk.trim();
      })
      .filter(Boolean);

    elements.responseOutput.classList.remove("is-visible");
    elements.responseOutput.innerHTML = "";

    if (!chunks.length) {
      showWarning(t("genericError"));
      return;
    }

    chunks.forEach(function (chunk) {
      const paragraph = document.createElement("p");
      paragraph.className = "response-paragraph";
      paragraph.textContent = chunk.replace(/\n/g, " ");
      elements.responseOutput.appendChild(paragraph);
    });

    void elements.responseOutput.offsetWidth;
    elements.responseOutput.classList.add("is-visible");
    elements.responseTools.hidden = false;
  }

  async function fetchSupportReply(userText, mode, variant) {
    const response = await fetch(REQUEST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: buildPrompt(userText, mode, variant),
      }),
    });

    const raw = await response.text();
    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (error) {
      throw new Error(t("serviceUnavailable"));
    }

    if (!response.ok) {
      throw new Error(data.error || t("serviceUnavailable"));
    }

    if (!data.reply) {
      throw new Error(t("genericError"));
    }

    return data.reply;
  }

  async function requestSupport(variant) {
    if (!state.lastUserText) {
      return;
    }

    elements.supportButton.disabled = true;
    clearWarning();
    elements.responseOutput.innerHTML = "";
    elements.responseOutput.textContent = t("loading");

    try {
      const reply = await fetchSupportReply(state.lastUserText, state.selectedMode, variant);
      renderReply(reply);
    } catch (error) {
      showWarning(error && error.message ? error.message : t("genericError"));
    } finally {
      elements.supportButton.disabled = false;
    }
  }

  function applyTranslations() {
    document.documentElement.lang = uiLanguage;
    elements.subtitleText.textContent = t("subtitle");
    elements.supportWhisperText.textContent = t("whisper");
    elements.modeLabel.textContent = t("modeLabel");
    elements.textarea.placeholder = t("textareaPlaceholder");
    elements.textarea.setAttribute("aria-label", t("textareaLabel"));
    elements.supportButton.textContent = t("supportBtn");
    elements.responseHeadingText.textContent = t("responseHeading");
    elements.responseToolsLabel.textContent = t("responseToolsLabel");
    elements.responseShorterBtn.textContent = t("responseShorter");
    elements.responseSofterBtn.textContent = t("responseSofter");
    elements.responseDirectBtn.textContent = t("responseDirect");
    elements.responseNextStepBtn.textContent = t("responseNextStep");
    elements.urgentPanelTitleText.textContent = t("urgentTitle");
    elements.urgentPanelHelpBtn.textContent = t("urgentHelp");
    elements.urgentPanelTextContactBtn.textContent = t("urgentTextContact");
    elements.actionsTitle.textContent = t("actionsTitle");
    elements.readyTextBtn.textContent = t("readyText");
    elements.findSupportBtn.textContent = t("findSupport");
    elements.emergencyHelpBtn.textContent = t("urgentNeed");
    elements.contactTitle.textContent = t("contactTitle");
    elements.contactCopyText.textContent = t("contactCopy");
    elements.trustedContactNameInput.placeholder = t("contactNamePlaceholder");
    elements.trustedContactPhoneInput.placeholder = t("contactPhonePlaceholder");
    elements.saveContactBtn.textContent = t("saveContact");
    elements.textContactBtn.textContent = t("textSavedContact");
    elements.callContactBtn.textContent = t("callSavedContact");
    elements.whatsappContactBtn.textContent = t("whatsappSavedContact");
    elements.groundingTitle.textContent = t("groundingTitle");
    elements.groundingCopyText.textContent = t("groundingCopy");
    elements.groundingStartBtn.textContent = t("groundingStart");
    elements.groundingStopBtn.textContent = t("groundingStop");
    elements.suggestionsTitle.textContent = t("suggestionsTitle");
    elements.suggestionsCopyText.textContent = t("suggestionsCopy");
    elements.suggestionWalkTitle.textContent = t("suggestionWalkTitle");
    elements.suggestionWalkText.textContent = t("suggestionWalkText");
    elements.suggestionWaterTitle.textContent = t("suggestionWaterTitle");
    elements.suggestionWaterText.textContent = t("suggestionWaterText");
    elements.suggestionWindowTitle.textContent = t("suggestionWindowTitle");
    elements.suggestionWindowText.textContent = t("suggestionWindowText");
    elements.suggestionShouldersTitle.textContent = t("suggestionShouldersTitle");
    elements.suggestionShouldersText.textContent = t("suggestionShouldersText");
    elements.sideQuoteLeft.textContent = t("quoteLeft");
    elements.sideQuoteRight.textContent = t("quoteRight");

    elements.modeButtons.forEach(function (button) {
      button.textContent = getModeLabel(button.getAttribute("data-mode"));
    });
  }

  function bindEvents() {
    elements.modeButtons.forEach(function (modeButton) {
      modeButton.addEventListener("click", function () {
        const wasActive = modeButton.classList.contains("is-active");

        elements.modeButtons.forEach(function (button) {
          button.classList.remove("is-active");
          button.setAttribute("aria-pressed", "false");
        });

        if (wasActive) {
          state.selectedMode = null;
          return;
        }

        modeButton.classList.add("is-active");
        modeButton.setAttribute("aria-pressed", "true");
        state.selectedMode = modeButton.getAttribute("data-mode");
      });
    });

    elements.supportButton.addEventListener("click", async function () {
      const text = elements.textarea.value.trim();
      const riskLevel = detectRiskLevel(text);

      clearWarning();
      hideUrgentPanel();
      state.lastUserText = text;

      if (!text) {
        showWarning(t("emptyWarning"));
        return;
      }

      await requestSupport("");

      if (riskLevel === "high" && !elements.responseOutput.classList.contains("warning")) {
        showUrgentPanel(supportInfo.urgentMessage + t("urgentPanelFollowup"));
        showActionHint(t("urgentFollowup"));
      }
    });

    elements.responseShorterBtn.addEventListener("click", function () {
      requestSupport("shorter");
    });

    elements.responseSofterBtn.addEventListener("click", function () {
      requestSupport("softer");
    });

    elements.responseDirectBtn.addEventListener("click", function () {
      requestSupport("direct");
    });

    elements.responseNextStepBtn.addEventListener("click", function () {
      requestSupport("next_step");
    });

    elements.readyTextBtn.addEventListener("click", function () {
      openSmsDraft("", t("readyTextMessage"));
      showActionHint(t("readyTextHint"));
    });

    elements.findSupportBtn.addEventListener("click", function () {
      window.open(supportInfo.supportSearchUrl, "_blank", "noopener,noreferrer");
      showActionHint(t("supportSearchPrefix") + supportInfo.regionLabel + t("supportSearchSuffix"));
    });

    elements.emergencyHelpBtn.addEventListener("click", function () {
      window.open(supportInfo.emergencySearchUrl, "_blank", "noopener,noreferrer");
      showActionHint(supportInfo.urgentMessage);
    });

    elements.urgentPanelHelpBtn.addEventListener("click", function () {
      elements.emergencyHelpBtn.click();
    });

    elements.urgentPanelTextContactBtn.addEventListener("click", function () {
      sendTextToTrustedContact();
    });

    elements.saveContactBtn.addEventListener("click", function () {
      const name = elements.trustedContactNameInput.value.trim();
      const phone = elements.trustedContactPhoneInput.value.trim();

      if (!name || !phone) {
        showContactHint(t("saveContactMissing"));
        return;
      }

      setTrustedContact({ name: name, phone: phone });
      showContactHint(name + t("saveContactDone"));
    });

    elements.textContactBtn.addEventListener("click", function () {
      sendTextToTrustedContact();
    });

    elements.callContactBtn.addEventListener("click", function () {
      callTrustedContact();
    });

    elements.whatsappContactBtn.addEventListener("click", function () {
      openWhatsAppForTrustedContact();
    });

    elements.groundingStartBtn.addEventListener("click", function () {
      startGrounding();
    });

    elements.groundingStopBtn.addEventListener("click", function () {
      stopGrounding(false);
    });

    elements.suggestionWalkBtn.addEventListener("click", function () {
      elements.suggestionsHint.hidden = false;
      elements.suggestionsHint.textContent = t("suggestionWalkHint");
    });

    elements.suggestionWaterBtn.addEventListener("click", function () {
      elements.suggestionsHint.hidden = false;
      elements.suggestionsHint.textContent = t("suggestionWaterHint");
    });

    elements.suggestionWindowBtn.addEventListener("click", function () {
      elements.suggestionsHint.hidden = false;
      elements.suggestionsHint.textContent = t("suggestionWindowHint");
    });

    elements.suggestionShouldersBtn.addEventListener("click", function () {
      elements.suggestionsHint.hidden = false;
      elements.suggestionsHint.textContent = t("suggestionShouldersHint");
    });
  }

  applyTranslations();
  hydrateTrustedContact();
  hideUrgentPanel();
  setGroundingState(false);
  bindEvents();
})();
