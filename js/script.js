// Find the controls and display areas on the page.
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesButton = document.getElementById('getImagesButton');
const gallery = document.getElementById('gallery');
const statusMessage = document.getElementById('statusMessage');
const imageModal = document.getElementById('imageModal');
const closeModalButton = document.getElementById('closeModalButton');
const modalImage = document.getElementById('modalImage');
const modalDate = document.getElementById('modalDate');
const modalTitle = document.getElementById('modalTitle');
const modalExplanation = document.getElementById('modalExplanation');

// Set the date defaults and the valid date range from dateRange.js.
setupDateInputs(startInput, endInput);

// DEMO_KEY works for testing. A personal NASA key can be provided in the page
// before this script loads with: window.NASA_API_KEY = 'your-key';
const apiKey = window.NASA_API_KEY || 'DEMO_KEY';
const apiUrl = 'https://api.nasa.gov/planetary/apod';

// Fetch the pictures for the selected dates from NASA.
async function getSpaceImages() {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    statusMessage.textContent = 'Please choose both a start date and an end date.';
    return;
  }

  if (startDate > endDate) {
    statusMessage.textContent = 'The start date must be before the end date.';
    return;
  }

  statusMessage.textContent = '🔄 Loading space photos…';
  gallery.innerHTML = '';
  getImagesButton.disabled = true;

  try {
    const requestUrl = `${apiUrl}?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(requestUrl);

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({}));
      throw new Error(errorDetails.msg || 'NASA could not return the space photos.');
    }

    const responseData = await response.json();
    const photos = Array.isArray(responseData) ? responseData : [responseData];
    const imagePhotos = photos.filter((photo) => photo.media_type === 'image' && photo.url);

    if (!imagePhotos.length) {
      throw new Error('NASA did not return any image photos for these dates.');
    }

    renderGallery(imagePhotos);
    statusMessage.textContent = `${imagePhotos.length} space photo${imagePhotos.length === 1 ? '' : 's'} found.`;
  } catch (error) {
    statusMessage.textContent = `Unable to load NASA photos: ${error.message}`;
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🛰️</div><p>Try a date in NASA’s available archive, or try again shortly.</p></div>';
  } finally {
    getImagesButton.disabled = false;
  }
}

// Build one gallery card for each picture returned by NASA.
function renderGallery(photos) {
  if (!photos.length) {
    gallery.innerHTML = '<div class="placeholder"><div class="placeholder-icon">🌌</div><p>No space photos were found for those dates.</p></div>';
    return;
  }

  photos.forEach((photo) => {
    const card = document.createElement('button');
    const image = document.createElement('img');
    const title = document.createElement('h2');
    const date = document.createElement('p');

    card.className = 'gallery-item';
    card.type = 'button';
    image.src = photo.hdurl || photo.url;
    image.alt = photo.title;
    title.textContent = photo.title;
    date.textContent = photo.date;

    card.append(image, title, date);
    card.addEventListener('click', () => openModal(photo));
    gallery.appendChild(card);
  });
}

// Show the selected picture and its full explanation in the modal.
function openModal(photo) {
  modalImage.src = photo.hdurl || photo.url;
  modalImage.alt = photo.title;
  modalDate.textContent = photo.date;
  modalTitle.textContent = photo.title;
  modalExplanation.textContent = photo.explanation;
  imageModal.hidden = false;
  document.body.classList.add('modal-open');
  closeModalButton.focus();
}

function closeModal() {
  imageModal.hidden = true;
  document.body.classList.remove('modal-open');
}

getImagesButton.addEventListener('click', getSpaceImages);
closeModalButton.addEventListener('click', closeModal);
imageModal.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    closeModal();
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !imageModal.hidden) {
    closeModal();
  }
});
