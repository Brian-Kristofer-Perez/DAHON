document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const browseButton = document.getElementById('browseButton');
    const uploadPreview = document.getElementById('uploadPreview');
    const previewImage = document.getElementById('previewImage');
    const removeImageButton = document.getElementById('removeImage');
    const analyzeButton = document.getElementById('analyzeButton');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const resultSection = document.getElementById('resultSection');
    const captureSection = document.getElementById('captureSection');

    // Handle drag and drop
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight() {
        uploadArea.classList.remove('drag-over');
    }

    // Handle file drop
    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    // Handle file selection via button
    browseButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });

    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                showPreview(file);
            } else {
                alert('Please upload an image file.');
            }
        }
    }

    function showPreview(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            uploadPreview.style.display = 'block';
            uploadArea.querySelector('.upload-content').style.display = 'none';
        }
        reader.readAsDataURL(file);
    }

    // Handle remove image
    removeImageButton.addEventListener('click', () => {
        uploadPreview.style.display = 'none';
        uploadArea.querySelector('.upload-content').style.display = 'block';
        fileInput.value = '';
        previewImage.src = '';
    });

    // Handle analyze button
    analyzeButton.addEventListener('click', () => {
        // Show loading overlay
        loadingOverlay.style.display = 'flex';

        // This is to create mock analysis result (need the backend her guys)
        const mockResult = {
            disease: "Early Blight",
            scientificName: "Alternaria solani",
            confidence: 95.8,
            timestamp: new Date().toISOString(),
            imageId: "capture_" + Date.now(),
            affectedPlants: {
                primary: ["Tomato", "Potato"],
                secondary: ["Eggplant", "Other solanaceous crops"]
            },
            cause: "Fungal (Alternaria solani)",
            severity: "Moderate to severe, especially in warm, wet climates",
            symptoms: [
                "Begins on older, lower leaves as small dark spots",
                "Spots expand into concentric rings, forming a characteristic 'bullseye' pattern",
                "Surrounding tissue often turns yellow and the leaf dies",
                "In severe cases, progresses upward causing defoliation",
                "Dark, sunken lesions may develop on stems and fruits"
            ],
            prevention: [
                "Apply fungicides like chlorothalonil, mancozeb, or copper-based products",
                "Begin treatment early, especially in humid or wet weather",
                "Remove and destroy infected plant debris",
                "Improve air circulation by pruning and staking"
            ],
            treatment: [
                "Apply fungicides like chlorothalonil, mancozeb, or copper-based products",
                "Begin treatments early, especially in humid or wet weather",
                "Remove and destroy infected plant debris",
                "Improve air circulation by pruning and staking"
            ]
        };

        // Store the mock result and uploaded image
        try {
            localStorage.setItem('analysisResult', JSON.stringify(mockResult));
            localStorage.setItem('uploadedImage', previewImage.src);
            
            // Debug log to verify data is stored
            console.log('Data stored in localStorage:', {
                analysisResult: mockResult,
                imageStored: !!previewImage.src
            });

            // Simulation of API delay
            setTimeout(() => {
                window.location.href = 'plant-details.html';
            }, 800);
        } catch (error) {
            console.error('Error storing data:', error);
            alert('An error occurred while processing the image. Please try again.');
            loadingOverlay.style.display = 'none';
        }
    });
}); 