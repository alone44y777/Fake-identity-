export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // 1. Fetch raw data from target API
    const upstreamResponse = await fetch('https://randomuser.me/api/');
    if (!upstreamResponse.ok) {
      throw new Error(`Upstream API failed: ${upstreamResponse.status}`);
    }

    const rawData = await upstreamResponse.json();
    const u = rawData.results[0];

    // 2. Custom JSON Structure with updated credits
    const customResponse = {
      status: true,
      message: "Data fetched successfully via NexGen Proxy",
      developer: "NexGen Tech",
      provider: "NexGen Tech Zone",
      timestamp: new Date().toISOString(),
      user_profile: {
        identity: {
          full_name: `${u.name.title} ${u.name.first} ${u.name.last}`,
          gender: u.gender,
          avatar: u.picture.large
        },
        contact: {
          email: u.email,
          phone: u.phone,
          cell: u.cell
        },
        location: {
          address: `${u.location.street.number} ${u.location.street.name}`,
          city: u.location.city,
          state: u.location.state,
          country: u.location.country,
          postcode: u.location.postcode,
          coordinates: {
            lat: u.location.coordinates.latitude,
            lng: u.location.coordinates.longitude
          }
        },
        account_security: {
          username: u.login.username,
          password: u.login.password,
          uuid: u.login.uuid
        }
      }
    };

    // 3. Return JSON response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(customResponse);

  } catch (error) {
    res.status(500).json({
      status: false,
      error: error.message,
      developer: "NexGen Tech",
      provider: "NexGen Tech Zone"
    });
  }
}
  
