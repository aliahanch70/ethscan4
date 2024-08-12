import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const assetIdBase = req.query.asset_id_base;
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://rest.coinapi.io/v1/exchangerate/${assetIdBase}`,
      headers: {
        'Accept': 'text/plain',
        'X-CoinAPI-Key': '54A5EFF1-CBE1-4C4F-889E-915C0FFE45E3',
      },
    };

    const response = await axios(config);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data' });
  }
}
