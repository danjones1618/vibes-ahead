#!/usr/bin/env python3

from flask import Flask, request, abort, g
import mysql.connector as mariadb
from waitress import serve
from flask_cors import CORS
from random import randint
from os import environ
import json

app = Flask(__name__)

def getDBCon():
    if 'db' not in g:
        g.db = mariadb.connect(user=environ['VIBE_USER'], password=environ['VIBE_PASS'], database=environ['VIBE_DB'])
    return g.db

def closeDBCon():
    db = g.pop('db', None)
    if db is not None:
        db.close()

def getCursor():
    return getDBCon().cursor()

@app.route("/getScores", methods=['GET'])
def getScores():
    cursor = getCursor()
    cursor.execute("SELECT `name`, `score`  FROM `scores` ORDER BY `score` DESC;")
    scores = cursor.fetchall()
    scores = list(map(lambda x: {
        "name": x[0],
        "score": int(x[1]),
    }, scores))

    closeDBCon()
    return json.dumps(scores)

@app.route("/saveScore", methods=['POST'])
def saveScore():
    if not request.is_json:
        return abort(400)

    data = request.get_json()

    if "name" not in data or "score" not in data or len(data["name"]) > 3:
        return abort(400)

    try:
        cursor = getCursor()
        cursor.execute("INSERT INTO `scores` (`name`, `score`) VALUES (%s, %s);", (data['name'], data['score']))
        g.db.commit()
        closeDBCon()
        return ("Okay", 200)
    except ValueError:
        closeDBCon()
        return abort(400)

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5049)
    #app.run(host='0.0.0.0', port=5049)
