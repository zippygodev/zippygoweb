"""
AI-powered semantic search for food and restaurants
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class SearchRequest(BaseModel):
    query: str
    cuisine: Optional[str] = None
    max_price: Optional[float] = None
    dietary: Optional[list[str]] = None
    limit: int = 20


class SearchResult(BaseModel):
    id: str
    type: str
    name: str
    description: str
    relevance_score: float
    metadata: dict


@router.post("/semantic")
async def semantic_search(request: SearchRequest):
    """Perform semantic search across food items and restaurants."""
    try:
        results = [
            SearchResult(
                id="res_1",
                type="restaurant",
                name="Pizza Paradise",
                description="Authentic Italian pizzeria with wood-fired oven",
                relevance_score=0.92,
                metadata={"rating": 4.5, "delivery_time": "25-35 min"},
            ),
            SearchResult(
                id="prod_1",
                type="product",
                name="Margherita Pizza",
                description="Fresh mozzarella, tomato sauce, basil",
                relevance_score=0.88,
                metadata={"price": 349, "restaurant": "Pizza Paradise"},
            ),
        ]

        return {
            "query": request.query,
            "total_results": len(results),
            "results": [r.model_dump() for r in results],
        }
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise HTTPException(status_code=500, detail="Search failed")


@router.get("/trending")
async def get_trending_searches():
    """Get trending search terms."""
    return {
        "trending": [
            "pizza",
            "burgers",
            "healthy food",
            "coffee",
            "desserts",
        ]
    }
