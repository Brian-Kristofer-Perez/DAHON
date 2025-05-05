document.addEventListener('DOMContentLoaded', () => {
    // Get parameters from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const plant = urlParams.get('plant');
    const disease = urlParams.get('disease');
    const image = localStorage.getItem('uploadedImage');
    
    console.log("URL Parameters:", { plant, disease, image });
    
    if (!plant) {
        console.error('No plant name provided');
        return;
    }
    
    // Create a data object with available information
    const plantData = {
        name: plant || "Analyzing...",
        image: image || "assets/placeholder-image.jpg",
        diseaseType: disease || "Unknown Plant",
        affectedSpecies: ["Loading..."],
        cause: "Loading...",
        severity: "Loading...",
        symptoms: ["Loading..."],
        prevention: ["Loading..."],
        treatment: ["Loading..."],
        referenceImages: [
            "assets/placeholder-image.jpg",
            "assets/placeholder-image.jpg"
        ]
    };
    
    // Try to get analysis result from localStorage
    try {
        const analysisResult = JSON.parse(localStorage.getItem('analysisResult'));
        if (analysisResult) {
            console.log("Analysis result found:", analysisResult);
            
            // Update with analysis data if available
            plantData.name = analysisResult.disease || plantData.name;
            plantData.diseaseType = analysisResult.plant || plantData.diseaseType;
            
            if (analysisResult.image_path) {
                plantData.referenceImages = [analysisResult.image_path];
            }
        }
    } catch (error) {
        console.error("Error parsing analysis result:", error);
    }
    
    // Update the UI with plant data
    updatePlantDetails(plantData);
    
    // Animation code remains unchanged
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