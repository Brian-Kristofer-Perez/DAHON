import sqlalchemy.orm
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import sessionmaker, Relationship

user = "root"
password = "12345678"


# initialize the database engine
engine = create_engine(f"mysql+mysqlconnector://{user}:{password}@127.0.0.1/DahonDB")
Session = sessionmaker(bind=engine)


# Define the Base class
Base = sqlalchemy.orm.declarative_base()

class User(Base):
    __tablename__ = 'user'
    id = Column('id', Integer, primary_key=True)
    username = Column('username', String(20))
    password = Column('password', String(20))


class Scan(Base):
    __tablename__ = 'scan'
    id = Column('id', Integer, primary_key=True)
    user = Column('user', ForeignKey('user.id'))
    image = Column('image', sqlalchemy.BLOB)
    date = Column('datetime', sqlalchemy.DATETIME)
    predicted_plant = Column('predicted_plant', ForeignKey('plant.id'))
    predicted_disease = Column('predicted_disease', ForeignKey('disease.id'))


class Plant(Base):
    __tablename__ = 'plant'
    id = Column('id', Integer, primary_key=True)
    common_name = Column('common_name', String(25))
    scientific_name = Column('scientific_name', String(45))
    family = Column('family', String(30))
    type = Column('type', String(10))
    growth_conditions = Relationship('GrowthCondition')

    def to_dict(self):
        output = {
            'common_name': self.common_name,
            'scientific_name': self.scientific_name,
            'family': self.family,
            'type': self.type,
            'growth_conditions': self.growth_conditions[0].to_dict()
        }
        return output


class GrowthCondition(Base):
    __tablename__ = 'growth_condition'
    id = Column('id', Integer, primary_key=True)
    plantID = Column('plantID', ForeignKey('plant.id'))
    soil_type = Column('soil_type', String(75))
    light = Column('light', String(75))
    water = Column('water_needs', String(75))
    temperature = Column('temperature', String(75))

    def to_dict(self):
        output = {
            'soil_type': self.soil_type,
            'light': self.light,
            'water': self.water,
            'temperature': self.temperature
        }

        return output


class Disease(Base):
    __tablename__ = 'disease'
    id = Column('id', Integer, primary_key=True)
    name = Column('name', String(25))
    species_affected = Relationship('SpeciesAffected')
    symptoms =  Relationship('Symptom')
    cause = Column('cause', String(25))
    treatment = Relationship('Treatment')
    prevention = Relationship('Prevention')
    severity = Column('severity', String(50))
    # images of disease

    def to_dict(self):
        output = {
            'name': self.name,
            'species_affected': [spec.species for spec in self.species_affected],
            'symptoms': [s.symptom for s in self.symptoms],
            'cause': self.cause,
            'treatment': [t.treatment for t in self.treatment],
            'prevention': [p.prevention for p in self.prevention],
            'severity': self.severity
        }
        return output


class SpeciesAffected(Base):
    __tablename__ = 'species_affected'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    species = Column('species', String(30))


class Symptom(Base):
    __tablename__ = 'symptom'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    symptom = Column('symptom', String(250))


class Treatment(Base):
    __tablename__ = 'treatment'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    treatment = Column('treatment', String(250))


class Prevention(Base):
    __tablename__ = 'prevention'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    prevention = Column('prevention', String(250))


Base.metadata.create_all(engine)