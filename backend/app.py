from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(100), nullable=False)
    entity_name = db.Column(db.String(100), nullable=False)
    task_type = db.Column(db.String(100), nullable=False)
    task_time = db.Column(db.String(100), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(10), default='open')  # open or closed

with app.app_context():
    db.create_all()


@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json
    task = Task(
        date=data['date'],
        entity_name=data['entity_name'],
        task_type=data['task_type'],
        task_time=data['task_time'],
        contact_person=data['contact_person'],
        phone=data.get('phone', ''),
        note=data.get('note', ''),
        status=data.get('status', 'open')
    )
    db.session.add(task)
    db.session.commit()
    return jsonify({"message": "Task created", "task": task.id}), 201


@app.route('/tasks', methods=['GET'])
def get_tasks():
    filters = request.args
    query = Task.query

    if 'contact_person' in filters:
        query = query.filter_by(contact_person=filters['contact_person'])
    if 'task_type' in filters:
        query = query.filter_by(task_type=filters['task_type'])
    if 'status' in filters:
        query = query.filter_by(status=filters['status'])
    if 'date' in filters:
        query = query.filter_by(date=filters['date'])
    if 'entity_name' in filters:
        query = query.filter_by(entity_name=filters['entity_name'])

    tasks = query.all()
    return jsonify([{
        'id': t.id,
        'date': t.date,
        'entity_name': t.entity_name,
        'task_type': t.task_type,
        'task_time': t.task_time,
        'contact_person': t.contact_person,
        'phone': t.phone,
        'note': t.note,
        'status': t.status
    } for t in tasks])


@app.route('/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    task = Task.query.get_or_404(task_id)
    return jsonify({
        'id': task.id,
        'date': task.date,
        'entity_name': task.entity_name,
        'task_type': task.task_type,
        'task_time': task.task_time,
        'contact_person': task.contact_person,
        'phone': task.phone,
        'note': task.note,
        'status': task.status
    })


@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json

    task.date = data.get('date', task.date)
    task.entity_name = data.get('entity_name', task.entity_name)
    task.task_type = data.get('task_type', task.task_type)
    task.task_time = data.get('task_time', task.task_time)
    task.contact_person = data.get('contact_person', task.contact_person)
    task.phone = data.get('phone', task.phone)
    task.note = data.get('note', task.note)
    task.status = data.get('status', task.status)

    db.session.commit()
    return jsonify({"message": "Task updated"})


@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"})


@app.route('/tasks/<int:task_id>/status', methods=['PATCH'])
def change_status(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json
    task.status = data['status']
    
    if not data or 'status' not in data:
        return jsonify({"error": "Missing 'status' in request body"}), 400
    
    db.session.commit()
    return jsonify({"message": f"Task status changed to {task.status}"})

@app.route('/tasks/<int:task_id>/note', methods=['PATCH'])
def update_note(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.json

    if 'note' not in data:
        return jsonify({"error": "Note field is required"}), 400

    task.note = data['note']
    db.session.commit()
    return jsonify({"message": "Note updated", "note": task.note})


if __name__ == '__main__':
    app.run(debug=True)
