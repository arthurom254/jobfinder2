export async function GET() {
    try {
      const apiUrl = process.env.API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/categories`);
      const data = await response.json();
      
      return Response.json(data);
    } catch (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
  }