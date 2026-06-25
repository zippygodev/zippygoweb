"""
FoodCourtOS AI Service
Enterprise AI-powered recommendations, chat, and analytics
"""

import os
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes import recommendations, chat, search, analytics

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="FoodCourtOS AI Service",
    description="AI-powered recommendation engine, chatbot, semantic search, and analytics",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommendations.router, prefix="/api/v1/recommendations", tags=["Recommendations"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["Chat"])
app.include_router(search.router, prefix="/api/v1/search", tags=["Search"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["Analytics"])


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai-service", "version": "1.0.0"}


@app.get("/")
async def root():
    return {
        "service": "FoodCourtOS AI Service",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "recommendations": "/api/v1/recommendations",
            "chat": "/api/v1/chat",
            "search": "/api/v1/search",
            "analytics": "/api/v1/analytics",
        },
    }
