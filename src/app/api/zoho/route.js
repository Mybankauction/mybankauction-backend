import { NextResponse } from 'next/server'

export const formattedDate = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().replace('.000Z', '+05:30')
}

// Common handler for different HTTP methods
export async function handler(request) {
  const reqUrl = request.url
  const endpointWithQuery = reqUrl.split('?endpoint=')[1];
  const url = new URL(request.url)
  let criteria
  const endpoint = url.searchParams.get('endpoint')

  if (endpoint) {
    const endpointUrl = new URL(endpoint, url.origin);
    criteria = endpointUrl.searchParams.get('criteria');
  }

  console.log({ criteria }, 'criteria')

  console.log("")
  console.log({ endpointWithQuery }, { reqUrl }, { url }, { endpoint }, { criteria })
  console.log("")

  if (!endpoint) {
    return NextResponse.json(
      { error: 'Endpoint parameter is required' },
      { status: 400 }
    )
  }

  const accessToken = request.headers.get('Authorization')
  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token is missing' },
      { status: 401 }
    )
  }
  console.log('')

  console.log({ criteria })
  console.log('')

  // Construct Zoho URL
  // const zohoUrl = `https://www.zohoapis.in${criteria ? `${endpointWithQuery}` : `${endpoint}`}`;

  const decodedEndpoint = decodeURIComponent(criteria ? endpointWithQuery : endpoint);
  const zohoUrl = `https://www.zohoapis.in${decodedEndpoint}`;

  console.log({ zohoUrl })
  try {
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    };

    let response;
    const body = (request.method === 'POST' || request.method === 'PUT') ? await request.json() : null;

    // Use switch case for different HTTP methods
    switch (request.method) {
      case 'POST':
      case 'PUT':
        response = await fetch(zohoUrl, {
          method: request.method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });
        break;

      case 'GET':
        response = await fetch(zohoUrl, { method: 'GET', headers });
        break;

      default:
        return NextResponse.json({ error: 'Unsupported HTTP method' }, { status: 405 });
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    // Handle unsuccessful responses
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from Zoho API', details: response.statusText },
        { status: response.status }
      );
    }

    // Parse JSON data (if not 204)
    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (jsonError) {
        return NextResponse.json({ error: 'Failed to parse JSON response' }, { status: 500 });
      }
    }

    return new NextResponse(JSON.stringify(data || {}), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });

  } catch (error) {
    // Catch any unexpected errors and return to the client
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }

}

// Expose methods individually
export async function POST(request) {
  return handler(request)
}

export async function GET(request) {
  return handler(request)
}

export async function PUT(request) {
  return handler(request)
}
