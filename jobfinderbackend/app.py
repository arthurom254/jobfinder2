from flask import Flask, request, jsonify, g
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from functools import wraps
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev_secret_key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI', 'sqlite:///jobboard.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    is_employer = db.Column(db.Boolean, default=False)
    company_name = db.Column(db.String(120), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    jobs = db.relationship('Job', backref='employer', lazy=True)

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    company_name = db.Column(db.String(120), nullable=False)
    location = db.Column(db.String(120), nullable=False)
    is_remote = db.Column(db.Boolean, default=False)
    job_type = db.Column(db.String(50), nullable=False)  # Full-time, Part-time, etc.
    category = db.Column(db.String(50), nullable=False)  # Frontend, Backend, etc.
    experience_level = db.Column(db.String(50), nullable=False)  # Entry, Mid, Senior
    min_salary = db.Column(db.Integer, nullable=True)
    max_salary = db.Column(db.Integer, nullable=True)
    description = db.Column(db.Text, nullable=False)
    application_url = db.Column(db.String(250), nullable=True)
    is_featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    skills = db.relationship('Skill', secondary='job_skills')

class Skill(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

# Association table for job skills
job_skills = db.Table('job_skills',
    db.Column('job_id', db.Integer, db.ForeignKey('job.id'), primary_key=True),
    db.Column('skill_id', db.Integer, db.ForeignKey('skill.id'), primary_key=True)
)

# Helper functions
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data['user_id'])
            g.current_user = current_user
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(*args, **kwargs)
    return decorated

def add_or_get_skills(skill_names):
    skills = []
    for name in skill_names:
        skill = Skill.query.filter_by(name=name.strip().lower()).first()
        if not skill:
            skill = Skill(name=name.strip().lower())
            db.session.add(skill)
        skills.append(skill)
    return skills

# Routes
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409
    
    hashed_password = generate_password_hash(data['password'])
    
    new_user = User(
        email=data['email'],
        password=hashed_password,
        is_employer=data.get('is_employer', False),
        company_name=data.get('company_name')
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User created successfully'}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = jwt.encode({
        'user_id': user.id,
        'exp': datetime.utcnow() + timedelta(days=1)
    }, app.config['SECRET_KEY'])
    
    return jsonify({
        'token': token,
        'user_id': user.id,
        'is_employer': user.is_employer,
        'email': user.email,
        'company_name': user.company_name
    })

@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    
    # Search parameters
    keyword = request.args.get('keyword', '')
    location = request.args.get('location', '')
    category = request.args.get('category', '')
    job_type = request.args.getlist('job_type')
    experience = request.args.getlist('experience')
    skills = request.args.getlist('skills')
    
    # Base query
    query = Job.query
    
    # Apply filters
    if keyword:
        query = query.filter(Job.title.ilike(f'%{keyword}%') | 
                            Job.description.ilike(f'%{keyword}%') | 
                            Job.company_name.ilike(f'%{keyword}%'))
    
    if location:
        if location.lower() == 'remote':
            query = query.filter(Job.is_remote == True)
        else:
            query = query.filter(Job.location.ilike(f'%{location}%'))
    
    if category:
        query = query.filter(Job.category == category)
    
    if job_type:
        query = query.filter(Job.job_type.in_(job_type))
    
    if experience:
        query = query.filter(Job.experience_level.in_(experience))
    
    if skills:
        for skill in skills:
            skill_obj = Skill.query.filter_by(name=skill.lower()).first()
            if skill_obj:
                query = query.filter(Job.skills.contains(skill_obj))
    
    # Order by most recent
    query = query.order_by(Job.created_at.desc())
    
    # Paginate results
    jobs_page = query.paginate(page=page, per_page=per_page, error_out=False)
    
    jobs = []
    for job in jobs_page.items:
        job_data = {
            'id': job.id,
            'title': job.title,
            'company_name': job.company_name,
            'location': job.location,
            'is_remote': job.is_remote,
            'job_type': job.job_type,
            'category': job.category,
            'experience_level': job.experience_level,
            'min_salary': job.min_salary,
            'max_salary': job.max_salary,
            'description': job.description[:200] + '...' if len(job.description) > 200 else job.description,
            'is_featured': job.is_featured,
            'created_at': job.created_at.isoformat(),
            'skills': [skill.name for skill in job.skills]
        }
        jobs.append(job_data)
    
    return jsonify({
        'jobs': jobs,
        'total': jobs_page.total,
        'pages': jobs_page.pages,
        'current_page': page
    })

@app.route('/api/jobs/featured', methods=['GET'])
def get_featured_jobs():
    featured_jobs = Job.query.filter_by(is_featured=True).order_by(Job.created_at.desc()).limit(5).all()
    
    jobs = []
    for job in featured_jobs:
        job_data = {
            'id': job.id,
            'title': job.title,
            'company_name': job.company_name,
            'location': job.location,
            'is_remote': job.is_remote,
            'job_type': job.job_type,
            'min_salary': job.min_salary,
            'max_salary': job.max_salary,
            'description': job.description[:200] + '...' if len(job.description) > 200 else job.description,
            'created_at': job.created_at.isoformat(),
            'skills': [skill.name for skill in job.skills]
        }
        jobs.append(job_data)
    
    return jsonify({'featured_jobs': jobs})

@app.route('/api/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    job_data = {
        'id': job.id,
        'title': job.title,
        'company_name': job.company_name,
        'location': job.location,
        'is_remote': job.is_remote,
        'job_type': job.job_type,
        'category': job.category,
        'experience_level': job.experience_level,
        'min_salary': job.min_salary,
        'max_salary': job.max_salary,
        'description': job.description,
        'application_url': job.application_url,
        'is_featured': job.is_featured,
        'created_at': job.created_at.isoformat(),
        'employer_id': job.user_id,
        'skills': [skill.name for skill in job.skills]
    }
    
    return jsonify({'job': job_data})

@app.route('/api/jobs', methods=['POST'])
@token_required
def create_job():
    if not g.current_user.is_employer:
        return jsonify({'message': 'Only employers can post jobs'}), 403
    
    data = request.get_json()
    
    # Process remote location
    is_remote = False
    location = data['location']
    if 'remote' in location.lower():
        is_remote = True
    
    # Process skills
    skill_names = []
    if 'skills' in data and data['skills']:
        skill_names = [s.strip() for s in data['skills'].split(',')]
    
    new_job = Job(
        title=data['job_title'],
        company_name=data.get('company_name', g.current_user.company_name),
        location=location,
        is_remote=is_remote,
        job_type=data['job_type'],
        category=data['category'],
        experience_level=data['experience'],
        min_salary=data.get('min_salary'),
        max_salary=data.get('max_salary'),
        description=data['description'],
        application_url=data.get('application_url'),
        is_featured=data.get('plan') in ['premium', 'enterprise'],
        user_id=g.current_user.id
    )
    
    # Add skills
    if skill_names:
        new_job.skills = add_or_get_skills(skill_names)
    
    db.session.add(new_job)
    db.session.commit()
    
    return jsonify({'message': 'Job posted successfully', 'job_id': new_job.id}), 201

@app.route('/api/jobs/<int:job_id>', methods=['PUT'])
@token_required
def update_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    if job.user_id != g.current_user.id:
        return jsonify({'message': 'You can only update your own jobs'}), 403
    
    data = request.get_json()
    
    # Process remote location
    if 'location' in data:
        is_remote = False
        location = data['location']
        if 'remote' in location.lower():
            is_remote = True
        job.location = location
        job.is_remote = is_remote
    
    # Update job fields
    if 'job_title' in data:
        job.title = data['job_title']
    if 'company_name' in data:
        job.company_name = data['company_name']
    if 'job_type' in data:
        job.job_type = data['job_type']
    if 'category' in data:
        job.category = data['category']
    if 'experience' in data:
        job.experience_level = data['experience']
    if 'min_salary' in data:
        job.min_salary = data['min_salary']
    if 'max_salary' in data:
        job.max_salary = data['max_salary']
    if 'description' in data:
        job.description = data['description']
    if 'application_url' in data:
        job.application_url = data['application_url']
    if 'plan' in data:
        job.is_featured = data['plan'] in ['premium', 'enterprise']
    
    # Process skills
    if 'skills' in data and data['skills']:
        skill_names = [s.strip() for s in data['skills'].split(',')]
        job.skills = add_or_get_skills(skill_names)
    
    db.session.commit()
    
    return jsonify({'message': 'Job updated successfully'})

@app.route('/api/jobs/<int:job_id>', methods=['DELETE'])
@token_required
def delete_job(job_id):
    job = Job.query.get_or_404(job_id)
    
    if job.user_id != g.current_user.id:
        return jsonify({'message': 'You can only delete your own jobs'}), 403
    
    db.session.delete(job)
    db.session.commit()
    
    return jsonify({'message': 'Job deleted successfully'})

@app.route('/api/categories', methods=['GET'])
def get_categories():
    # You can expand this to pull from a database table if needed
    categories = [
        'Frontend Development',
        'Backend Development',
        'Full Stack Development',
        'Mobile Development',
        'DevOps',
        'Data Science / Analytics',
        'UI/UX Design',
        'Other'
    ]
    return jsonify({'categories': categories})

@app.route('/api/skills', methods=['GET'])
def get_skills():
    skills = Skill.query.all()
    return jsonify({'skills': [skill.name for skill in skills]})

# Initialize the database
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)