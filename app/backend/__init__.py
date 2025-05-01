from typing import Annotated
from typing import Union
from fastapi import FastAPI
from fastapi import logger
from fastapi import Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

assets_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "assets")
css_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "css")
js_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "js")

app.mount("/assets", StaticFiles(directory=assets_path), name="assets")
app.mount("/css", StaticFiles(directory=css_path), name="css")
app.mount("/js", StaticFiles(directory=js_path), name="js")

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend")

@app.get("/")
async def root() -> FileResponse:
    # Construct the path to the index.html file in the frontend subdirectory
    root_path = os.path.join(frontend_path, "index.html")
    return FileResponse(root_path)

@app.get("/login")
async def login() -> FileResponse:
    # Construct the path to the login.html file in the frontend subdirectory
    login_path = os.path.join(frontend_path, "login.html")
    return FileResponse(login_path)

@app.get("/register")
async def register() -> FileResponse:
    # Construct the path to the register.html file in the frontend subdirectory
    register_path = os.path.join(frontend_path, "signup.html")
    return FileResponse(register_path)

@app.get("/dashboard")
async def dashboard() -> FileResponse:
    # Construct the path to the dashboard.html file in the frontend subdirectory
    dashboard = os.path.join(frontend_path, "dashboard.html")
    return FileResponse(dashboard)

@app.post("/register")
async def register(firstName: Annotated[str, Form()], lastName: Annotated[str, Form()], email: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"lastName": lastName, "firstName": firstName, "email": email, "password": password}