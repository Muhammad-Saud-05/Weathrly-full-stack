from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    email: EmailStr
    # bcrypt ignores everything past 72 bytes, so cap it
    password: str = Field(min_length=8, max_length=72)
