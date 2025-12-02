import { useTranslation } from "react-i18next";

export function useI18n() {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    return { t, i18n, changeLanguage };
}