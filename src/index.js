import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import fetchCountries from './fetchCountries';

const formRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryInfoRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
let countryInput;

console.log(debounce);

formRef.addEventListener('input', debounce(onFormInput, DEBOUNCE_DELAY));

function onFormInput(evt) {
  evt.preventDefault();

  countryInput = evt.target.value.trim();
  console.log(countryInput);

  if (!countryInput) {
    return clearMarkup();
  }
  selectedCountry(countryInput);
}

function selectedCountry(country) {
  fetchCountries(country)
    .then(data => {
      if (data.length > 10) {
        clearMarkup();
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }

      if (data.length >= 2 && data.length < 10) {
        clearMarkup();
        console.log(countryListMarkup(data));
        countryListRef.innerHTML = countryListMarkup(data);
      }

      if (data.length < 2) {
        clearMarkup();
        countryInfoRef.innerHTML = countryInfoMarkup(data);
      }
    })
    .catch(() => {
      clearMarkup();
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function countryListMarkup(countries) {
  return countries
    .map(country => {
      return `<li><img src="${country.flags.svg}" alt="${country.name.common} flag" width="50" height="25"></img> <p>${country.name.official}</p>
              </li>`;
    })
    .join('');
}

function countryInfoMarkup(countries) {
  return countries
    .map(country => {
      return `<img 
    src="${country.flags.svg}" alt="${country.name.common}" 
    width="50" height="25" />
    <h1>${country.name.common}</h1>
    <p><b>Capital:</b> ${country.capital}</p>
    <p><b>Population:</b> ${country.population}</p>
    <p><b>Languages:</b> ${Object.values(country.languages)}</p>`;
    })
    .join('');
}

function clearMarkup() {
  countryListRef.innerHTML = '';
  countryInfoRef.innerHTML = '';
}


