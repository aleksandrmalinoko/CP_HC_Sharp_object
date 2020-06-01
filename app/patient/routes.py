import re
from time import strftime, gmtime

from flask import render_template, request, jsonify
from flask_login import login_required

from app.base.models import Pharmacy, Sugar, db
from app.patient import blueprint


def retrieve(model, **kwargs):
    return db.session.query(model).filter_by(**kwargs).first()


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


@blueprint.route('/pharmacy', methods=['GET', 'POST'])
@login_required
def get_pharmacy():
    return render_template(
        'pharmacy.html',
        data=db.session.query(Pharmacy).order_by(Pharmacy.id.asc()).all())


@blueprint.route('/sugar', methods=['GET', 'POST'])
@login_required
def get_sugar():
    return render_template(
        'sugar.html',
        data=db.session.query(Sugar).order_by(Sugar.id.asc()).all())


@blueprint.route('/delete_sugar/<id>', methods=['POST'])
@login_required
def delete_sugar(id):
    cls = Sugar
    obj = retrieve(cls, id=id)
    db.session.delete(obj)
    db.session.commit()
    return jsonify({'current_time': obj.current_time})


@blueprint.route('/edit_sugar/', methods=['POST', 'GET'])
@login_required
def edit_sugar():
    cls = Sugar
    obj = retrieve(cls, id=str(request.form["id"]))
    obj.current_time = str(request.form["current_time"])
    obj.sugar = str(request.form["sugar"])
    db.session.commit()
    return jsonify({'current_time': obj.current_time})


@blueprint.route('/add_sugar/', methods=['GET', 'POST'])
@login_required
def add_sugar():
    obj = Sugar()
    obj.current_time = strftime("%d-%m-%Y %H:%M:%S", gmtime())
    match = re.search('сахар.*?(\d.*\d+)|сахар.*?(\d)|(\d.*\d+)', request.form["sugar"])
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
    obj.sugar = float(sugar)
    db.session.add(obj)
    db.session.commit()
    return jsonify({'current_time': strftime("%d-%m-%Y %H:%M:%S", gmtime())})
