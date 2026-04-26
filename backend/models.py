from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum

class CaseStatus(str, Enum):
    ACTIVE = "active"
    RESOLVED = "resolved"
    INVESTIGATING = "investigating"

class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class MissingChildCase(BaseModel):
    case_id: Optional[str] = None
    child_name: str
    age: int
    gender: Gender
    last_seen_location: str
    description: str
    photo_url: str
    parent_name: str
    parent_phone: str
    parent_email: Optional[str] = None
    status: CaseStatus = CaseStatus.ACTIVE
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None

class CaseResponse(BaseModel):
    case_id: str
    responder_phone: str
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    is_verified: bool = False

class StatusUpdate(BaseModel):
    status: str

class WhatsAppGroup(BaseModel):
    group_id: str
    group_name: str
    is_active: bool = True
    added_at: datetime = Field(default_factory=datetime.utcnow)
