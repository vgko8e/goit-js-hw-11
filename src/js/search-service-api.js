import axios from 'axios';

const API_KEY = '27630565-ae829fe43486fa4669a79051b';
const BASE_URL = 'https://pixabay.com/api/'

export default class SearchApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchItems() {
        const option = new URLSearchParams({
            key: API_KEY,
            q: `${this.searchQuery}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: 'true',
            per_page: '40',
            page: `${this.page}`,
        })

        const pictures = await axios.get(`${BASE_URL}?${option}`);
        return pictures.data;
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}