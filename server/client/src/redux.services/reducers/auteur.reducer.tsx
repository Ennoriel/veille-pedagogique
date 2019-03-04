import { auteurState } from "../constants/auteur.types";

const fakeAuteurState = {
	1: {
		nom: 'Victor Hugo Adjoint',
		pageYoutube: 'https://www.youtube.com/channel/UCbCWSXNQQnsyQhz3PiQxuyA',
	},
	2: {
		nom: 'Matthieu Balu',
		activite: 'Journaliste vidéo au Huffington Post.',
	},
	3: {
		nom: 'Caroline',
		activite: 'Auteure blog apprendre-reviser-memoriser.fr',
	},
	4: {
		nom: 'Zach Groshell',
		activite: 'international educators in Sudan',
		compteTwitter: '@mrzachg'
	}
}

export default (state: auteurState = fakeAuteurState, action: any) => {
    return state;
};