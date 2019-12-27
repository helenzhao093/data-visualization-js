from flask import Flask, render_template, flash, request, redirect, jsonify, url_for, send_from_directory

app = Flask(__name__)

@app.route('/')
def upload_file():
    return render_template('index.html')