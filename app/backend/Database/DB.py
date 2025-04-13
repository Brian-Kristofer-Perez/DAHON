import sqlalchemy.orm
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

user = "root"
password = "12345678"
engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@127.0.0.1/DahonDB")

Base = sqlalchemy.orm.declarative_base()
SessionLocal = sessionmaker(bind=engine)
