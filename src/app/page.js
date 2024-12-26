'use client'

export default function Home() {
  const signupApi = async () => {
    const res = await fetch('http://localhost:3000/api/zoho/signup', {
      method: 'POST',
      headers: {
        Authorization:
          'Zoho-oauthtoken 1000.7f7fc5ad62ebc611ce5769620ea6563e.e3d985dc85bb69ec44115a0a1d19c246',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            Name1: 'gwegwewe we fwef w',
            Phone: '6454545454',
            Email: 'knfiwnefwe@kwofweffoew',
            referral_id: '1952',
            referred_by: '',
            Last_Name: 'gwegwewe we fwef w',
          },
        ],
      }),
    })
    const data = await res.json()
    console.log(data)
  }

  return (
    <div>
      <button onClick={signupApi}>Click for magic</button>
    </div>
  )
}
