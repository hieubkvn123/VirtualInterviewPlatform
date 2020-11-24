import mysql.connector
import json 

from config import db_config
from argparse import ArgumentParser

parser = ArgumentParser()
parser.add_argument('--file', required=True,
    help='Path to the question files')
args = vars(parser.parse_args())

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

connection = create_connection()
cursor = connection.cursor()
values = []

lines = open(args['file'], 'r').readlines()
question_type=''
for_role = ''
duration = ''

for i, line in enumerate(lines):
    line = line.strip()
    if(i == 0):
        metadata = json.loads(line.strip())
        question_type = metadata['type']
        if('role' in metadata):
            for_role = metadata['role']
        duration = int(metadata['duration'])
    else:
        splits = line.split('.')
        question_id = int(splits[0])
        question_content = splits[1]
        row = (question_id, question_type, question_content, duration, for_role)
        values.append(row)

        print('INSERT INTO QUESTIONS VALUES (%d, "%s", "%s", %d, "%s");' % (question_id, question_type, question_content, duration, for_role))

sql = 'INSERT INTO QUESTIONS VALUES (%s, %s, %s, %s, %s)'
cursor.executemany(sql, values)
connection.commit()