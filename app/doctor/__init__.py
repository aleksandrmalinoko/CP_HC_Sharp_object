from flask import Blueprint

blueprint = Blueprint(
    'doctor_blueprint',
    __name__,
    url_prefix='/doctor',
    template_folder='templates',
    static_folder='static'
)
