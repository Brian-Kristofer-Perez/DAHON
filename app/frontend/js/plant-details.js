// For demo only guyss  -Joel
        // yeah for sure        -Noel
        document.addEventListener('DOMContentLoaded', function () {
            console.log('DOM Content Loaded - Starting to display results');

            const urlParams = new URLSearchParams(window.location.search);
            const scanId = urlParams.get('scan_id');

            // Existing params for fallback
            const plantParam = urlParams.get('plant');
            const diseaseParam = urlParams.get('disease');
            const imageParam = urlParams.get('image');

            // Get data from localStorage (for fallback or supplementary info)
            const analysisResultString = localStorage.getItem('analysisResult');
            const uploadedImageFromStorage = localStorage.getItem('uploadedImage');

            console.log('URL Parameters:', { scan_id: scanId, plant: plantParam, disease: diseaseParam, image: imageParam });
            console.log('Retrieved from localStorage:', {
                hasAnalysisResult: !!analysisResultString,
                hasUploadedImage: !!uploadedImageFromStorage
            });

            let analysisResult = {
                plant: 'Loading...', // Will hold disease name for title
                disease: 'Loading...', // Actual disease name
                scientificName: 'Loading...', // Affected species or plant name
                timestamp: new Date().toISOString(),
                cause: 'Loading...',
                severity: 'Loading...',
                symptoms: ['Loading...'],
                prevention: ['Loading...'],
                treatment: ['Loading...'],
                image_path: null, // Main scanned image
                referenceImages: []
            };

            // Initially update UI with loading state
            updateUI(analysisResult);

            if (scanId) {
                console.log('scan_id found:', scanId, '- Fetching scan details...');
                fetch(`/api/get-scan?scan_id=${scanId}`) // GET request
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status} while fetching scan data for scan_id ${scanId}.`);
                        }
                        return response.json();
                    })
                    .then(scanData => {                        console.log('Received scan data from API:', scanData);

                        analysisResult.plant = scanData.disease || 'Unknown Disease'; // For disease title
                        analysisResult.disease = scanData.disease || 'Unknown Disease'; // Actual disease name
                        analysisResult.actualPlantName = scanData.plant || 'Unknown Plant'; // Store actual plant name
                        analysisResult.timestamp = scanData.date || new Date().toISOString();
                        // Handle image directly from scan data, which should be a data URI
                        analysisResult.image_path = scanData.image; 
                        console.log('Image data from scan:', analysisResult.image_path);

                        const imgElement = document.getElementById('uploadedImage');
                        if (analysisResult.image_path) {
                            imgElement.src = analysisResult.image_path;
                            imgElement.style.display = 'block';
                        } else if (uploadedImageFromStorage) {
                            imgElement.src = uploadedImageFromStorage;
                            imgElement.style.display = 'block';
                        }
                          // Update UI with basic info from scan (disease name, plant name, image)
                        // For scientificName, use actualPlantName as a temporary value if available
                        analysisResult.scientificName = analysisResult.actualPlantName || 'Loading...';
                        
                        // Debugging for image display
                        if (analysisResult.image_path) {
                            console.log('Image path type:', typeof analysisResult.image_path);
                            console.log('Image path starts with:', analysisResult.image_path.substring(0, 30) + '...');
                        } else {
                            console.log('No image path in scan data');
                        }
                        
                        updateUI(analysisResult);

                        if (scanData.disease) {
                            const diseaseApiParams = new URLSearchParams();
                            diseaseApiParams.append('disease', scanData.disease);
                            console.log('Fetching detailed disease info for:', scanData.disease);

                            fetch(`/api/get-plant-disease?${diseaseApiParams.toString()}`, {
                                method: 'POST', // As per existing backend endpoint
                                headers: { 'Content-Type': 'application/json',}
                            })
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status} while fetching disease details for ${scanData.disease}.`);
                                }
                                return response.json();
                            })
                            .then(diseaseDetails => {
                                console.log('Received disease details from API:', diseaseDetails);

                                const decodedImages = (diseaseDetails.images || []).map(imageObj => {
                                    const base64Data = imageObj.image;
                                    const mimeType = imageObj.mime_type || 'image/jpeg';
                                    return `data:${mimeType};base64,${base64Data}`;
                                });

                                analysisResult.plant = (diseaseDetails.name ? diseaseDetails.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : analysisResult.disease);
                                analysisResult.scientificName = (diseaseDetails.species && diseaseDetails.species.length > 0) ? diseaseDetails.species.map(s => s.species).join(', ') : (analysisResult.actualPlantName || 'Unknown Species');
                                analysisResult.symptoms = (diseaseDetails.symptom && diseaseDetails.symptom.length > 0) ? diseaseDetails.symptom.map(s => s.symptom) : ['No symptoms available'];
                                analysisResult.cause = diseaseDetails.cause || 'Unknown cause';
                                analysisResult.treatment = (diseaseDetails.treatment && diseaseDetails.treatment.length > 0) ? diseaseDetails.treatment.map(t => t.treatment) : ['No treatment available'];
                                analysisResult.prevention = (diseaseDetails.prevention && diseaseDetails.prevention.length > 0) ? diseaseDetails.prevention.map(p => p.prevention) : ['No prevention methods available'];
                                analysisResult.referenceImages = decodedImages;
                                analysisResult.severity = diseaseDetails.severity || 'Unknown severity';
                                
                                updateUI(analysisResult);
                            })
                            .catch(error => {
                                console.error('Error fetching disease details:', error);
                                analysisResult.cause = 'Error loading detailed disease information.';
                                analysisResult.symptoms = ['Could not load details.'];
                                // Keep other scan data if available
                                updateUI(analysisResult);
                            });
                        } else {
                            console.log('No disease name in scan data to fetch further details.');
                            // UI already updated with basic scan info.
                            // scientificName might still be just the plant name.
                            analysisResult.scientificName = analysisResult.actualPlantName || 'Details not available';
                            updateUI(analysisResult);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching scan details by scan_id:', error);
                        runFallbackLogic(); // Fallback if scan_id fetch fails
                    });
            } else {
                console.log('scan_id not found in URL, using fallback logic.');
                runFallbackLogic();
            }

            function runFallbackLogic() {
                console.log('Executing fallback logic.');
                // Default result with URL parameters or localStorage
                let fallbackResultData = {
                    plant: plantParam || 'Unknown Plant', // Used for disease title
                    disease: diseaseParam || 'Loading...', // Actual disease name
                    scientificName: 'Loading...',
                    timestamp: new Date().toISOString(),
                    cause: 'Loading...',
                    severity: 'Loading...',
                    symptoms: ['Loading...'],
                    prevention: ['Loading...'],
                    treatment: ['Loading...'],
                    image_path: imageParam || uploadedImageFromStorage,
                    referenceImages: []
                };

                if (analysisResultString) {
                    try {
                        const storedResult = JSON.parse(analysisResultString);
                        // Merge, giving precedence to storedResult for text fields, but URL/localStorage for image
                        fallbackResultData = { ...fallbackResultData, ...storedResult, image_path: fallbackResultData.image_path || storedResult.image_path };
                    } catch (e) {
                        console.error("Error parsing analysisResult from localStorage", e);
                    }
                }
                
                analysisResult = {...analysisResult, ...fallbackResultData}; // Merge into main analysisResult

                const imgElement = document.getElementById('uploadedImage');
                if (analysisResult.image_path) {
                    imgElement.src = analysisResult.image_path;
                    imgElement.style.display = 'block';
                }

                updateUI(analysisResult); // Initial UI update with fallback data

                const diseaseToFetch = diseaseParam || analysisResult.disease; // Use disease from URL or from parsed localStorage
                if (diseaseToFetch && diseaseToFetch !== 'Loading...') {
                    const diseaseApiParams = new URLSearchParams();
                    diseaseApiParams.append('disease', diseaseToFetch);
                    console.log('Fallback: Fetching disease details from API for:', diseaseToFetch);

                    fetch(`/api/get-plant-disease?${diseaseApiParams.toString()}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    })
                    .then(response => {
                        if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status} (fallback)`); }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Fallback: Received disease data from API:', data);
                        const decodedImages = (data.images || []).map(imageObj => {
                            const base64Data = imageObj.image;
                            const mimeType = imageObj.mime_type || 'image/jpeg';
                            return `data:${mimeType};base64,${base64Data}`;
                        });
                        
                        analysisResult.plant = data.name ? data.name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : (plantParam || 'Unknown Plant');
                        analysisResult.scientificName = (data.species && data.species.length > 0) ? data.species.map(s => s.species).join(', ') : 'Unknown Species';
                        analysisResult.symptoms = (data.symptom && data.symptom.length > 0) ? data.symptom.map(s => s.symptom) : ['No symptoms available'];
                        analysisResult.cause = data.cause || 'Unknown cause';
                        analysisResult.treatment = (data.treatment && data.treatment.length > 0) ? data.treatment.map(t => t.treatment) : ['No treatment available'];
                        analysisResult.prevention = (data.prevention && data.prevention.length > 0) ? data.prevention.map(p => p.prevention) : ['No prevention methods available'];
                        analysisResult.referenceImages = decodedImages;
                        analysisResult.severity = data.severity || 'Unknown severity';
                        analysisResult.timestamp = new Date().toISOString();
                        updateUI(analysisResult);
                    })
                    .catch(error => {
                        console.error('Fallback: Error fetching disease details:', error);
                        analysisResult.cause = 'Error loading disease details (fallback).';
                        updateUI(analysisResult);
                    });
                } else {
                    console.log('Fallback: No disease name to fetch details for.');
                }
            } // End of runFallbackLogic
            
            // Try-catch block from original code, now wraps less or can be removed if individual catches are sufficient.
            // For now, the main logic is outside a single large try-catch. Individual fetches have .catch().
            // The original try was:
            // try {
            //     ... old logic ...
            // } catch (error) {
            //     console.error('Error processing analysis result:', error);
            // }

            // Function to update UI with analysisResult data
            function updateUI(result) {
                    console.log('Updating UI with:', result);

                    // Update basic information
                    document.getElementById('diseaseName').textContent = result.plant;
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
                    updateList('diseaseTreatment', result.treatment);                    // Display uploaded image
                    const imgElement = document.getElementById('uploadedImage');
                    if (uploadedImageFromStorage) {
                        imgElement.src = uploadedImageFromStorage;
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

            // Clear localStorage
            localStorage.removeItem('analysisResult');
            localStorage.removeItem('uploadedImage');
        });