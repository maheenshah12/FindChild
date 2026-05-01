from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import ssl

# Configure SSL for MongoDB Atlas
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

client = AsyncIOMotorClient(
    settings.mongodb_url,
    tls=True,
    tlsAllowInvalidCertificates=True
)
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
