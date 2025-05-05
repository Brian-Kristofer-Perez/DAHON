from io import BytesIO
from typing import Annotated
from fastapi import FastAPI, Form, Depends, HTTPException, File, UploadFile, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.backend.Database import CRUD
from app.backend.ML import ML
import shutil
from base64 import b64encode, b64decode
import uuid
from datetime import datetime
import os

app = FastAPI(title="Dahon API", version="0.1.0")

assets_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "assets")
css_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "css")
js_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "js")
upload_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "uploads")
os.makedirs(upload_path, exist_ok=True)

app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
app.mount("/css", StaticFiles(directory=css_path), name="css")
app.mount("/js", StaticFiles(directory=js_path), name="js")

db = CRUD.Database()
mlModel = ML.MLModel()

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")

# Start of get routes 

@app.get("/")
async def root() -> FileResponse:
    root_path = os.path.join(frontend_path, "index.html")
    return FileResponse(root_path)

@app.get("/login")
async def login() -> FileResponse:
    login_path = os.path.join(frontend_path, "login.html")
    return FileResponse(login_path)

@app.get("/register")
async def register() -> FileResponse:
    register_path = os.path.join(frontend_path, "signup.html")
    return FileResponse(register_path)

@app.get("/dashboard")
async def dashboard() -> FileResponse:
    dashboard = os.path.join(frontend_path, "dashboard.html")
    return FileResponse(dashboard)

@app.get("/account")
async def account() -> FileResponse:
    account_path = os.path.join(frontend_path, "account.html")
    return FileResponse(account_path)

@app.get("/capture")
async def capture() -> FileResponse:
    capture_path = os.path.join(frontend_path, "capture.html")
    return FileResponse(capture_path)

@app.get("/handbook")
async def handbook() -> FileResponse:
    handbook_path = os.path.join(frontend_path, "handbook.html")
    return FileResponse(handbook_path)

@app.get("/plant-disease")
async def plant_disease(plant: str) -> FileResponse:
    plant_disease_path = os.path.join(frontend_path, f"plant-diseases.html")
    return FileResponse(plant_disease_path)

@app.get("/plant-details")
async def plant_details() -> FileResponse:
    plant_details_path = os.path.join(frontend_path, f"plant-details.html")
    return FileResponse(plant_details_path)

@app.post("/register")
async def register_user(
    firstName: Annotated[str, Form()],
    lastName: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    try:
        # Check if the email already exists
        existing_user = db.query_user(email, "")
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Add the new user to the database
        db.add_user(
            email=email,
            password=password,
            first_name=firstName,
            last_name=lastName,
        )
        
        return {
            "email": email,
            "first_name": firstName,
            "last_name": lastName,
            "message": "User registered successfully"
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during registration")

@app.post("/login")
async def login_user(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    try:
        user = db.query_user(email, password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        # Return user information (excluding password for security)
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "message": "User logged in successfully"
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Login error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error during login")

@app.post("/api/analyze-plant")
async def analyze_plant(file: UploadFile = File(...)):
    try:
        # Generate unique filename
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(upload_path, unique_filename)
        
        # First, save the uploaded file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        # Now create BytesIO object from the contents
        image = BytesIO(contents)
        
        # Reset position to start of file
        image.seek(0)
        
        # Make prediction
        plant, disease = mlModel.predict(image)
        
        print(f"Predicted Plant: {plant}, Predicted Disease: {disease}")
        
        return {
            "plant": plant,
            "disease": disease,
            "image_path": f"/uploads/{unique_filename}",
        }
    except Exception as e:
        print(f"Error analyzing plant: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/get-plant-disease")
async def get_plant_disease(disease: str = Query(...)):
    try:
        # Fetch plant disease details from the database
        details = db.query_disease(disease)
        if not details:
            raise HTTPException(status_code=404, detail="Details not found")
        
        return {
            "name": details.name,
            "species": details.species_affected,
            "symptoms": details.symptoms,
            "cause": details.cause,
            "treatment": details.treatment,
            "prevention": details.prevention,
            "images": [images.to_dict() for images in details.sample_images],
            "severity": details.severity,
        }
    except Exception as e:
        print(f"Error fetching plant disease details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))