import sqlalchemy.orm
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

user = "avnadmin"
password = os.getenv("DB_PASSWORD")
port = "14893"
database_name = "defaultdb"
database_address = "mysql-a014630-project-159c.d.aivencloud.com"

engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@{database_address}:{port}/{database_name}")

Base = sqlalchemy.orm.declarative_base()
SessionLocal = sessionmaker(bind=engine)


