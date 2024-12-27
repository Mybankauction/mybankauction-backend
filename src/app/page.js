'use client'

export default function Home() {
  const signupApi = async () => {
    const res = await fetch('https://www.zohoapis.in/crm/v7/Accounts/search?criteria=Reserve_price:greater_than:0(Auction_end_date%3Aless_than%3A2025-01-03T18%3A30%3A00%2B05%3A30)&page=1&per_page=300', {
      headers: {
        Authorization:
          'Zoho-oauthtoken 1000.a8f2ffb710311899b1a58563d982c038.6bcdd95ed4c1dc0420c60014a5c6b62b',
        'Content-Type': 'application/json',
      }
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
