const DATE_OPTIONS = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const DATE_LANGUAGE = 'fr-FR';

export function toFrenchFormatDate(date: Date) {
    return date.toLocaleDateString(DATE_LANGUAGE, DATE_OPTIONS);
}