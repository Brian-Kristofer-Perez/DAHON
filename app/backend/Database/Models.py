import sqlalchemy.orm
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import Relationship
from . import DB
from sqlalchemy.dialects.mysql import MEDIUMBLOB
import base64

# Define the Base class from DB
Base = DB.Base

class User(Base):
    __tablename__ = 'user'
    id = Column('id', Integer, primary_key=True)
    email = Column('email', String(50))
    first_name = Column('first_name', String(50))
    last_name = Column('last_name', String(50))
    password = Column('password', String(50))
    contact_number = Column('contact_number', String(20))

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'password': self.password,
            'contact_number': self.contact_number,
        }


class Scan(Base):
    __tablename__ = 'scan'
    id = Column('id', Integer, primary_key=True)
    userID = Column('userID', ForeignKey('user.id'))
    image = Column('image', MEDIUMBLOB)
    mime_type = Column('mime_type', String(75))
    date = Column('datetime', sqlalchemy.DATETIME)
    plantID = Column('predicted_plant', ForeignKey('plant.id'))
    diseaseID = Column('predicted_disease', ForeignKey('disease.id'))
    predicted_plant = Relationship('Plant')
    predicted_disease = Relationship('Disease')

    def to_dict(self):

        b64 = base64.b64encode(self.image).decode('utf-8')
        output = {
                'image': b64,
                'date': self.date.isoformat(),
                'predicted_plant': self.predicted_plant.to_dict(),
                'predicted_disease': self.predicted_disease.to_dict(),
                'mime_type': self.mime_type
                 }

        return output


class Plant(Base):
    __tablename__ = 'plant'
    id = Column('id', Integer, primary_key=True)
    common_name = Column('common_name', String(25))
    scientific_name = Column('scientific_name', String(75))
    family = Column('family', String(30))
    type = Column('type', String(30))
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
    soil_type = Column('soil_type', String(200))
    light = Column('light', String(200))
    water = Column('water_needs', String(200))
    temperature = Column('temperature', String(200))

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
    name = Column('name', String(75))
    species_affected = Relationship('SpeciesAffected')
    symptoms =  Relationship('Symptom')
    cause = Column('cause', String(300))
    treatment = Relationship('Treatment')
    prevention = Relationship('Prevention')
    severity = Column('severity', String(300))
    sample_images = Relationship('SampleImage')

    def to_dict(self):
        output = {
            'name': self.name,
            'species_affected': [spec.species for spec in self.species_affected],
            'symptoms': [s.symptom for s in self.symptoms],
            'cause': self.cause,
            'treatment': [t.treatment for t in self.treatment],
            'prevention': [p.prevention for p in self.prevention],
            'severity': self.severity,
            'sample_images': [s.to_dict() for s in self.sample_images]
        }
        return output


class SampleImage(Base):

    __tablename__ = 'sample_image'
    id = Column('id', Integer, primary_key=True)
    filename = Column('filename', String(75))
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    image = Column('image', MEDIUMBLOB)
    mime_type = Column('mime_type', String(50))

    def to_dict(self):
        b64_image = base64.b64encode(self.image).decode('utf-8')

        return {
            'id': self.id,
            'filename': self.filename,
            'diseaseID': self.diseaseID,
            'image': b64_image,  # The Base64 encoded image data as a string
            'mime_type': self.mime_type  # The MIME type (e.g., 'image/jpeg', 'image/png')
        }


class SpeciesAffected(Base):
    __tablename__ = 'species_affected'
    id = Column('id', Integer, primary_key=True)
    diseaseID = Column('diseaseID', ForeignKey('disease.id'))
    species = Column('species', String(75))


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


if __name__ == '__main__':
    Base.metadata.create_all(DB.engine)


