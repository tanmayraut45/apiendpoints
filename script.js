document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetch-btn');
    const dogImage = document.getElementById('dog-image');
    const placeholder = document.querySelector('.placeholder');
    const imageContainer = document.getElementById('image-container');

    const API_URL = 'https://dog.ceo/api/breeds/image/random';

    // Fetch a dog immediately on load
    fetchDog();

    fetchBtn.addEventListener('click', fetchDog);

    async function fetchDog() {
        try {
            setLoading(true);
            
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            
            // Create a new image object to preload it before showing
            const tempImg = new Image();
            tempImg.onload = () => {
                dogImage.src = data.message;
                dogImage.style.display = 'block';
                placeholder.style.display = 'none';
                setLoading(false);
            };
            tempImg.onerror = () => {
                throw new Error('Failed to load image');
            }
            tempImg.src = data.message;

        } catch (error) {
            console.error('Error fetching dog:', error);
            placeholder.innerHTML = '<span>Oops! Could not fetch a doggo. <br> Try again!</span>';
            placeholder.style.display = 'flex';
            dogImage.style.display = 'none';
            setLoading(false);
        }
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
