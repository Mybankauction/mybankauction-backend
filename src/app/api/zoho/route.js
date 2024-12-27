import { NextResponse } from 'next/server';

export const formattedDate = (date) => {
  if (!date) return ''
  return new Date(date).toISOString().replace('.000Z', '+05:30')
}
// const localURLPrefix = "https://mybankauction-backend.vercel.app/api/zoho?endpoint=";

function replaceAndEncodeDateInURL(reqUrl) {
  const baseURL = "https://www.zohoapis.in";
  // const localURLPrefix = "http://localhost:3000/api/zoho?endpoint=";
  const localURLPrefix = "https://mybankauction-backend.vercel.app/api/zoho?endpoint=";


  // Decode the entire URL first
  const decodedUrl = decodeURIComponent(reqUrl);

  // Replace the local URL prefix with the base URL
  let newURL = decodedUrl.replace(localURLPrefix, baseURL);

  // Use regex to find and encode date parts if they exist
  const startDateRegex = /Auction_start_date:greater_than:([^&]*)/g;
  const endDateRegex = /Auction_end_date:less_than:([^&]*)/g;

  if (startDateRegex.test(newURL)) {
    newURL = newURL.replace(startDateRegex, (match, p1) => {
      return `Auction_start_date:greater_than:${encodeURIComponent(p1)}`;
    });
  }

  if (endDateRegex.test(newURL)) {
    newURL = newURL.replace(endDateRegex, (match, p1) => {
      return `Auction_end_date:less_than:${encodeURIComponent(p1)}`;
    });
  }

  return newURL;
}


// Common handler for different HTTP methods
export async function handler(request) {
  const reqUrl = request.url
  let endpointWithQuery = reqUrl.split('?endpoint=')[1];
  console.log('...............................................................................................')
  const url = new URL(request.url)
  let criteria
  const endpoint = url.searchParams.get('endpoint')

  if (endpoint) {
    const endpointUrl = new URL(endpoint, url.origin);
    criteria = endpointUrl.searchParams.get('criteria');
  }

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

  // const zohoUrl = `https://www.zohoapis.in${endpoint}`;
  const zohoUrl = replaceAndEncodeDateInURL(reqUrl)

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
      return new NextResponse(null, { status: 204 }, { url: zohoUrl });
    }

    // Handle unsuccessful responses
    if (!response.ok) {
      // returns if url is wrong
      return NextResponse.json(
        { error: 'Failed to fetch data from Zoho API', details: response.statusText, url: zohoUrl, url: zohoUrl, endpointWithQuery: endpointWithQuery, endpoint: endpoint, criteria: criteria, reqUrl: reqUrl },
        { status: response.status }
      );
    }

    // Parse JSON data (if not 204)
    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch (jsonError) {
        return NextResponse.json({ error: 'Failed to parse JSON response', url: zohoUrl }, { status: 500 });
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
    return NextResponse.json({ error: 'Internal Server Error', details: error, url: zohoUrl, endpointWithQuery: endpointWithQuery, endpoint: endpoint, criteria: criteria, reqUrl: reqUrl }, { status: 500 });
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
