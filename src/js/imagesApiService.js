import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

export default class ImagesApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';

    const searchParam = new URLSearchParams({
      key: '28168095-f0304d55a0b5c15c6597d0047',
      q: this.searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: this.page,
      per_page: 40,
    });

    return axios
      .get(`${BASE_URL}?${searchParam}`)
      .then(response => {
        if (response.status !== 200) {
          return Promise.reject(`Error: ${response.message}`);
        }
        if (!response.data.totalHits) {
          return Promise.reject(
            'Будь-ласка, введіть коректну назву'
          );
        }
        if (this.page === 1) {
          Notify.success(`Знайдено ${response.data.totalHits} картинок.`);
        }
        this.incrementPage();
        return response.data;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}