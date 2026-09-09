import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.auth import UserRegister, UserLogin, UserOut, TokenResponse
from app.services.database import get_users_collection
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserRegister):
    users_coll = get_users_collection()
    
    # Check if user already exists
    existing = users_coll.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    user_id = str(uuid.uuid4())
    now_iso = datetime.now(timezone.utc).isoformat()
    
    doc = {
        "_id": user_id,
        "id": user_id,
        "name": user_in.name,
        "email": user_in.email.lower(),
        "password_hash": hash_password(user_in.password),
        "role": user_in.role or "Obstetric Clinician",
        "created_at": now_iso
    }
    
    users_coll.insert_one(doc)
    
    access_token = create_access_token(data={
        "sub": user_id,
        "email": doc["email"],
        "name": doc["name"],
        "role": doc["role"]
    })
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut(
            id=user_id,
            name=doc["name"],
            email=doc["email"],
            role=doc["role"],
            created_at=doc["created_at"]
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    users_coll = get_users_collection()
    user = users_coll.find_one({"email": credentials.email.lower()})
    
    if not user or not verify_password(credentials.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = str(user.get("id") or user.get("_id"))
    access_token = create_access_token(data={
        "sub": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user.get("role", "Clinician")
    })
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserOut(
            id=user_id,
            name=user["name"],
            email=user["email"],
            role=user.get("role", "Clinician"),
            created_at=user.get("created_at")
        )
    )

@router.get("/me", response_model=UserOut)
async def get_me(current_user: dict = Depends(get_current_user)):
    users_coll = get_users_collection()
    user = users_coll.find_one({"id": current_user["id"]})
    if not user:
        user = users_coll.find_one({"_id": current_user["id"]})
    
    if not user:
        # Return identity info from token
        return UserOut(
            id=current_user["id"],
            name=current_user["name"],
            email=current_user["email"],
            role=current_user.get("role", "Clinician"),
            created_at=datetime.now(timezone.utc).isoformat()
        )
        
    return UserOut(
        id=str(user.get("id") or user.get("_id")),
        name=user.get("name", ""),
        email=user.get("email", ""),
        role=user.get("role", "Clinician"),
        created_at=user.get("created_at")
    )
