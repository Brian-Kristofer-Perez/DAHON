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
        currparams = new URLSearchParams(window.location.search);
        userId = currparams.get('id') || localStorage.getItem('userId');

        // Check if image is selected
        if (!previewImage.src) {
            alert('Please select an image to analyze');
            return;
        }
        
        // Show loading overlay
        loadingOverlay.style.display = 'flex';
        
        // Get file from input
        const file = fileInput.files[0];
        if (!file) {
            alert('No file selected');
            loadingOverlay.style.display = 'none';
            return;
        }
        
        // Create form data to send to API
        const formData = new FormData();
        formData.append('file', file);
        
        // Send to backend API
        fetch('/api/analyze-plant', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Server responded with status: ' + response.status);
            }
            return response.json();
        })
        .then(result => {
            // Store the result and uploaded image
            localStorage.setItem('analysisResult', JSON.stringify(result));
            localStorage.setItem('uploadedImage', previewImage.src);
            
            // Debug log to verify data is stored
            console.log('Data received from API and stored:', {
                analysisResult: result,
                imageStored: !!previewImage.src
            });

            // Navigate to results page
            params = new URLSearchParams()
            params.append('id', userId);
            params.append('plant', result.plant);
            params.append('disease', result.disease);
            params.append('image_path', result.image_path);
            window.location.href = `/plant-details?${params.toString()}`;
        })
        .catch(error => {
            console.error('Error analyzing image:', error);
            alert('An error occurred while analyzing the image. Please try again.');
            loadingOverlay.style.display = 'none';
        });
    });
}); 