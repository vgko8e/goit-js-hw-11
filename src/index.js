import './sass/main.scss';
import SearchApiService from './js/search-service-api';
import Notiflix from 'notiflix';
import LoadMoreBtn from './js/load-btn';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    searchForm: document.querySelector('#search-form'),
    searchBtn: document.querySelector('.btn-search'),
    galleryItems: document.querySelector('.gallery'), 
};

const searchApiService = new SearchApiService();

const loadMoreBtn = new LoadMoreBtn({
    selector: '[data-action="load-more"]',
    hidden: true,
});

let lightbox = new SimpleLightbox('.gallery a', {captionsData: 'alt', captionDelay: 250});

refs.searchForm.addEventListener('submit', onSearchForm);
loadMoreBtn.refs.button.addEventListener('click', loadMore);

function onSearchForm (evt) {
    evt.preventDefault();
    
    const searchInput = (evt.target.elements.searchQuery.value).trim();
    searchApiService.query = searchInput;
    searchApiService.resetPage();
    
    if (searchInput === '') {
        Notiflix.Notify.failure('Please, fill out the form');
        loadMoreBtn.hide();
        return;
    }
    
    loadMoreBtn.hide();
    clearGalleryItems();
    fetchImage();
    evt.target.reset();
};

async function fetchImage() {
    try {
        loadMoreBtn.show();
        loadMoreBtn.disable();
        const fetchData = await searchApiService.fetchItems();
        const images = fetchData.hits;

    if (fetchData.totalHits === 0) {
        Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        loadMoreBtn.hide();
        return;
    }

    if (fetchData.totalHits < 40) {
        loadMoreBtn.hide();
    }
    
    markupItems(images);
        searchApiService.incrementPage();
        lightbox.refresh();
        loadMoreBtn.enable();
    
        return fetchData;
    } 
    
    catch (error) {
        Notiflix.Notify.failure(`${error.message}`);
    }
};


function loadMore() {
    fetchImage().then(data => {
        if ((data.totalHits) / 40 < searchApiService.page) {
        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.")
        loadMoreBtn.hide();
        }
    });    
    }

function markupItems(images) {
    const markup = images
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <a href="${largeImageURL}" class="gallery_link">
        <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="400"/>
            <div class="info">
            <p class="info-item">
                <b>Likes</b><br>${likes}
            </p>
            <p class="info-item">
                <b>Views</b><br>${views}
            </p>
            <p class="info-item">
                <b>Comments</b><br>${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b><br>${downloads}
            </p>
            </div>
        </div>
        </a>`
    }).join('');
    refs.galleryItems.insertAdjacentHTML('beforeend', markup);
};

function clearGalleryItems() {
refs.galleryItems.innerHTML = '';
}