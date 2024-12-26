export async function POST(req) {
  const url = new URL('https://accounts.zoho.in/oauth/v2/token')

  // Append query parameters for token generation
  url.searchParams.append(
    'refresh_token',
    '1000.ae0046c091a66c27258de0f5135ebe51.cb2584eeb9bf925006581dc2905cf2f3'
  )
  url.searchParams.append('client_id', '1000.6EZLTUIALTECR3YRMXF710326G949I')
  url.searchParams.append(
    'client_secret',
    '10b632e045f117747e6afb545cacdb82740919e2d1'
  )
  url.searchParams.append('grant_type', 'refresh_token')

  try {
    const response = await fetch(url.toString(), { method: 'POST' })

    // If the response is not OK, return an error
    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch token' }), {
        status: response.status,
      })
    }

    const data = await response.json()

    // Return the token with CORS headers
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*', // Allow requests from all origins
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Catch any other errors and return a 500 response
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    })
  }
}
