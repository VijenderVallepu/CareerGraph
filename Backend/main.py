from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI

from database import close_driver
from routes.career import router as career_router


app = FastAPI(
    title="CareerGraph API",
    description="Graph-based career recommendation API",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://career-graph-omega.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(career_router)


@app.get("/")
def root():

    return {
        "message": "CareerGraph API is running"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.on_event("shutdown")
def shutdown():

    close_driver()