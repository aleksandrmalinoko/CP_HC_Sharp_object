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
        sugar=db.session.query(Sugar))


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
    print("HER")
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
    obj.current_time = strftime("%d-%m-%Y %H:%M:%S", gmtime())
    match = re.search('сахар.*?(\d.*\d+)|сахар.*?(\d)|(\d.*\d+)', str(request.args.get('sugar')))
    print(match)
    sugar = float()
    try:
        if match.group(1):
            sugar = match.group(1)
        elif match.group(2):
            sugar = match.group(2)
        elif match.group(3):
            sugar = match.group(3)
    except AttributeError as e:
        pass
    print(sugar)
    obj.sugar = float(sugar)
    db.session.add(obj)
    db.session.commit()
    return render_template(
        'patients.html',
        patients=db.session.query(Patient).order_by(Patient.id.asc()).all(),
        sugar=db.session.query(Sugar))
