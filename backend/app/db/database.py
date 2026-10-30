from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL

# Create connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Session = allows to talk to DB (query, insert, etc.)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all database tables
Base = declarative_base()
