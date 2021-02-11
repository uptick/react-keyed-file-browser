import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import de from "./i18n/de.json";
import en from "./i18n/en.json";
import no_NB from "./i18n/no_NB.json";

import deLocale from "date-fns/locale/de";
import enLocale from "date-fns/locale/en-US";
import noNbLocale from "date-fns/locale/nb";

export const LOCALES = {
  EN: "en",
  DE: "de",
  NO_NB: "no_NB",
};

const resources = {
  en: { translation: en },
  de: { translation: de },
  no_NB: { translation: no_NB },
};

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export function getDateFnsLocale() {
  const currentLang = i18n.language;

  if (currentLang === LOCALES.DE) {
    return deLocale;
  } else if (currentLang === LOCALES.NO_NB) {
    return noNbLocale;
  }

  return enLocale;
}
