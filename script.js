document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetch-btn');
    const dogImage = document.getElementById('dog-image');
    const placeholder = document.querySelector('.placeholder');
    const imageContainer = document.getElementById('image-container');

    const API_URL = 'https://dog.ceo/api/breeds/image/random';
    
    let nextImageBlob = null;
    let isPreloading = false;

    // Initial load
    init();

    fetchBtn.addEventListener('click', showNextDog);

    async function init() {
        // Load the first one directly
        await showNextDog();
    }

    async function showNextDog() {
        setLoading(true);

        try {
            let imageUrl;

            if (nextImageBlob) {
                // Use preloaded image if available
                imageUrl = nextImageBlob;
                nextImageBlob = null; // Clear it
            } else {
                // No preload ready? Fetch one now
                imageUrl = await fetchNewDogImage();
            }

            // Display it
            dogImage.src = imageUrl;
            dogImage.style.display = 'block';
            placeholder.style.display = 'none';
            setLoading(false);

            // Immediately start preloading the next one in the background
            preloadNext();

        } catch (error) {
            handleError(error);
        }
    }

    async function preloadNext() {
        if (isPreloading) return;
        isPreloading = true;
        try {
            console.log('Preloading next image...');
            nextImageBlob = await fetchNewDogImage();
            console.log('Next image preloaded!');
        } catch (e) {
            console.log('Preload failed, will retry on click');
        } finally {
            isPreloading = false;
        }
    }

    async function fetchNewDogImage() {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        
        // Actually load the image data to ensure it's in cache
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(data.message);
            img.onerror = () => reject(new Error('Image Load Error'));
            img.src = data.message;
        });
    }

    function handleError(error) {
        console.error('Error:', error);
        placeholder.innerHTML = '<span>Oops! Network is sleepy.<br>Try again!</span>';
        placeholder.style.display = 'flex';
        dogImage.style.display = 'none';
        setLoading(false);
    }

    function setLoading(isLoading) {
        if (isLoading) {
            fetchBtn.disabled = true;
            fetchBtn.textContent = 'Fetching...';
            fetchBtn.classList.add('loading');
            imageContainer.style.opacity = '0.7';
        } else {
            fetchBtn.disabled = false;
            fetchBtn.textContent = 'Fetch New Friend';
            fetchBtn.classList.remove('loading');
            imageContainer.style.opacity = '1';
        }
    }
});
