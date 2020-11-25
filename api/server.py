import threading

from flask import Flask
from flask import request
from flask_cors import CORS

from flask_mail import Mail, Message

### Import all blueprints ###
from mail_server import app as mail_app
from auth import auth 
from vip import vip
from vip import UPLOAD_FOLDER
from config import system_mail_config as mail_conf
from config import ssl_config

mail = Mail()
app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = mail_conf['email_address']
app.config['MAIL_PASSWORD'] = mail_conf['password']
app.config['MAIL_USE_TLS'] = False 
app.config['MAIL_USE_SSL'] = True
mail.init_app(app)

app.register_blueprint(auth, url_prefix='/auth')
app.register_blueprint(vip, url_prefix='/vip')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def home():
    return 'Hello world'

@app.route('/send_mail', methods=['POST'])
def send_mail():
    if(request.method == 'POST'):
        message = request.form['message']
        sender = request.form['sender']
        recipient = request.form['recipient']

        msg = Message('[Virtual Interview System] Password confirmation',
            sender = sender,
            recipients=[recipient])

        msg.body = message

        mail.send(msg)

        return 'success'

def runMailServer():
    mail_app.run(host='0.0.0.0', port=8081)  

if __name__ == '__main__':
    mail_thread = threading.Thread(target=runMailServer, args=())
    mail_thread.daemon = True 
    mail_thread.start()
    app.run(host='0.0.0.0', port=8080, ssl_context=(ssl_config['cert'], ssl_config['key']))
