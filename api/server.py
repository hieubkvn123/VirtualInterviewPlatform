from flask import Flask
from flask import request
from flask_cors import CORS

### Import all blueprints ###
from auth import auth 

app = Flask(__name__)
app.register_blueprint(auth, url_prefix='/auth')
CORS(app)

@app.route('/', methods=['GET', 'POST'])
def home():
    return 'Hello world'



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
