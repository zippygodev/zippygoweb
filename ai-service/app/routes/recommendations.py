"""
AI-powered food and restaurant recommendations
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class RecommendationRequest(BaseModel):
    user_id: str
    cuisine: Optional[str] = None
    mood: Optional[str] = None
    dietary_preferences: Optional[list[str]] = None
    max_results: int = 10


class RecommendationResponse(BaseModel):
    recommendations: list[dict]
    reasoning: str


@router.post("/food", response_model=RecommendationResponse)
async def recommend_food(request: RecommendationRequest):
    """Get personalized food recommendations based on user preferences."""
    try:
        recommendations = [
            {
                "id": "rec_1",
                "name": "Margherita Pizza",
                "restaurant": "Pizza Paradise",
                "price": 349,
                "score": 0.95,
                "reason": "Popular choice matching your Italian preference",
            },
            {
                "id": "rec_2",
                "name": "Caesar Salad",
                "restaurant": "Green Bowl",
                "price": 249,
                "score": 0.88,
                "reason": "Healthy option aligned with your dietary preferences",
            },
        ]

        return RecommendationResponse(
            recommendations=recommendations,
            reasoning=f"Based on your preferences, we've selected {len(recommendations)} items",
        )
    except Exception as e:
        logger.error(f"Recommendation error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate recommendations")


@router.get("/popular/{restaurant_id}")
async def get_popular_items(restaurant_id: str, limit: int = 5):
    """Get popular items for a specific restaurant."""
    return {
        "restaurant_id": restaurant_id,
        "popular_items": [
            {"id": "pop_1", "name": "Pepperoni Pizza", "orders": 342},
            {"id": "pop_2", "name": "Garlic Bread", "orders": 289},
        ],
    }
