import sqlalchemy.orm
import sqlalchemy
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# change these to your own local database info!
# In future projects, let's use environment variables
# because hardcoding this is a mortal sin
user = "root"
password = "12345678"
port = "3306"
database_name = "DahonDB"

engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@127.0.0.1:{port}/{database_name}")

Base = sqlalchemy.orm.declarative_base()
SessionLocal = sessionmaker(bind=engine)
