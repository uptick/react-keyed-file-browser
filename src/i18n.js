import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import messages_br from "./translate/messages_pt-BR.json"
import messages_es from "./translate/messages_es.json"
import messages_en from "./translate/messages_en.json"

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    "es": {
      translations: messages_es
    },
    "en": {
      translations: messages_en
    },
    "pt-BR": {
      translations: messages_br
    }
  },
  fallbackLng: "en",
  debug: false,

  // have a common namespace used around the full app
  ns: ["translations"],
  defaultNS: "translations",

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ","
  },

  react: {
    wait: true
  }
})

export default i18n