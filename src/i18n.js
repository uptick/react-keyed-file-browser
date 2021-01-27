import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'
import de from './i18n/de.json'
import en from './i18n/en.json'

export const LOCALES =
  {
    EN: 'en',
    DE: 'de',
  }

const resources = {
  en: { translation: en },
  de: { translation: de },
}

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  })

export default i18n
