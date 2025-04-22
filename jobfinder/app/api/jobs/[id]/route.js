export async function GET(request, { params }) {
  try {
    const { id } = params;
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    
    const response = await fetch(`${apiUrl}/api/jobs/${id}`);
    const data = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: data.message }, { status: response.status });
    }
    
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    const token = data.token;
    
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const response = await fetch(`${apiUrl}/api/jobs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data.jobData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: result.message }, { status: response.status });
    }
    
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const data = await request.json();
    const apiUrl = process.env.API_URL || 'http://localhost:5000';
    const token = data.token;
    
    if (!token) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const response = await fetch(`${apiUrl}/api/jobs/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      return Response.json({ error: result.message }, { status: response.status });
    }
    
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}