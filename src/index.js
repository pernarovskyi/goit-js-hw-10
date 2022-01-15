import './css/styles.css';
import { debounce } from 'lodash';
// import Notiflix from 'notiflix';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import RestCountriesAPI from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('input#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const countriesAPI = new RestCountriesAPI();

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY, { trailing: true }));

function onSearch(e) {
  e.preventDefault();

  if (e.target.value !== '') {
    countriesAPI.query = e.target.value.trim();

    getCountriesAPI(countriesAPI.query);
    resetRender();
  } else {
    e.target.value = '';
  }
}

function resetRender() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function getCountriesAPI(name) {
  countriesAPI
    .fetchCountries(name)
    .then(data => {
      if (data.length == 1) {
        renderCountryInfo(data);
      } else if (data.length > 1 && data.length < 10) {
        renderCountryList(data);
      } else {
        Notify.info('Too many matches found. Please enter a more specific name.');
      }
    })
    .catch(e => {
      Notify.failure('Oops, there is no country with that name');
      console.log(e.toString());
    });
}

function renderCountryInfo(data) {
  const { name, capital, population, flags, languages } = data[0];
  return refs.countryInfo.insertAdjacentHTML(
    'beforeend',
    `<div class="flag-country-block">
        <img
          class="flag"
          src="${flags.svg}"
          alt="flag"
        />
        <h1>${name.official}</h1>
      </div>
      <ul class="country-info-details">
        <li class="country-info-item">
          <h2>Capital:</h2>
          <span class="info-value">${capital}</span>
        </li>
        <li class="country-info-item">
          <h2>Population:</h2>
          <span class="info-value">${population}</span
          >
        </li>
        <li class="country-info-item">
          <h2>Languages:</h2>
          <span class="info-value">${Object.values(languages).join(', ')}</span
          >
        </li>
      </ul>
    `,
  );
}

function renderCountryList(listCountries) {
  const markup = listCountries
    .map(item => {
      return `
      <li class="country-list-item">
        <img
          class="flag-list"
          src="${item.flags.svg}"
          alt="flag"
          />
        <h2 class="list-item-h2">${item.name.official}</h2>
      </li>`;
    })
    .join('');

  refs.countryList.insertAdjacentHTML('beforeend', markup);
}
