import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';
// Описаний в документації
import SimpleLightbox from 'simplelightbox';
// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const PIXABAY_KEY = '49707208-ae8e491fbb4cb60d419a5399f';
const BASE_URL = 'https://pixabay.com/api/';

const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', fetchImages);

function onSearch(evt) {
  evt.preventDefault();
  const searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(searchQuery);
  fetchImages(searchQuery).then(data => {
    console.log(data);
    if (data.data.hits.length === 0) {
      Notify.failure('Error! Please, try again.');
      return;
    }
    galleryList.innerHTML = createMarkup(data.data.hits);
  });
}

function fetchImages(query) {
  return axios(
    `${BASE_URL}?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=40`
  );
}
fetchImages();

function createMarkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card">
      <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" height="200"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
     </div>
     </a>
</div>`
    )
    .join('');
}

// galleryList.insertAdjacentHTML('beforeend', markupItems);
// const lightbox = new SimpleLightbox('.gallery a', {
//   captionsData: 'alt',
//   captionDelay: 250,
// });
