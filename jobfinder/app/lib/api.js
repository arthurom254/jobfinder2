// app/lib/api.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Auth functions
export async function registerUser(userData) {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

// Job functions
export async function fetchJobs(params = {}) {
  const queryParams = new URLSearchParams();
  
  // Add all parameters to query string
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(item => queryParams.append(key, item));
    } else if (value) {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  const url = `${API_BASE_URL}/jobs${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);
  return response.json();
}

export async function fetchFeaturedJobs() {
  const response = await fetch(`${API_BASE_URL}/jobs/featured`);
  return response.json();
}

export async function fetchJobById(id) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
  return response.json();
}

export async function postJob(jobData, token) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  return response.json();
}

export async function updateJob(id, jobData, token) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  return response.json();
}

export async function deleteJob(id, token) {
  const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.json();
}

// Categories and skills
export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return response.json();
}

export async function fetchSkills() {
  const response = await fetch(`${API_BASE_URL}/skills`);
  return response.json();
}