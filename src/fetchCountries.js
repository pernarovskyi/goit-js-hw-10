const BASE_URL = 'https://restcountries.com/v3.1';

export default class RestCountriesAPI {
  constructor() {
    this.searchQuery = '';
  }
  fetchCountries(name) {
    const url = `${BASE_URL}/name/${this.searchQuery}?fields=name,capital,population,flags,languages`;

    return fetch(url).then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
