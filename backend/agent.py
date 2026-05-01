from groq import Groq
from config import settings
import json

client = Groq(api_key=settings.groq_api_key)

async def generate_missing_alert(case_data: dict) -> str:
    """
    Use OpenAI to generate a compelling missing child alert message
    """
    prompt = f"""
    Generate a clear and urgent missing child alert message in a compassionate tone.

    Child Details:
    - Name: {case_data['child_name']}
    - Age: {case_data['age']} years old
    - Gender: {case_data['gender']}
    - Last Seen: {case_data['last_seen_location']}
    - Description: {case_data['description']}
    - Parent Contact: {case_data['parent_phone']}

    Create a message that:
    1. Starts with "*** MISSING CHILD ALERT ***"
    2. Includes all key details
    3. Asks people to share if they have any information
    4. Provides contact information
    5. Is concise but complete (max 200 words)
    6. CRITICAL: Use ONLY plain ASCII text - NO emojis, NO special Unicode characters, NO symbols
    7. Use asterisks (*) for emphasis instead of emojis
    8. Use simple punctuation only: periods, commas, exclamation marks, question marks

    Format for WhatsApp sharing.
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are a helpful assistant that creates urgent but compassionate missing child alerts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=300
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        # Fallback to template if API fails
        return f"""*** MISSING CHILD ALERT ***

Name: {case_data['child_name']}
Age: {case_data['age']} years old
Gender: {case_data['gender']}
Last Seen: {case_data['last_seen_location']}

Description: {case_data['description']}

If you have ANY information about this child, please contact:
Phone: {case_data['parent_phone']}

Please share this message in your groups. Every share could help bring this child home safely.

#MissingChild #HelpFindThem"""

async def analyze_response(response_text: str) -> dict:
    """
    Use OpenAI to analyze incoming responses and extract relevant information
    """
    prompt = f"""
    Analyze this response to a missing child alert and extract:
    1. Is this a credible lead? (yes/no)
    2. Key information provided
    3. Urgency level (low/medium/high)

    Response: {response_text}

    Return as JSON with keys: is_credible, information, urgency, summary
    """

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": "You are an assistant that analyzes responses to missing child alerts."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200
        )

        return json.loads(response.choices[0].message.content)
    except:
        return {
            "is_credible": True,
            "information": response_text,
            "urgency": "medium",
            "summary": response_text[:100]
        }
