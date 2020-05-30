from datetime import datetime

from app.patient import blueprint
from flask import render_template, request, jsonify
from flask_login import login_required
from app.base.models import Sugar, db


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')


@blueprint.route('/get_sugar', methods=['GET', 'POST'])
@login_required
def get_sugar():
    return render_template(
        'sugar.html',
        data=db.session.query(Sugar).order_by(Sugar.id.asc()).all())


@blueprint.route('/add_sugar', methods=['GET', 'POST'])
@login_required
def add_sugar():
    obj = Sugar()
    obj.current_time = datetime.now()
    obj.sugar = float(1)
    db.session.add(obj)
    db.session.commit()
    return jsonify({'sugar': 1})
