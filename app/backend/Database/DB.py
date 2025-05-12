import sqlalchemy.orm
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
port = os.getenv("DB_PORT")
database_name = os.getenv("DB_NAME")
database_address = os.getenv("DB_ADDRESS")

engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@{database_address}:{port}/{database_name}")

Base = sqlalchemy.orm.declarative_base()
SessionLocal = sessionmaker(bind=engine)


