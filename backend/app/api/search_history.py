from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.models.search_history import SearchHistory
from app.schemas.common import MessageResponse
from app.schemas.search_history import SearchHistoryResponse
from app.dependencies import get_current_user, get_db
from app.models.user import User

router = APIRouter(prefix="/history", tags=["Search History"])

# GET HISTORY
@router.get("/", response_model=list[SearchHistoryResponse])
def get_history(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return db.query(SearchHistory)\
        .filter_by(user_id=current_user.id)\
        .order_by(SearchHistory.searched_at.desc())\
        .all()

# CLEAR HISTORY
@router.delete("/", response_model=MessageResponse)
def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db.query(SearchHistory).filter(
        SearchHistory.user_id == current_user.id
    ).delete()

    db.commit()

    return {
        "message": "Search history cleared"
    }