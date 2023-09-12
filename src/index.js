import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchFormEl = document.querySelector('.search-form');
const inputEl = document.querySelector('.search-form input');
const startButton = document.querySelector('.search-form button');
const buttonLoadMoreEl = document.querySelector('.load-more');
let galleryEl = document.querySelector('.gallery');
const API_KEY = '39383410-163fa90d28e607aa13527d20b';
const BASE_URL = 'https://pixabay.com/api/';
let pageCounter = 1;
const perPage = 40;
startButton.disabled = true;
buttonLoadMoreEl.style.visibility = 'hidden';

async function fetchImg(value) {
  try {
    let response = await axios(`${BASE_URL}`, {
      params: {
        key: API_KEY,
        q: value,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: pageCounter,
        per_page: perPage,
      },
    });
    const totalHits = response.data.totalHits;
    const pagesCount = Math.ceil(totalHits / perPage);
    if (response.data.hits.length === 0) {
      buttonLoadMoreEl.style.visibility = 'hidden';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    if (pageCounter === 1) {
      Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
      buttonLoadMoreEl.style.visibility = 'visible';
      renderImgPost(response.data.hits);
    }
    if (pageCounter > 1) {
      buttonLoadMoreEl.style.visibility = 'visible';
      renderImgPost(response.data.hits);
    }
    if (pagesCount === pageCounter) {
      buttonLoadMoreEl.style.visibility = 'hidden';
      Notiflix.Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      return;
    }
  } catch (error) {
    Notiflix.Notify.failure(`Failed to fetch breeds: ${error}`);
  }
}
inputEl.addEventListener('input', event => {
  const inputValue = event.currentTarget.value.trim();
  if (inputValue.length === 0) {
    startButton.disabled = true;
  } else if (inputValue.length > 0) {
    startButton.disabled = false;
  }
  return;
});

searchFormEl.addEventListener('submit', requestValue);
let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 100,
  captionData: 'alt',
});

function clearGallery() {
  galleryEl.innerHTML = '';
}

function requestValue(event) {
  event.preventDefault();
  pageCounter = 1;
  clearGallery();
  let requestId = inputEl.value.trim();
  fetchImg(requestId);
  lightbox.refresh();
  return;
}
buttonLoadMoreEl.addEventListener('click', () => {
  pageCounter += 1;
  fetchImg(submitEl.value);
  lightbox.refresh();
  return;
});
function renderImgPost(response) {
  let listArray = response.map(resp => {
    return `<a href='${resp.largeImageURL}' class='gallery__link'> 
      <img src="${resp.webformatURL}" alt="${resp.tags}" loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>Likes: ${resp.likes}</b>
        </p>
        <p class="info-item">
          <b>Views: ${resp.views}</b>
        </p>
        <p class="info-item">
          <b>Comments: ${resp.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads: ${resp.downloads}</b>
        </p>
      </div>
    </a>`;
  });

  galleryEl.insertAdjacentHTML('beforeend', listArray.join(''));
  lightbox.refresh();
  return;
}
