from flask import Blueprint
from flask import request
from flask import current_app
from flask_cors import CORS 
from config import db_config
from config import system_mail_config

import random
import hashlib
import requests
import string
import mysql.connector

from flask_mail import Message, Mail

auth = Blueprint('auth', __name__, template_folder='templates')
CORS(auth)

ENCRIPTION = False

### Setting up database connection ###
def create_connection():
	connection = mysql.connector.connect(
		host = db_config['host'],
		user = db_config['username'],
		passwd = db_config['password'],
		database = db_config['db'],
		auth_plugin = 'mysql_native_password'
	)

	return connection

def get_random_password(length):
	letters_and_digits = string.ascii_letters + string.digits
	result_str = ''.join((random.choice(letters_and_digits) for i in range(length)))
	
	return result_str

def send_mail(config, message):
	data = {
		'message' : message,
		'sender' : config['email_address'],
		'recipient' : config['recipient']
	}

	r = requests.post('http://localhost:8080/send_mail', data)

	return r
	

def checkUserExists(email):
	connection = create_connection()
	sql = "SELECT * FROM USERS WHERE userMail='%s'" % email
	cursor = connection.cursor()

	cursor.execute(sql)
	results = cursor.fetchall()
	connection.close() 
	if(cursor.rowcount > 0):
		return True	
	else:
		return False

@auth.route('/signup', methods=['POST', 'GET'])
def signup():
	if(request.method == 'POST'):
		name = request.form['name']
		email = request.form['email']
		affl  = request.form['affiliation']
		password = get_random_password(10)

		if(ENCRIPTION):
			password = hashlib.md5(password.encode()).hexdigest()

		connection = create_connection()
		cursor = connection.cursor()

		if(checkUserExists(email)):
			print(checkUserExists(email))
			return 'exist'

		sql = 'INSERT INTO USERS VALUES (DEFAULT, %s, %s, %s, %s)'
		val = (name, email, affl, password)
		cursor.execute(sql, val)
		connection.commit()
		connection.close()

		system_mail_config['recipient'] = email 
		message = 'Your password is %s' % password

		r = send_mail(system_mail_config, message)

		if(r.status_code == 200 and cursor.rowcount > 0):
			return 'success'
		else:
			return 'failed'

@auth.route('/login', methods=['POST'])
def login():
	if(request.method == 'POST'):
		email = request.form['email']
		password = request.form['password']

		if(ENCRIPTION):
			password = hashlib.md5(password.encode()).hexdigest()

		connection = create_connection()
		cursor = connection.cursor()

		sql = "SELECT * FROM USERS WHERE userMail='%s' AND password='%s'"
		cursor.execute(sql % (email, password))
		results = cursor.fetchall()

		if(cursor.rowcount > 0): # user exists
			return 'success'
		else:
			return 'fail'
		