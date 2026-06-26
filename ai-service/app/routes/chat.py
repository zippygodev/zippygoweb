"""
AI Chatbot for customer assistance and food recommendations
"""

import os
import logging
import uuid
from typing import Optional, List
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize OpenAI client if credentials are provided
openai_api_key = os.getenv("OPENAI_API_KEY")
openai_client = None

if openai_api_key and not openai_api_key.startswith("your-"):
    try:
        openai_client = OpenAI(
            api_key=openai_api_key,
            base_url=os.getenv("OPENAI_BASE_URL") or None
        )
        logger.info("OpenAI client initialized in AI service")
    except Exception as e:
        logger.error(f"Failed to initialize OpenAI client: {e}")


class HistoricalMessage(BaseModel):
    role: str
    content: str


class ChatMessage(BaseModel):
    user_id: str
    message: str
    conversation_id: Optional[str] = None
    history: Optional[List[HistoricalMessage]] = None


class ChatResponse(BaseModel):
    conversation_id: str
    reply: str
    suggestions: list[str] = []


@router.post("/message", response_model=ChatResponse)
async def chat_message(request: ChatMessage):
    """Process a chat message and return AI response."""
    try:
        conversation_id = request.conversation_id or str(uuid.uuid4())
        reply = None

        # 1. Try to use OpenAI if configured
        if openai_client:
            try:
                messages = [
                    {
                        "role": "system",
                        "content": (
                            "You are ZIPPY GO AI, a friendly and smart virtual assistant for a digital food court operating system (FoodCourtOS / ZIPPY GO). "
                            "You help customers find restaurants, get recommendations, choose healthy or budget-friendly options, and reorder food. "
                            "Be extremely helpful, polite, and brief (2-4 sentences). Use emojis to make it lively. Answer in markdown. "
                            "Local popular choices are Pizza Paradise (Italian pizzas), Dragon Wok (Chinese wok), Burger Barn (American burgers), and Green Bowl (salads/healthy)."
                        ),
                    }
                ]
                
                # Append history
                if request.history:
                    for h_msg in request.history:
                        role = "assistant" if h_msg.role == "assistant" else "user"
                        messages.append({"role": role, "content": h_msg.content})
                
                # Append current message
                messages.append({"role": "user", "content": request.message})

                model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                completion = openai_client.chat.completions.create(
                    model=model,
                    messages=messages,
                    max_tokens=250,
                    temperature=0.7,
                )
                
                reply = completion.choices[0].message.content
                logger.info("Generated reply using OpenAI")
            except Exception as e:
                logger.error(f"OpenAI completion failed: {e}")

        # 2. Fallback to smart simulated response if OpenAI is unavailable
        if not reply:
            msg_lower = request.message.lower()
            if "hello" in msg_lower or "hi" in msg_lower:
                reply = "Hello there! 👋 I am ZIPPY GO AI, your personal food court assistant. How can I help you satisfy your cravings today? 🍔🍕🥗"
            elif "pizza" in msg_lower or "italian" in msg_lower:
                reply = "Mmm, pizza sounds delicious! 🍕 I highly recommend checking out Pizza Paradise. Their Margherita Pizza has fresh mozzarella, tomato sauce, and basil, and it is a crowd favorite! Would you like me to guide you there?"
            elif "healthy" in msg_lower or "salad" in msg_lower or "diet" in msg_lower:
                reply = "Good for you! 🥗 Staying healthy is easy here. You should try the Caesar Salad or nutritious grain bowls at Green Bowl. They are fresh, crisp, and packed with flavor!"
            elif "cheap" in msg_lower or "budget" in msg_lower or "deal" in msg_lower:
                reply = "On a budget? 💰 No worries! You can grab delicious Garlic Bread for ₹149 from Pizza Paradise, or check out Burger Barn's affordable deals. Great food doesn't have to be expensive!"
            else:
                reply = (
                    f"I'd be happy to help you with that! Based on your interest in "
                    f'"{request.message}", I recommend exploring our top-rated restaurants: '
                    f"Pizza Paradise (Italian), Dragon Wok (Chinese), or Burger Barn (American). "
                    f"Let me know if you would like to see their menus!"
                )

        suggestions = [
            "What's popular right now?",
            "Show me vegan options",
            "I want something under ₹300",
            "What restaurants are open?",
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
