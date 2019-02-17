/**
 * Ajoute un attribut à un objet de recherche
 * pour rechercher un terme dans une chaine de caractère sans tenir compte de la casse
 * @param paramObject objet de recherche
 * @param paramKey clef de recherche
 * @param paramValue valeur à rechercher
 */
export function addRegexParam(paramObject: any, paramKey: string, paramValue: string) {
    if(paramValue) {
        paramObject[paramKey] = {
            '$regex': paramValue,
            '$options': 'i'
        };
    }
}

/**
 * Ajoute une liste d'attributs à un objet de recherche
 * pour rechercher plusieurs termes dans dans une liste
 * @param paramObject objet de recherche
 * @param paramKey clef de recherche
 * @param paramValues valeurs à rechercher
 */
export function addRegexParams(paramObject: any, paramKey: string, paramValues: [string]) {
    if(paramValues) {
        paramObject[paramKey] = {
            $in: paramValues.map(paramValue => paramValue.trim())
        };
    }
}

/**
 * Ajoute un attribut à un objet de recherche
 * pour rechercher un date postérieure à celle passée en paramètre
 * @param paramObject objet de recherche
 * @param paramKey clef de recherche
 * @param paramValue valeur à rechercher
 */
export function addAfterParam(paramObject: any, paramKey: string, paramValue: number) {
    if(paramValue) {
        paramObject[paramKey] = {
            '$gte': paramValue
        };
    }
}
