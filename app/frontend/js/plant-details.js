        // For demo only guyss  -Joel
        // yeah for sure        -Noel
        document.addEventListener('DOMContentLoaded', function () {
            console.log('DOM Content Loaded - Starting to display results');

            // Get URL parameters
            const urlParams = new URLSearchParams(window.location.search);
            const plantParam = urlParams.get('plant');
            const disease = urlParams.get('disease');
            const imageParam = urlParams.get('image');

            console.log('URL Parameters:', { plant: plantParam, disease: disease, image: imageParam });

            // Get data from localStorage
            const analysisResultString = localStorage.getItem('analysisResult');
            const uploadedImage = localStorage.getItem('uploadedImage');

            console.log('Retrieved from localStorage:', {
                hasAnalysisResult: !!analysisResultString,
                hasUploadedImage: !!uploadedImage
            });

            try {
                // Create default result with URL parameters
                let analysisResult = {
                    plant: plantParam || 'Unknown Plant',
                    disease: disease || 'Loading...',
                    scientificName: 'Loading...',
                    timestamp: new Date().toISOString(),
                    cause: 'Loading...',
                    severity: 'Loading...',
                    symptoms: ['Loading...'],
                    prevention: ['Loading...'],
                    treatment: ['Loading...'],
                    image_path: imageParam
                };

                // Override with localStorage if available
                if (analysisResultString) {
                    const storedResult = JSON.parse(analysisResultString);
                    analysisResult = { ...analysisResult, ...storedResult };
                }

                // Initially update UI with default/localStorage data
                updateUI(analysisResult);

                // Then fetch from API if disease parameter is available
                if (disease) {
                    apiParams = new URLSearchParams(disease)
                    apiParams.append('disease', disease);
                    console.log('Fetching disease details from API for:', disease);

                    fetch(`/api/get-plant-disease?${apiParams}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('Received disease data from API:', data);

                            // decode images dictionary to base64 strings
                            const decodedImages = data.images.map(imageObj => {
                                // Extract the base64 string and mime_type from the image object
                                const base64Data = imageObj.image;
                                const mimeType = imageObj.mime_type || 'image/jpeg'; // Use provided mime_type or default to JPEG
                                
                                // Return properly formatted data URL
                                return `data:${mimeType};base64,${base64Data}`;
                            });

                            console.log('Decoded images:', decodedImages);
                    
                            // Map API response to analysisResult structure
                            const analysisResult = {
                                plant: data.name || 'Unknown Plant',
                                scientificName: data.species.map(species => species.species).join(', ') || 'Unknown Species',
                                symptoms: data.symptoms.map(symptom => symptom.symptom) || ['No symptoms available'],
                                cause: data.cause || 'Unknown cause',
                                treatment: data.treatment.map(treatment => treatment.treatment) || ['No treatment available'],
                                prevention: data.prevention.map(prevention => prevention.prevention) || ['No prevention methods available'],
                                referenceImages: decodedImages || [],
                                severity: data.severity || 'Unknown severity',
                                timestamp: new Date().toISOString(), // Add a timestamp for when the data was fetched
                            };
                    
                            // Update the UI with the new data
                            updateUI(analysisResult);
                        })
                        .catch(error => {
                            console.error('Error fetching disease details:', error);
                        });
                }

                // Function to update UI with analysisResult data
                function updateUI(result) {
                    console.log('Updating UI with:', result);

                    // Update basic information
                    document.getElementById('diseaseName').textContent = result.disease;
                    document.getElementById('scientificName').textContent = result.scientificName || result.plant;
                    document.getElementById('analysisTime').textContent = new Date(result.timestamp).toLocaleString();

                    // Update affected plants
                    if (result.affectedPlants) {
                        const affectedPlantsHtml = `
                                <h3>Affected Plants:</h3>
                                <p><strong>Primarily:</strong> ${result.affectedPlants.primary.join(', ')}</p>
                                <p><strong>Occasionally:</strong> ${result.affectedPlants.secondary.join(', ')}</p>
                            `;
                        document.getElementById('affectedSpecies').innerHTML = affectedPlantsHtml;
                    } else {
                        document.getElementById('affectedSpecies').innerHTML = `
                                <h3>Affected Plants:</h3>
                                <p>${result.plant || 'Loading...'}</p>
                            `;
                    }

                    // Update cause and severity
                    document.getElementById('diseaseCause').textContent = result.cause;
                    document.getElementById('diseaseSeverity').textContent = result.severity;

                    // Update lists
                    function updateList(elementId, items) {
                        if (items && items.length > 0) {
                            const listHtml = items.map(item => `<li>${item}</li>`).join('');
                            document.getElementById(elementId).innerHTML = `<ul>${listHtml}</ul>`;
                        }
                    }

                    updateList('diseaseSymptoms', result.symptoms);
                    updateList('diseasePrevention', result.prevention);
                    updateList('diseaseTreatment', result.treatment);

                    // Display uploaded image
                    const imgElement = document.getElementById('uploadedImage');
                    if (uploadedImage) {
                        imgElement.src = uploadedImage;
                        imgElement.style.display = 'block';
                    } else if (result.image_path) {
                        imgElement.src = result.image_path;
                        imgElement.style.display = 'block';
                    }

                    console.log("referenceImages", result.referenceImages);
                    console.log("is array", Array.isArray(result.referenceImages));

                    console.log("image is valid: ",result.referenceImages && result.referenceImages.length > 0)
                    // Update reference images
                    if (result.referenceImages && result.referenceImages.length > 0) {
                        console.log("Reference images found, displaying them.");
                        const imageGrid = document.getElementById('referenceImages');
                        imageGrid.innerHTML = result.referenceImages.map(imageSrc => `
                                <div class="reference-image">
                                    <img src="${imageSrc}" alt="${result.disease} Reference Image">
                                </div>
                            `).join('');
                    } else {
                        console.log("No reference images found, using placeholder images.");
                        // Add placeholder reference images
                        const placeholderImages = result.referenceImages || [
                            'assets/images/placeholder1.jpg',
                            'assets/images/placeholder2.jpg',
                            'assets/images/placeholder3.jpg'
                        ];
                        const imageGrid = document.getElementById('referenceImages');
                        imageGrid.innerHTML = placeholderImages.map((src, index) => `
                                <div class="reference-image">
                                    <img src="${src}" alt="Reference Image ${index + 1}">
                                </div>
                            `).join('');
                    }

                    // Add click handlers for images
                    document.querySelectorAll('.reference-image').forEach(image => {
                        image.addEventListener('click', () => {
                            const img = image.querySelector('img');
                            openImageViewer(img.src);
                        });
                    });
                }

            } catch (error) {
                console.error('Error processing analysis result:', error);
            }

            // Clear localStorage
            localStorage.removeItem('analysisResult');
            localStorage.removeItem('uploadedImage');
        });