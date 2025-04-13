import sqlalchemy.orm
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# change this to your own local database account!
# In future projects, let's use environment variables
# because hardcoding this is a mortal sin
user = "root"
password = "12345678"
engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@127.0.0.1/DahonDB")

Base = sqlalchemy.orm.declarative_base()
SessionLocal = sessionmaker(bind=engine)
