import io, datetime, sqlalchemy
from sqlalchemy import Select, Update
from sqlalchemy.orm import selectinload
from . import Models
from . import DB

engine = DB.engine
Session = DB.SessionLocal

class Database:

    def query_user(self, email, password) -> Models.User:
        with Session() as session:
            statement = Select(Models.User).where(
                sqlalchemy.and_(
                    Models.User.email == email,
                    Models.User.password == password
                )
            )
            output = session.scalars(statement).first()

        return output


    def validate_email(self, email):
        with Session() as session:
            statement = Select(Models.User).where(Models.User.email == email)
            output = session.scalars(statement).first()
            return output is None  # Fixed: Return True if email doesn't exist


    # query all scans made by user, returns array of scan objects.
    def query_scans(self, userID: int) -> list[Models.Scan]:
        with Session() as session:
            statement = Select(Models.Scan).options(
                selectinload(Models.Scan.predicted_disease),
                        selectinload(Models.Scan.predicted_plant)
                        ).where(Models.Scan.userID == userID).order_by(Models.Scan.date)
            output = session.scalars(statement)
        scans = []
        for scan in output:
            scans.append(scan)
        return scans


    def query_plant(self, plant: str) -> Models.Plant:
        with Session() as session:
            statement = Select(Models.Plant).options(selectinload(Models.Plant.growth_conditions)).where(Models.Plant.common_name == plant)
            output = session.scalars(statement).first()
        return output


    def query_disease(self, disease: str) -> Models.Disease:
        with Session() as session:
            statement = Select(Models.Disease).options(
                selectinload(Models.Disease.species_affected),
                        selectinload(Models.Disease.treatment),
                        selectinload(Models.Disease.prevention),
                        selectinload(Models.Disease.symptoms),
                        selectinload(Models.Disease.sample_images)
                ).where(Models.Disease.name == disease)
            output = session.scalars(statement).first()
        return output


    def add_user(self, email, password, first_name, last_name, contact_number=None):
        with Session() as session:
            # Initialize with empty bytes for profile_picture to avoid NULL value
            user = Models.User(
                email=email, 
                password=password, 
                first_name=first_name, 
                last_name=last_name, 
                contact_number=contact_number
            )
            session.add(user)
            session.commit()
            
            # Create a detached copy of the user with all data already loaded
            user_dict = {
                "id": user.id,
                "email": user.email,
                "password": user.password,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "contact_number": user.contact_number
            }
            
            return user_dict  # Return a dictionary instead of the SQLAlchemy object


    def modify_user(self, user_id, new_email= '', new_password= '', new_first_name = '', new_last_name = '', new_contact_number = '', new_profile_picture: bytes = None, new_profile_picture_mime: str = ""):
        with Session() as session:
            statement = Update(Models.User).where(Models.User.id == user_id).values(
                email= new_email,
                password= new_password,
                first_name= new_first_name,
                last_name= new_last_name,
                contact_number = new_contact_number,
                profile_picture = new_profile_picture,
                profile_picture_mime = new_profile_picture_mime
            )

            session.execute(statement)
            session.commit()


    # for plants and disease, use database models, not strings.
    def add_scan(self, userID: int, image: io.BytesIO, date: datetime.datetime, plant: Models.Plant, disease: Models.Disease, filetype: str):
        with Session() as session:
            scan = Models.Scan(userID = userID,
                               image = image.getvalue(),
                               predicted_plant = plant,
                               predicted_disease = disease,
                               plantID = plant.id,
                               diseaseID = disease.id,
                               date = date,
                               mime_type = f"image/{filetype.lower()}")
            session.add(scan)
            session.commit()

    def get_user_by_id(self, user_id: int) -> Models.User:
        """
        Retrieve a user by their ID from the database.
        
        Args:
            user_id (int): The ID of the user to retrieve
            
        Returns:
            Models.User: The user object if found, None otherwise
        """
        with Session() as session:
            statement = Select(Models.User).where(Models.User.id == user_id)
            output = session.scalars(statement).first()
        
            return output




