import axios from 'axios';

const PIXABAY_KEY = '49707208-ae8e491fbb4cb60d419a5399f';
const BASE_URL = 'https://pixabay.com/api/';

export function fetchImages(query, page = 1) {
  return axios(
    `${BASE_URL}?key=${PIXABAY_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
  );
}
