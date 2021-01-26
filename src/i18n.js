import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// the translations
// (tip move them in a JSON file and import them)

function parseJsonFile(path) {
  const request = new XMLHttpRequest()
  request.open('GET', path, false)
  request.send(null)
  return JSON.parse(request.responseText)
}

const resources = {
  en: parseJsonFile('./i18n/en.json'),
  de: parseJsonFile('./i18n/de.json'),
}

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'de',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
