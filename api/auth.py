from flask import Blueprint
from flask import request
from flask_cors import CORS 
from config import db_config

import mysql.connector

auth = Blueprint('auth', __name__, template_folder='templates')
CORS(auth)

### Setting up database connection ###
def create_connection():
    connection = mysql.connector.connect(
        host = db_config['host'],
        user = db_config['username'],
        passwd = db_config['password'],
        database = db_config['db']
    )

    return connection

@auth.route('signup', methods=['POST', 'GET'])
def signup():
    if(request.method == 'POST'):
        name = request.form['name']
        email = request.form['email']
        affl  = request.form['affiliation']

        connection = create_connection()
        cursor = connection.cursor()

        sql = 'INSERT INTO USERS VALUES ()'

        return 'success'