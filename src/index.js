import 'simplelightbox/dist/simple-lightbox.min.css';
import './sass/index.scss';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import ImagesApiService from './js/imagesApiService';
import LoadMoreBtn from './js/setupButtons';
import { buildGalleryMarkup } from './js/galleryMarkUp';

const formEL = document.querySelector('#search-form');
const galleryEL = document.querySelector('.gallery');
const submitBtn = document.querySelector('[type="submit"]');

let gallery = galleryEL;
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({ selector: '.load-more' });

formEL.addEventListener('submit', onFormSubmit);
loadMoreBtn.btn.addEventListener('click', onLoadMoreBtnClick);

async function onFormSubmit(event) {
  event.preventDefault();

  clearGalleryContainer();
  imagesApiService.query =
    event.currentTarget.elements.searchQuery.value.trim();
  imagesApiService.resetPage();

  if (imagesApiService.query === '') {
    Notify.failure('Будь ласка, введіть тему запиту англійською мовою!');
    return;
  }
  await fetchImages();
  gallery = new SimpleLightbox('.gallery a', {
    showCounter: false,
    captionDelay: 300,
    captionPosition: 'bottom',
    captionsData: 'alt',
    overlayOpacity: 0.5,
    fadeSpeed: 200,
  });
}

async function onLoadMoreBtnClick() {
  await fetchImages();
  gallery.refresh();
  softScroll();
}

function fetchImages() {
  console.log(imagesApiService);
  loadMoreBtn.show();
  loadMoreBtn.disable();
  submitBtn.disabled = true;

  return imagesApiService
    .fetchImages()
    .then(data => {
      buildGallery(data.hits);

      if (data.totalHits - (imagesApiService.page - 1) * 40 > 0) {
        loadMoreBtn.enable();
      } else {
        loadMoreBtn.hide();
        if (imagesApiService.page - 1 !== 1) {
          Notify.info('Ми досягли кінця пошуку!');
        }
      }
      return data;
    })
    .catch(err => {
      loadMoreBtn.hide();
      Notify.failure(err);
    })
    .finally(() => {
      submitBtn.disabled = false;
    });
}

function buildGallery(images) {
  const galleryMarkup = buildGalleryMarkup(images);
  galleryEL.insertAdjacentHTML('beforeend', galleryMarkup);
}

function clearGalleryContainer() {
  galleryEL.innerHTML = '';
}

function softScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
