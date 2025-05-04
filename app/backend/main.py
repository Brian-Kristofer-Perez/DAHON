from fastapi import FastAPI, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import Database.CRUD as CRUD
import os

app = FastAPI()

assets_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "assets")
css_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "css")
js_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "js")

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

# end of get routes

# @app.post("/register")
# async def register(
#     first_name: str = Form(...),
#     last_name: str = Form(...),
#     email: str = Form(...),
#     password: str = Form(...),
#     db: Session = Depends(get_db),
# ):
#     # Check if the email already exists
#     existing_user = db.validate_email(email)
#     if existing_user:
#         raise HTTPException(status_code=400, detail="Email already registered")
#
#     # Insert the new user into the database
#
#     return {"message": "User registered successfully", "user_id": new_user.id}
