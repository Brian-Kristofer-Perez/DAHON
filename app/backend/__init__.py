from typing import Union
from fastapi import FastAPI
from fastapi import logger
from fastapi import Request
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

@app.get("/")
async def root() -> FileResponse:
    # Construct the path to the index.html file in the frontend subdirectory
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    return FileResponse(frontend_path)

@app.get("/login")
async def login() -> FileResponse:
    # Construct the path to the login.html file in the frontend subdirectory
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "login.html")
    return FileResponse(frontend_path)

@app.get("/register")
async def register() -> FileResponse:
    # Construct the path to the register.html file in the frontend subdirectory
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "signup.html")
    return FileResponse(frontend_path)

@app.get("/dashboard")
async def dashboard() -> FileResponse:
    # Construct the path to the dashboard.html file in the frontend subdirectory
    frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dashboard.html")
    return FileResponse(frontend_path)