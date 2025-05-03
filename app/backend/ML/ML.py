from io import BytesIO
import requests
from base64 import b64encode
import json


class MLModel:
    def __init__(self):

        model_code0 = "gemini-2.5-pro-exp-03-25"
        model_code1 = "gemini-2.5-flash-preview-04-17"
        self.url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_code1}:generateContent"

        self.key = "secret"
        self.header = {"Content-Type": "application/json"}
        self.instruction_set = """Analyze the provided image of a plant leaf and identify both the plant species and any disease present. You must classify the plant and disease based *only* on the following possible pairings. If the leaf appears healthy and shows no signs of disease from this list, classify it as 'healthy' for that plant.\n

                                    Possible Plant-Disease Pairings:
                                    - Apple: Apple Scab
                                    - Apple: Black Rot
                                    - Apple: Cedar Apple Rust
                                    - Cherry (including sour): Powdery Mildew
                                    - Corn (maize): Cercospora Leaf Spot (Gray Leaf Spot)
                                    - Corn (maize): Common Rust
                                    - Corn (maize): Northern Corn Leaf Blight
                                    - Grape: Black Rot
                                    - Grape: Esca (Black Measles)
                                    - Grape: Leaf Blight (Isariopsis Leaf Spot)
                                    - Orange: Haunglongbing (Citrus greening)
                                    - Peach: Bacterial Spot
                                    - Bell Pepper: Bacterial Spot
                                    - Potato: Early Blight
                                    - Potato: Late Blight
                                    - Squash: Powdery Mildew
                                    - Strawberry: Leaf Scorch
                                    - Tomato: Bacterial Spot
                                    - Tomato: Early Blight
                                    - Tomato: Late Blight
                                    - Tomato: Leaf Mold
                                    - Tomato: Septoria Leaf Spot
                                    - Tomato: Spider mites
                                    - Tomato: Target Spot
                                    - Tomato: Tomato Yellow Leaf Curl Virus
                                    - Tomato: Tomato Mosaic Virus   

                                    Return your classification as a JSON object with the keys 'plant' and 'disease'. 
                                    Bear in mind that when putting results in the disease key, follow the format of plant name: disease name. If no disease from the list is detected for the identified plant, the 'disease' value should be 'healthy'. 
                                    If you cannot confidently identify the plant from the provided list, please indicate 'unknown' for the 'plant' and 'unknown' for the 'disease'. Be precise and only use the terms exactly as they appear in the list above."
                                    
                                    For example:
                                    {"plant": "Tomato", "disease": "Tomato: Tomato Yellow Leaf Curl Virus"}
                                    {"plant": "Squash". "disease": "Powdery Mildew"}
                                    """

        self.plant_response_schema = {"type": "string", "description": "The identified plant name"}
        self.disease_response_schema = {"type": "string",
                                   "description": "The identified disease name, write healthy if none are detected"}


    def predict(self, image: BytesIO):

        b64_image = b64encode(image.getvalue()).decode('utf-8')

        prompt = {
                "contents": {
                    "parts": [
                        {"text": self.instruction_set},
                        {"inline_data": {
                                "mime_type": "image/jpeg",
                                "data": b64_image
                                 }
                        }
                    ]
                },

                "generationConfig": {
                    "response_mime_type": "application/json",
                    "response_schema": {
                        "type": "object",
                        "properties": {
                            "plant": self.plant_response_schema,
                            "disease": self.disease_response_schema
                        },
                        "required": ["plant", "disease"]
                    },
                    "temperature": 0.0  # a complete requirement for deterministic prediction
                }
            }

        output = requests.post(url=self.url, headers=self.header, json=prompt, params= {"key":self.key}).json()
        filtered_output = output['candidates'][0]['content']['parts'][0]['text']
        filtered_output = json.loads(filtered_output)
        return (filtered_output["plant"].lower(), filtered_output["disease"].lower())


