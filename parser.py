from sqlalchemy import exists, create_engine
from sqlalchemy.orm import sessionmaker
from app.base.models import *

engine = create_engine('sqlite:///database.db', echo=False)

# create tables
Base.metadata.create_all(engine)

# create a Session
Session = sessionmaker(bind=engine)
session = Session()

for temp in range(99):
    infs = {'id_object': temp + 1, 'name_object': "123тест", 'lat': temp * 0.75, 'lon': temp * 0.8, 'enabled': 0,
            'number_object': temp + 3}
    objects = ObjectsS(infs['id_object'], infs['number_object'], infs['name_object'], infs['enabled'], infs['lat'],
                       infs['lon'])
    if session.query(exists().where(ObjectsS.user_id == objects.user_id)).scalar():
        session.query(ObjectsS).update({ObjectsS.object_number: objects.object_number})
        session.query(ObjectsS).update({ObjectsS.name: objects.name})
        session.query(ObjectsS).update({ObjectsS.enabled: objects.enabled})
        session.query(ObjectsS).update({ObjectsS.lat: objects.lat})
        session.query(ObjectsS).update({ObjectsS.lon: objects.lon})
    else:
        session.add(objects)

# Create single object and update single object
inf1 = {'id_object': 100, 'number_object': 77, 'name_object': "123тест", 'lat': 13.3456, 'lon': 11.156, 'enabled': 1}
object1 = ObjectsS(inf1['id_object'], inf1['number_object'], inf1['name_object'], inf1['enabled'], inf1['lat'],
                   inf1['lon'])
if session.query(exists().where(ObjectsS.user_id == object1.user_id)).scalar():
    session.query(ObjectsS).update({ObjectsS.enabled: object1.enabled})
else:
    session.add(object1)

# session.query(ObjectsS).delete()  # total delete

# output
for objects_out in session.query(ObjectsS).order_by(ObjectsS.id):
    print(objects_out)

# commit the record the database
session.commit()
session.close()

# TODO: неверное работает обновление записи в таблице БД
