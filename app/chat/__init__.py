from flask import Blueprint

blueprint = Blueprint(
    'chat_blueprint',
    __name__,
    url_prefix='/chat',
    template_folder='templates',
    static_folder='static'
)
