from flask import Blueprint
from flask import request 
from flask import current_app
from flask_cors import CORS 
from config import db_config
from werkzeug.utils import secure_filename

import os
import json
import random
import mysql.connector 

### For video processing ###
import moviepy.editor as mp

vip = Blueprint('vip', __name__, template_folder='templates')
CORS(vip)

### Some config variables ###
QUESTION_RATIO = {
    'General' : 2,
    'Behavioural' : 3,
    'Technical' : 2
}
UPLOAD_FOLDER = './uploads'

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

def randomly_pick(a, n):
    N = len(a)
    picked = []

    for i in range(n):
        random_id = random.randint(0, N - 1)
        while(a[random_id] in picked):
            random_id = random.randint(0, N - 1)

        picked.append(a[random_id])

    return picked
    

def get_random_questions(question_group, num_questions=2):
    connection = create_connection()
    sql = "SELECT * FROM QUESTIONS WHERE questionGroup='%s'" % question_group
    cursor = connection.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    connection.close()

    questions = []
    for row in results:
        selected_cols = {
            'id' : row[0],
            'group' : row[1],
            'question':row[2], 
            'duration':row[3]
        }
        questions.append(selected_cols)

    if(num_questions > len(questions)):
        return questions

    return randomly_pick(questions, num_questions)

@vip.route('/get_questions', methods=['POST']) 
def get_questions():
    general_questions = get_random_questions('General', num_questions=QUESTION_RATIO['General']) 
    situational_questions = get_random_questions('Behavioural', num_questions=QUESTION_RATIO['Behavioural']) 

    questions = general_questions + situational_questions
    random.shuffle(questions)

    questions = json.dumps(questions)

    return questions

@vip.route('/upload', methods=['POST'])
def upload():
    if(request.method == 'POST'):
        file_ = request.files['video-blob']
        file_name = request.form['video-filename']
        file_prefix = file_name.split('.')[0]
        question_id = request.form['question_id']
        question_group = request.form['question_group']
        question = request.form['question']

        user_mail = request.form['user.email']
        user_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], user_mail)
        if(not os.path.exists(user_folder)):
            print('[*] No user folder, creating ... ')
            os.mkdir(user_folder)

        upload_folder = request.form['upload-folder']
        full_upload_folder = os.path.join(current_app.config['UPLOAD_FOLDER'], user_mail, upload_folder)

        if(not os.path.exists(full_upload_folder)):
            print('[*] No upload folder, creating ...')
            os.mkdir(full_upload_folder)

        ### Save question info ###
        json_data_file = os.path.join(full_upload_folder, file_prefix + '.json')
        video_file = os.path.join(full_upload_folder, file_name)        
        json.dump({
            'question_id' : question_id,
            'question_group' : question_group,
            'question' : question
        }, open(json_data_file, 'w'))

        file_.save(video_file)
        return 'success'