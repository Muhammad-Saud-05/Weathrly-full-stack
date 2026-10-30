from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.schemas.user import UserCreate
from app.models.user import User
from app.core.security import hash_password

from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.dependencies import get_db, get_current_user
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter()

@router.post("/users", status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(
        or_(User.email == user.email, User.username == user.username)
    ).first()

    if existing:
        field = "Email" if existing.email == user.email else "Username"
        raise HTTPException(status_code=409, detail=f"{field} already registered")

    hashed_pw = hash_password(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_pw
    )

    db.add(new_user)

    try:
        db.commit()
    except IntegrityError:
        # another request registered the same email/username between the check and the insert
        db.rollback()
        raise HTTPException(status_code=409, detail="Email or username already registered")

    db.refresh(new_user)

    return {
        "id": new_user.id,
        "username": new_user.username,
        "email": new_user.email
    }

@router.post("/login")
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    print("LOGIN ATTEMPT:", form_data.username)
    user = db.query(User).filter(User.email == form_data.username).first()
    print("USER FOUND:", user)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        data={"user_id": user.id, "email": user.email}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email
    }