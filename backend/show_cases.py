import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

async def show_all_cases():
    """Show all cases in the database"""

    # Connect to MongoDB
    mongodb_url = os.getenv("MONGODB_URL")
    client = AsyncIOMotorClient(mongodb_url)
    db = client.findchild
    cases_collection = db.cases

    # Get all cases
    all_cases = await cases_collection.find().sort("created_at", -1).to_list(length=None)

    print(f"Total cases in database: {len(all_cases)}\n")

    # Group by status
    status_counts = {}
    for case in all_cases:
        status = case.get("status", "unknown")
        status_counts[status] = status_counts.get(status, 0) + 1

    print("Cases by status:")
    for status, count in status_counts.items():
        print(f"  {status}: {count}")

    print("\n" + "="*80)
    print("All cases (newest first):")
    print("="*80)

    for i, case in enumerate(all_cases, 1):
        print(f"\n{i}. Case ID: {case['case_id']}")
        print(f"   Child: {case['child_name']}, Age: {case['age']}")
        print(f"   Status: {case['status']}")
        print(f"   Created: {case['created_at']}")

    client.close()

if __name__ == "__main__":
    asyncio.run(show_all_cases())
