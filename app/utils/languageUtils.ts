const languageMap: { [key: string]: string } = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  zh: "Chinese",
  ms: "Bahasa Malaysia",
};

export function getFullLanguageName(languageCode: string): string {
  return languageMap[languageCode] || languageCode;
}
