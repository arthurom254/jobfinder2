
export async function POST(request) {
    try {
      const data = await request.json();
      const action = data.action;
      
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const endpoint = action === 'register' ? '/api/register' : '/api/login';
      
      const response = await fetch(`${apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data.userData),
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