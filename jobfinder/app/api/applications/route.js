export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const authHeader = request.headers.get('authorization');

  try {
    const response = await fetch(`${backendUrl}/api/applications?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader ? { Authorization: authHeader } : {})
      },
    });

    const data = await response.json();
    return Response.json(data, { status: response.status });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
