from motor.motor_asyncio import AsyncIOMotorClient
from config import settings
import certifi
import os

# Determine which CA bundle to use
# Try system certificates first, fall back to certifi
ca_file = None
if os.path.exists('/etc/ssl/certs/ca-certificates.crt'):
    ca_file = '/etc/ssl/certs/ca-certificates.crt'
else:
    ca_file = certifi.where()

print(f"[INFO] Using CA bundle: {ca_file}")

# Use certifi's CA bundle for MongoDB Atlas SSL/TLS
# Simplified connection with explicit TLS settings
client = AsyncIOMotorClient(
    settings.mongodb_url,
    tls=True,
    tlsAllowInvalidCertificates=False,
    tlsCAFile=ca_file,
    serverSelectionTimeoutMS=30000,
    connectTimeoutMS=30000,
    socketTimeoutMS=30000
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
