import { NextResponse } from 'next/server'

// Common handler for different HTTP methods
export async function handler(request) {
  const url = new URL(request.url)
  const endpoint = url.searchParams.get('endpoint')

  console.log({ url }, { endpoint })

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

  const zohoUrl = `https://www.zohoapis.in${endpoint}`

  try {
    let response
    const headers = {
      Authorization: accessToken,
      'Content-Type': 'application/json',
    }

    // Handle different HTTP methods
    if (request.method === 'POST') {
      const body = await request.json()
      response = await fetch(zohoUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      })
      if (response.status === 204) {
        return NextResponse.json({ error: 'No data found' }, { status: 204 })
      }
    } else if (request.method === 'GET') {
      console.log(zohoUrl, 'zohoUrl')
      response = await fetch(zohoUrl, { method: 'GET', headers })
      if (response.status === 204) {
        return NextResponse.json({ error: 'No data found' }, { status: 204 })
      }
      console.log(response, 'response')
    } else if (request.method === 'PUT') {
      const body = await request.json()
      response = await fetch(zohoUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      })
      if (response.status === 204) {
        return NextResponse.json({ error: 'No data found' }, { status: 204 })
      }
    } else {
      return NextResponse.json(
        { error: 'Unsupported HTTP method' },
        { status: 405 }
      )
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch data from Zoho API` },
        { status: response.status }
      )
    }

    const data = await response.json()

    return new NextResponse(JSON.stringify(data), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
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
