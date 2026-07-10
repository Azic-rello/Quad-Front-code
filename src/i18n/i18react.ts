import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uz from "./locales/uz.json";
import ru from "./locales/ru.json";
import en from "./locales/en.json";

const savedLanguage = localStorage.getItem("language");

const browserLanguage = navigator.language.split("-")[0];

const language =
  savedLanguage && ["uz", "ru", "en"].includes(savedLanguage)
    ? savedLanguage
    : ["uz", "ru", "en"].includes(browserLanguage)
      ? browserLanguage
      : "uz";

i18n.use(initReactI18next).init({
  resources: {
    uz: {
      translation: uz,
    },
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },

  lng: language,

  fallbackLng: "uz",

  supportedLngs: ["uz", "ru", "en"],

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});

export default i18n;
