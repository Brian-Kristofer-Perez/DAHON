document.addEventListener('DOMContentLoaded', () => {
    // Get the plant ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const plantId = urlParams.get('id');

    if (!plantId) {
        console.error('No plant ID provided');
        return;
    }

    // Fetch plant data (this would come from the backend)
    // i'm just using mock data for demo
    const plantData = {
        name: 'Early Blight',
        image: 'assets/plant-diseases/early-blight.jpg',
        diseaseType: 'Fungal Disease',
        affectedSpecies: [
            'Primarily: Tomato, Potato',
            'Occasionally: Eggplant and other solanaceous crops'
        ],
        cause: 'Fungal (Alternaria solani)',
        severity: 'Moderate to severe, especially in warm, wet climates',
        symptoms: [
            'Begins on older, lower leaves as small dark spots',
            'Spots expand into concentric rings, forming a characteristic "bullseye" pattern',
            'Surrounding tissue often turns yellow and the leaf dies',
            'In severe cases, progresses upward causing defoliation',
            'Dark, sunken lesions may develop on stems and fruits, especially near the calyx'
            
        ],
        prevention: [
            'Apply fungicides (like chlorothalonil), mancozeb, copper-based products, or azoxystrobin',
            'Begin treatments early, especially in humid or wet weather',
            'Remove and destroy infected plant debris',
            'Improve air circulation by pruning and staking'
        ],
        treatment: [
            'Apply fungicides like chlorothalonil, mancozeb, copper-based products, or azoxystrobin',
            'Begin treatments early, especially in humid or wet weather',
            'Remove and destroy infected plant debris',
            'Improve air circulation by pruning and staking'
        ],
        referenceImages: [
            'assets/plant-diseases/early-blight-1.jpg',
            'assets/plant-diseases/early-blight-2.jpg',
            'assets/plant-diseases/early-blight-3.jpg',
            'assets/plant-diseases/early-blight-4.jpg'
        ]
    };

    // Update the UI with plant data
    updatePlantDetails(plantData);

    // Add animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements with animations
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });
});

function updatePlantDetails(data) {
    // Update plant name and image
    document.querySelector('.plant-name').textContent = data.name;
    document.querySelector('.disease-tag span').textContent = data.diseaseType;
    document.getElementById('plantImage').src = data.image;

    // Update affected species
    const speciesList = document.getElementById('affectedSpecies');
    speciesList.innerHTML = `
        <strong>Affected Plants:</strong>
        ${data.affectedSpecies.map(species => `<p>${species}</p>`).join('')}
    `;

    // Update cause and severity
    document.getElementById('diseaseCause').textContent = data.cause;
    document.getElementById('diseaseSeverity').textContent = data.severity;

    // Update symptoms
    const symptomsList = document.getElementById('diseaseSymptoms');
    symptomsList.innerHTML = data.symptoms.map(symptom => `<li>${symptom}</li>`).join('');

    // Update prevention steps
    const preventionList = document.getElementById('diseasePrevention');
    preventionList.innerHTML = data.prevention.map(step => `<li>${step}</li>`).join('');

    // Update treatment steps
    const treatmentList = document.getElementById('diseaseTreatment');
    treatmentList.innerHTML = data.treatment.map(step => `<li>${step}</li>`).join('');

    // Update reference images
    const imageGrid = document.getElementById('referenceImages');
    imageGrid.innerHTML = data.referenceImages.map(imageSrc => `
        <div class="reference-image">
            <img src="${imageSrc}" alt="${data.name} Reference Image" loading="lazy">
        </div>
    `).join('');

    // Add click handler for reference images
    imageGrid.querySelectorAll('.reference-image').forEach(image => {
        image.addEventListener('click', () => {
            const img = image.querySelector('img');
            openImageViewer(img.src);
        });
    });
}

function openImageViewer(imageSrc) {
    const viewer = document.createElement('div');
    viewer.className = 'image-viewer fade-in';
    viewer.innerHTML = `
        <div class="image-viewer-content">
            <button class="close-button">
                <i class="fas fa-times"></i>
            </button>
            <img src="${imageSrc}" alt="Full size image">
        </div>
    `;

    viewer.addEventListener('click', (e) => {
        if (e.target === viewer || e.target.closest('.close-button')) {
            viewer.remove();
        }
    });

    document.body.appendChild(viewer);
} 