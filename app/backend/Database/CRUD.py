import io, datetime, sqlalchemy
from sqlalchemy import Select
from sqlalchemy.orm import selectinload
from . import Models
from . import DB

engine = DB.engine
Session = DB.SessionLocal

class Database:

    # Returns a user object. Don't worry, it has at most like 3 attributes
    # just User.name, User.password, and User.id
    def query_user(self, username, password = '') -> Models.User:

        # if a password is provided, query a user with a matching password
        if password:
            with Session() as session:
                statement = Select(Models.User).where(
                    sqlalchemy.and_(
                        Models.User.username == username,
                        Models.User.password == password
                    )
                )
                output = session.scalars(statement).first()

        # otherwise just query users with a similar name (this is for error handling :)
        else:
            with Session() as session:
                statement = Select(Models.User).where(Models.User.username == username)
                output = session.scalars(statement).first()

        return output


    # query all scans made by user, returns array of scan objects.
    # actually... pretty much all queries return objects. See Models.py for reference (Optional!)
    # all scans are ordered by date, ascending I believe
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
                        selectinload(Models.Disease.symptoms)
                ).where(Models.Disease.name == disease)
            output = session.scalars(statement).first()

        return output


    def add_user(self, username, password):
        with Session() as session:
            user = Models.User(username= username, password= password)
            session.add(user)
            session.commit()


    # quite complex (Sorry!)
    # when passing image, use io.BytesIO (standard library) object
    # likewise with date, it uses datetime.datetime (standard library)
    # for plants and disease, use database models, not strings.
    def add_scan(self, userID: int, image: io.BytesIO, date: datetime.datetime, plant: Models.Plant, disease: Models.Disease):
        with Session() as session:
            scan = Models.Scan(userID = userID,
                               image = image,
                               predicted_plant = plant,
                               predicted_disease = disease,
                               plantID = plant.id,
                               diseaseID = disease.id,
                               date = date)
            session.add(scan)
            session.commit()




