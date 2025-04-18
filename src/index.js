import { Notify, Loading } from 'notiflix';
// import { Loading } from 'notiflix/build/notiflix-loading-aio';
import { fetchImages } from './pixabay';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const form = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
let page = 1;
let searchQuery = '';
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onConrtoll(data) {
  if (page * 40 < data.data.totalHits) {
    loadMoreBtn.removeAttribute('hidden');
  } else {
    loadMoreBtn.setAttribute('hidden', true);
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

async function onSearch(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
  console.log(searchQuery);

  if (!searchQuery) {
    Notify.failure('Error! Please, type somerthing into input.');
    return;
  }
  galleryList.innerHTML = '';
  loadMoreBtn.setAttribute('hidden', true);
  Loading.dots();
  page = 1;
  // fetchImages(searchQuery, page)
  //   .then(data => {
  //     console.log(data);
  //     if (data.data.hits.length === 0) {
  //       Notify.failure(
  //         'Sorry, there are no images matching your search query. Please try again.'
  //       );
  //       galleryList.innerHTML = '';
  //       loadMoreBtn.setAttribute('hidden', true);
  //       return;
  //     }
  //     Loading.remove();

  //     Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
  //     galleryList.innerHTML = createMarkup(data.data.hits);
  //     lightbox.refresh();
  //     if (page * 40 < data.data.totalHits) {
  //       loadMoreBtn.removeAttribute('hidden');
  //     } else {
  //       loadMoreBtn.setAttribute('hidden', true);
  //       Notify.info(
  //         "We're sorry, but you've reached the end of search results."
  //       );
  //     }
  //   })
  //   .catch(e => {
  //     Notify.failure(`Something wrong ${e.message}`);
  //     galleryList.innerHTML = '';
  //     loadMoreBtn.setAttribute('hidden', true);
  //   })
  //   .finally(() => {
  //     Loading.remove();
  //   });
  try {
    const data = await fetchImages(searchQuery, page);
    console.log(data);
    if (data.data.hits.length === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      galleryList.innerHTML = '';
      loadMoreBtn.setAttribute('hidden', true);
      return;
    }
    Loading.remove();

    Notify.info(`Hooray! We found ${data.data.totalHits} images.`);
    galleryList.innerHTML = createMarkup(data.data.hits);
    lightbox.refresh();
    totalHits = data.data.totalHits;
    onConrtoll(data);
    // if (page * 40 < data.data.totalHits) {
    //   loadMoreBtn.removeAttribute('hidden');
    // } else {
    //   loadMoreBtn.setAttribute('hidden', true);
    //   Notify.info("We're sorry, but you've reached the end of search results.");
    // }
  } catch (error) {
    Notify.failure(`Something wrong ${error.message}`);
    galleryList.innerHTML = '';
    loadMoreBtn.setAttribute('hidden', true);
  } finally {
    Loading.remove();
  }
}

async function onLoadMore() {
  page += 1;
  Loading.dots();
  // fetchImages(searchQuery, page)
  //   .then(data => {
  //     console.log(data);
  //     Loading.remove();
  //     galleryList.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
  //     lightbox.refresh();
  //     const { height: cardHeight } = document
  //       .querySelector('.gallery')
  //       .firstElementChild.getBoundingClientRect();

  //     window.scrollBy({
  //       top: cardHeight * 2,
  //       behavior: 'smooth',
  //     });
  //     if (page * 40 < data.data.totalHits) {
  //       loadMoreBtn.removeAttribute('hidden');
  //     } else {
  //       loadMoreBtn.setAttribute('hidden', true);
  //       Notify.info(
  //         "We're sorry, but you've reached the end of search results."
  //       );
  //     }
  //   })
  //   .catch(e => {
  //     Notify.failure(`Something wrong ${e.message}`);
  //   })
  //   .finally(() => {
  //     Loading.remove();
  //   });
  try {
    const data = await fetchImages(searchQuery, page);
    console.log(data);
    Loading.remove();
    galleryList.insertAdjacentHTML('beforeend', createMarkup(data.data.hits));
    lightbox.refresh();
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
    onConrtoll(data);
    // if (page * 40 < data.data.totalHits) {
    //   loadMoreBtn.removeAttribute('hidden');
    // } else {
    //   loadMoreBtn.setAttribute('hidden', true);
    //   Notify.info("We're sorry, but you've reached the end of search results.");
    // }
  } catch (error) {
    Notify.failure(`Something wrong ${error.message}`);
  } finally {
    Loading.remove();
  }
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
  <img src="${webformatURL}" alt="${tags}" class="image-row" loading="lazy" width="300" height="200"/>
  </a>
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
  
</div>`
    )
    .join('');
}
