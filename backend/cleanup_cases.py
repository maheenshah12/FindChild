import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

async def cleanup_old_cases():
    """Keep only the most recent active case, delete all others"""

    # Connect to MongoDB
    mongodb_url = os.getenv("MONGODB_URL")
    client = AsyncIOMotorClient(mongodb_url)
    db = client.findchildd  # Fixed: was 'findchild', should be 'findchildd'
    cases_collection = db.cases

    # Get all active cases sorted by creation date (newest first)
    active_cases = await cases_collection.find(
        {"status": "active"}
    ).sort("created_at", -1).to_list(length=None)

    print(f"Found {len(active_cases)} active cases")

    if len(active_cases) <= 1:
        print("Only 1 or fewer active cases found. Nothing to delete.")
        return

    # Keep the first one (most recent), delete the rest
    keep_case = active_cases[0]
    delete_cases = active_cases[1:]

    print(f"\nKeeping most recent case:")
    print(f"  Case ID: {keep_case['case_id']}")
    print(f"  Child: {keep_case['child_name']}")
    print(f"  Created: {keep_case['created_at']}")

    print(f"\nDeleting {len(delete_cases)} old cases...")

    # Delete old cases
    delete_ids = [case["_id"] for case in delete_cases]
    result = await cases_collection.delete_many({"_id": {"$in": delete_ids}})

    print(f"[SUCCESS] Deleted {result.deleted_count} cases")

    # Show remaining active cases
    remaining = await cases_collection.count_documents({"status": "active"})
    print(f"\nRemaining active cases: {remaining}")

    client.close()

if __name__ == "__main__":
    asyncio.run(cleanup_old_cases())
