from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
db = client.findchildd

# Collections
cases_collection = db.cases
responses_collection = db.responses
whatsapp_groups_collection = db.whatsapp_groups

async def init_db():
    """Initialize database indexes"""
    await cases_collection.create_index("case_id", unique=True)
    await cases_collection.create_index("status")
    await cases_collection.create_index("created_at")
