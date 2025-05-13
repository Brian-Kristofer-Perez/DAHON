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
async def dashboard(id: int = Query(...)) -> FileResponse:
    dashboard = os.path.join(frontend_path, "dashboard.html")
    return FileResponse(dashboard)

@app.get("/account")
async def account(id: int = Query(...)) -> FileResponse:
    account_path = os.path.join(frontend_path, "account.html")
    return FileResponse(account_path)

@app.get("/capture")
async def capture(id: int = Query(...)) -> FileResponse:
    capture_path = os.path.join(frontend_path, "capture.html")
    return FileResponse(capture_path)

@app.get("/handbook")
async def handbook(id: int = Query(...)) -> FileResponse:
    handbook_path = os.path.join(frontend_path, "handbook.html")
    return FileResponse(handbook_path)

@app.get("/plant-disease")
async def plant_disease(id: int = Query (...), plant: str = Query(...)) -> FileResponse:
    plant_disease_path = os.path.join(frontend_path, f"plant-diseases.html")
    return FileResponse(plant_disease_path)

@app.get("/plant-details")
async def plant_details(id: int = Query(...), scan_id = Query) -> FileResponse:
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
        if not db.validate_email(email):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Add the new user to the database and get the user data
        user_data = db.add_user(
            email=email,
            password=password,
            first_name=firstName,
            last_name=lastName,
        )
        
        # Return the user data for redirection to dashboard
        return {
            "id": user_data["id"],
            "email": user_data["email"],
            "first_name": user_data["first_name"],
            "last_name": user_data["last_name"],
            "message": "User registered successfully"
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Registration error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error during registration: {str(e)}")

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
async def analyze_plant(file: UploadFile = File(...), user_id: int = Form(...)):
    try:
        print(f"Received request with user_id: {user_id} and file: {file.filename}")
        
        # Generate meaningful filename based on plant, disease and timestamp
        file_extension = file.filename.split(".")[-1]
        
        # First, save the uploaded file
        contents = await file.read()
        
        # Now create BytesIO object from the contents
        image = BytesIO(contents)
        
        # Reset position to start of file
        image.seek(0)
        
        # Make prediction
        plant, disease = mlModel.predict(image)
        
        print(f"Predicted Plant: {plant}, Predicted Disease: {disease}")
        
        # Get plant and disease objects from database
        plant_obj = db.query_plant(plant)
        disease_obj = db.query_disease(disease)
        
        if not plant_obj or not disease_obj:
            raise HTTPException(status_code=404, detail="Plant or disease not found in database")
        
        # Create a meaningful filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        sanitized_plant = plant.replace(" ", "_").lower()
        sanitized_disease = disease.replace(" ", "_").lower()
        filename = f"{sanitized_plant}_{sanitized_disease}_{timestamp}.{file_extension}"
        file_path = os.path.join(upload_path, filename)
        
        # Save file with the new filename
        with open(file_path, "wb") as f:
            # Reset the BytesIO object to the beginning
            image.seek(0)
            f.write(image.getvalue())
        
        # Save scan to database
        scan_date = datetime.now()
        scan_id = db.add_scan(
            userID=user_id,
            image=image,
            date=scan_date,
            plant=plant_obj,
            disease=disease_obj,
            filetype=file_extension
        )
        
        return {
            "scan_id": scan_id
        }
    except Exception as e:
        print(f"Error analyzing plant: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/update-user")
async def update_user(
    id: Annotated[int, Form()],
    firstName: Annotated[str, Form()] = "",
    lastName: Annotated[str, Form()] = "",
    email: Annotated[str, Form()] = "",
    password: Annotated[str, Form()] = "",
    contactNumber: Annotated[str, Form()] = None
):
    try:
        # Check if user exists
        user = db.get_user_by_id(id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # If email is being changed, validate it doesn't already exist
        if email and email != user.email:
            if not db.validate_email(email):
                raise HTTPException(status_code=400, detail="Email already registered to another user")
        
        # Update the user information
        db.modify_user(
            user_id=id,
            new_email=email if email else user.email,
            new_password=password if password else user.password,
            new_first_name=firstName if firstName else user.first_name,
            new_last_name=lastName if lastName else user.last_name,
            new_contact_number=contactNumber if contactNumber is not None else user.contact_number
        )
        
        # Get updated user information
        updated_user = db.get_user_by_id(id)
        
        return {
            "id": updated_user.id,
            "email": updated_user.email,
            "first_name": updated_user.first_name,
            "last_name": updated_user.last_name,
            "contact_number": updated_user.contact_number,
            "message": "User information updated successfully"
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"User update error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error during user update: {str(e)}")

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
            "symptom": details.symptoms,
            "cause": details.cause,
            "treatment": details.treatment,
            "prevention": details.prevention,
            "images": [images.to_dict() for images in details.sample_images],
            "severity": details.severity,
        }
    except Exception as e:
        print(f"Error fetching plant disease details: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-user")
async def get_user_id(id: int = Query(...)):
    try:
        user = db.get_user_by_id(id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "contact_number": user.contact_number,
        }
    except Exception as e:
        print(f"Error fetching user ID: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-recent-scans")
async def get_recent_scans(user_id: int = Query(...), limit: int = Query(5)):
    try:
        # Validate user exists
        user = db.get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get scans for the user as dictionaries
        scan_dicts = db.query_scans(user_id)
        
        # Sort by date (most recent first) and limit the results
        recent_scans = sorted(scan_dicts, key=lambda x: x["date"], reverse=True)[:limit]
        
        # Format the scan results
        scan_results = []
        for scan in recent_scans:
            scan_results.append({
                "id": scan["id"],
                "date": scan["date"],
                "plant": scan["plant"],
                "disease": scan["disease"],
                "image": f"data:{scan['mime_type']};base64,{scan['image']}"
            })
        
        return {
            "scans": scan_results,
            "count": len(scan_results)
        }
    except Exception as e:
        print(f"Error fetching recent scans: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/get-scan")
async def get_scan(scan_id: int = Query(...)):
    try:
        scan = db.get_scan_by_id(scan_id)
        if not scan:
            raise HTTPException(status_code=404, detail="Scan not found")
        
        return {
            "id": scan["id"],
            "date": scan["date"],
            "plant": scan["plant"],
            "disease": scan["disease"],
            "image": f"data:{scan['mime_type']};base64,{scan['image']}",
            "user_id": scan["user_id"]
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Error fetching scan: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error while fetching scan: {str(e)}")

