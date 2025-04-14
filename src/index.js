import axios from 'axios';
import Notiflix, { Notify } from 'notiflix';

const PIXABAY_KEY = '49707208-ae8e491fbb4cb60d419a5399f';
const BASE_URL = 'https://pixabay.com/api/';
const form = document.querySelector('.search-form');
const input = document.querySelector('input');
const button = document.querySelector('button');

form.addEventListener('submit', onSelect);

function onSelect(evt) {
  evt.preventDefault();
  console.log(evt.target);
  const currentIndexOption = evt.target.id;
  //   const idImage = evt.target.[currentIndexOption].value;
  //   console.log(idImage);
  //   catInfo.innerHTML = '';

  fetchImages(idImage).then(data => {
    if (data.hits.length === 0) {
      Notify.failure('Error! Please, try again.');

      return;
    }
    console.log(data.hits[0].user);
    // console.log(data);
    //      const image = {
    //   webformatURL,
    //   largeImageURL,
    //   tags,
    //   likes,
    //   views,
    //   comments,
    //   downloads,
    // }; = data.data[0].image;
    //     const { url } = data.data[0];
    cardInfo.innerHTML = createMarkup(
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads
    );
  });
}
// const image = {
//   webformatURL,
//   largeImageURL,
//   tags,
//   likes,
//   views,
//   comments,
//   downloads,
// };
function fetchImages() {
  return axios(
    `${BASE_URL}?key=${PIXABAY_KEY}&q=yellow+flower&image_type=photo&orientation=horizontal&safesearch=true&page=1&per_page=20`
  )
    .then(r => r.json())
    .then(console.log(r));
}
fetchImages();

function createMarkup(
  webformatURL,
  largeImageURL,
  Tags,
  Likes,
  Views,
  Comments,
  Downloads
) {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${Tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>${Likes}</b>
    </p>
    <p class="info-item">
      <b>${Views}</b>
    </p>
    <p class="info-item">
      <b>${Comments}</b>
    </p>
    <p class="info-item">
      <b>${Downloads}</b>
    </p>
  </div>
</div>`;
}
