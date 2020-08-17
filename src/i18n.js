import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import messagesPtBr from './translate/messages_pt-BR.json'
import messagesEs from './translate/messages_es.json'
import messagesEn from './translate/messages_en.json'

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    es: {
      translations: messagesEs,
    },
    en: {
      translations: messagesEn,
    },
    'pt-BR': {
      translations: messagesPtBr,
    },
  },
  fallbackLng: 'en',
  debug: false,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ',',
  },

  react: {
    wait: true,
  },
})

export default i18n
