export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${backendUrl}/api/jobs?${searchParams.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return Response.json(data);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  