const suiteSelect = document.getElementById('suiteSelect');
const valueSelect = document.getElementById('valueSelect');
const generateBtn = document.getElementById('generateBtn');
const exportBtn = document.getElementById('exportBtn');
// const saveBtn = document.getElementById('saveBtn');
const cardElement = document.getElementById('cardElement');
const generatedImage = document.getElementById('generatedImage');
const loadingIndicator = document.getElementById('loadingIndicator');
const topLeft = document.getElementById('topLeft');
const bottomRight = document.getElementById('bottomRight');
const examplePreview = document.getElementById('examplePreview');
let classesToAdd = [ 'text-white', 'bg-slate-600', 'transition-all', 'hover:scale-105' ];
let swiper;

function updateCardCorners() {
    let value = valueSelect.value;
    switch (value) {
        case "Jack":
        case "Queen":
        case "King":
            value = value[0];
            console.log(value[0]);  
                break;
        default:
            value = valueSelect.value;
            break;
    }
    const suite = suiteSelect.value;
    topLeft.textContent = `${value}${suite}`;
    bottomRight.textContent = `${value}${suite}`;
}

suiteSelect.addEventListener('change', updateCardCorners);
valueSelect.addEventListener('change', updateCardCorners);

generateBtn.addEventListener('click', async () => {
    loadingIndicator.classList.remove('hidden');
    generatedImage.classList.add('hidden');
    examplePreview.classList.add('hidden');

    const data = {
        id: "cm04y8i690006113nh6bgjk1m",
        inputs: [valueSelect.value, suiteSelect.value],
    };

    try {
        const response = await fetch(
            "https://card-generator-app-backend.onrender.com/generate-glif", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error(`Error: ${response.statusText}`);

        const result = await response.json();
        console.log("API response:", result); // Log the entire response

        if (!result.imageUrl) {
            throw new Error("No image URL received from the API");
        }

        generatedImage.src = result.imageUrl;
        generatedImage.classList.remove('hidden');
        updateCardCorners();
    } catch (error) {
        console.error("Error generating image:", error);
        alert(`Error generating image: ${error.message}. Please try again.`);
    } finally {
        loadingIndicator.classList.add('hidden');
        topLeft.classList.add('hidden');
        bottomRight.classList.add('hidden');
        // saveBtn.disabled = false;
        // saveBtn.classList.add(...classesToAdd);
        saveImage();
    }
});

exportBtn.addEventListener('click', async () => {
    try {
        const canvas = await html2canvas(cardElement, {
            scale: 4,
            useCORS: true,
            backgroundColor: null,
        });

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${suiteSelect.value}_${valueSelect.value}.png`;
            link.click();
            URL.revokeObjectURL(url);
        }, "image/png", 1.0);
    } catch (error) {
        console.error("Export error:", error);
        alert("Failed to export card. Please try again.");
    }
});

async function saveImage() {
    if (!generatedImage.src) {
        alert('Please generate an image first.');
        return;
    }

    try {
        const response = await fetch('https://card-generator-app-backend.onrender.com/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: generatedImage.src })
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        alert('Image saved to Cloudinary successfully!');
        await loadCloudinaryImages();
    } catch (error) {
        console.error('Error saving image:', error);
        alert('Failed to save image to Cloudinary. Please try again.');
    } finally {
        loadCloudinaryImages();
    }
};

// saveBtn.addEventListener('click', async () => {
//     if (!generatedImage.src) {
//         alert('Please generate an image first.');
//         return;
//     }

//     try {
//         const response = await fetch('https://card-generator-app-backend.onrender.com/upload-image', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ image: generatedImage.src })
//         });

//         if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

//         const result = await response.json();
//         alert('Image saved to Cloudinary successfully!');
//         await loadCloudinaryImages();
//     } catch (error) {
//         console.error('Error saving image:', error);
//         alert('Failed to save image to Cloudinary. Please try again.');
//     } finally {
//         loadCloudinaryImages();
//     }
// });

async function loadCloudinaryImages() {
    try {
        const response = await fetch('https://card-generator-app-backend.onrender.com/get-cloudinary-images');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const images = await response.json();
        const swiperWrapper = document.querySelector('.swiper-wrapper');
        swiperWrapper.innerHTML = '';

        images.forEach(image => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.innerHTML = `<img src="${image.url}" alt="Card Image" class="p-2 bg-white rounded-lg shadow-lg w-full h-full object-contain hover:scale-110 transition-all cursor-pointer">`;
            
            // Añadir el event listener aquí, dentro del bucle forEach
            slide.querySelector('img').addEventListener('click', () => openFullscreen(image.url));
            
            swiperWrapper.appendChild(slide);
        });

        if (swiper) {
            swiper.update();
        } else {
            swiper = new Swiper('.swiper', {
                slidesPerView: 3,
                spaceBetween: 30,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            });
        }
    } catch (error) {
        console.error('Error loading Cloudinary images:', error);
        alert('Failed to load images from Cloudinary. Please try again.');
    }
}

function openFullscreen(imageUrl) {
    const overlay = document.getElementById('fullscreenOverlay');
    const fullscreenImage = document.getElementById('fullscreenImage');
    
    fullscreenImage.src = imageUrl;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    overlay.addEventListener('click', closeFullscreen);
}

function closeFullscreen() {
    const overlay = document.getElementById('fullscreenOverlay');
    overlay.classList.add('hidden');
    overlay.removeEventListener('click', closeFullscreen);
}

// Initialize card corners and load Cloudinary images
updateCardCorners();
loadCloudinaryImages();