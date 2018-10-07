import axios from 'axios';

function getPersons() {
    return axios.get(`https://jsonplaceholder.typicode.com/users`);
}

export default getPersons;