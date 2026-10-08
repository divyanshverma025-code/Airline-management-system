import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file")


# Create database engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)


# Create session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


# Base class for models
Base = declarative_base()


# Database dependency
def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()