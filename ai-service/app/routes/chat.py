"""
AI Chatbot for customer assistance and food recommendations
"""

import logging
import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)
router = APIRouter()


class ChatMessage(BaseModel):
    user_id: str
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    suggestions: list[str] = []


@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatMessage):
    """Process a chat message and return AI response."""
    try:
        conversation_id = request.conversation_id or str(uuid.uuid4())

        reply = (
            f"I'd be happy to help you with that! Based on your query about "
            f'"{request.message}", I recommend checking out our popular restaurants. '
            f"Pizza Paradise has great reviews and is currently offering a 20% discount on large pizzas. "
            f"Would you like me to help you place an order?"
        )

        suggestions = [
            "What's popular right now?",
            "Show me vegan options",
            "I want something under ₹300",
            "What restaurants are near me?",
        ]

        return ChatResponse(
            conversation_id=conversation_id,
            reply=reply,
            suggestions=suggestions,
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="Failed to process message")


@router.get("/history/{user_id}")
async def get_chat_history(user_id: str, limit: int = 20):
    """Get chat history for a user."""
    return {
        "user_id": user_id,
        "history": [
            {
                "id": "chat_1",
                "message": "What's good today?",
                "reply": "Today's specials include...",
                "timestamp": "2024-12-20T10:30:00Z",
            }
        ],
    }
