from flask_login import login_required
from flask import render_template

from app.chat import blueprint


@blueprint.route('/<template>')
@login_required
def route_template(template):
    return render_template(template + '.html')
