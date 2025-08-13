from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True)
    password = Column(String)

class Feedback(Base):
    __tablename__ = "feedback"
    id = Column(Integer, primary_key=True)
    username = Column(String)
    comment = Column(Text)
    sentiment = Column(String)

engine = create_engine("sqlite:///database.db")
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
