from typing import Annotated
from fastapi import FastAPI, Form, Depends, HTTPException, File, UploadFile
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from app.backend.Database import CRUD
import shutil
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

@app.post("/register")
async def register_user(
    firstName: Annotated[str, Form()],
    lastName: Annotated[str, Form()],
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    return {"message": "User registered successfully"}

@app.post("/login")
async def login_user(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
):
    return {"message": "User logged in successfully"}

@app.post("/api/analyze-plant")
async def analyze_plant(file: UploadFile = File(...)):
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(upload_path, unique_filename)
    
    # Save the file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Here you would call your plant analysis model
    # For now, return mock data similar to what you had in JavaScript
    
    analysis_result = {
        "disease": "Early Blight",
        "scientificName": "Alternaria solani",
        "confidence": 95.8,
        "timestamp": datetime.now().isoformat(),
        "imageId": f"upload_{uuid.uuid4()}",
        "affectedPlants": {
            "primary": ["Tomato", "Potato"],
            "secondary": ["Eggplant", "Other solanaceous crops"]
        },
        "cause": "Fungal (Alternaria solani)",
        "severity": "Moderate to severe, especially in warm, wet climates",
        "symptoms": [
            "Begins on older, lower leaves as small dark spots",
            "Spots expand into concentric rings, forming a characteristic 'bullseye' pattern",
            "Surrounding tissue often turns yellow and the leaf dies",
            "In severe cases, progresses upward causing defoliation",
            "Dark, sunken lesions may develop on stems and fruits"
        ],
        "prevention": [
            "Apply fungicides like chlorothalonil, mancozeb, or copper-based products",
            "Begin treatment early, especially in humid or wet weather",
            "Remove and destroy infected plant debris",
            "Improve air circulation by pruning and staking"
        ],
        "treatment": [
            "Apply fungicides like chlorothalonil, mancozeb, or copper-based products",
            "Begin treatments early, especially in humid or wet weather",
            "Remove and destroy infected plant debris",
            "Improve air circulation by pruning and staking"
        ]
    }
    
    # Log the analysis
    print(f"Analyzed plant image: {file.filename}, saved as {unique_filename}")
    
    return analysis_result