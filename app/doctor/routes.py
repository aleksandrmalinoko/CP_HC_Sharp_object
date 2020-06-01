import re

from app.doctor import blueprint
from time import strftime, gmtime
from flask import render_template, jsonify, request
from flask_login import login_required
from app.base.models import Patient, db, Sugar


def retrieve(model, **kwargs):
    return db.session.query(model).filter_by(**kwargs).first()


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


@blueprint.route('/patients', methods=['GET', 'POST'])
@login_required
def get_patient():
    return render_template(
        'patients.html',
        patients=db.session.query(Patient).order_by(Patient.id.asc()).all(),
        sugar=db.session.query(Sugar)
    )


@blueprint.route('/delete_patient/<id>', methods=['POST'])
@login_required
def delete_patient(id):
    cls = Patient
    obj = retrieve(cls, id=id)
    db.session.delete(obj)
    db.session.commit()
    return jsonify({'snails': obj.snails})


@blueprint.route('/edit_patient/', methods=['POST', 'GET'])
@login_required
def edit_patient():
    cls = Patient
    obj = retrieve(cls, id=str(request.form["id"]))
    obj.username = str(request.form["username"])
    obj.birthday = str(request.form["birthday"])
    obj.snails = str(request.form["snails"])
    obj.date_reception = str(request.form["date_reception"])
    db.session.commit()
    return jsonify({'snails': obj.snails})


@blueprint.route('/add_patient/', methods=['GET', 'POST'])
@login_required
def add_patient():
    obj = Patient()
    obj.username = str(request.form["username"])
    obj.birthday = str(request.form["birthday"])
    obj.snails = str(request.form["snails"])
    obj.date_reception = strftime("%d-%m-%Y %H:%M:%S", gmtime())
    db.session.add(obj)
    db.session.commit()
    return jsonify({'snails': obj.snails})


@blueprint.route('/add_sugar_with/', methods=['GET', 'POST'])
@login_required
def add_sugar_with():
    obj = Sugar()
    response: list = str(request.args.get('sugar')).replace(',', '.').split(' ')
    sugar: str = ' '
    for i, word in enumerate(response):
        if 'саха' in word:
            sugar = sugar.join(response[i:])
    nums = re.findall(r'\d*\.\d+|\d+', sugar)
    nums: list = [float(i) for i in nums]
    try:
        obj.sugar = float(nums[0])
    except IndexError as e:
        print(f"IndexError is {e}")
    except Exception as e:
        print(f"Exception is {e}")
    obj.current_time = strftime("%d-%m-%Y %H:%M:%S", gmtime())
    db.session.add(obj)
    db.session.commit()
    return render_template(
        'patients.html',
        patients=db.session.query(Patient).order_by(Patient.id.asc()).all(),
        sugar=db.session.query(Sugar)
    )
# http://127.0.0.1:5000/doctor/add_sugar_with/?sugar=30%20мая%20мой%20сахар%20был%20равен%2010
