// import cors from 'cors'
// import { NextResponse } from 'next/server'

// const corsOptions = {
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }

// const corsMiddleware = cors(corsOptions)

// export async function middleware(request) {
//   // Check if the request is an OPTIONS preflight request
//   if (request.method === 'OPTIONS') {
//     const response = new NextResponse(null, { status: 204 })
//     response.headers.set('Access-Control-Allow-Origin', '*')
//     response.headers.set(
//       'Access-Control-Allow-Methods',
//       'GET, POST, PUT, DELETE, OPTIONS'
//     )
//     response.headers.set(
//       'Access-Control-Allow-Headers',
//       'Content-Type, Authorization'
//     )
//     return response
//   }

//   // Process other requests
//   const response = NextResponse.next()

//   await new Promise((resolve, reject) => {
//     corsMiddleware(request, response, (err) => {
//       if (err) reject(err)
//       resolve()
//     })
//   })

//   return response
// }

// export const config = {
//   matcher: '/api/zoho/*',
// }

// import { NextResponse } from 'next/server'

// export async function middleware(request) {
//   const response = NextResponse.next()

//   // Add CORS headers to all responses
//   response.headers.append('Access-Control-Allow-Origin', '*')
//   // response.headers.append(
//   //   'Access-Control-Allow-Methods',
//   //   'GET, POST, PUT, DELETE, OPTIONS'
//   // )
//   // response.headers.append(
//   //   'Access-Control-Allow-Headers',
//   //   'Content-Type, Authorization'
//   // )

//   // if (request.method === 'OPTIONS') {
//   //   return new NextResponse(null, { status: 204, headers: response.headers })
//   // }

//   return response
// }

// export const config = {
//   matcher: ['/api/:path*'],
// }
