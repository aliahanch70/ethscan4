'use client'
import { useState } from 'react';
import axios from 'axios';

export default function CoinRate() {
  const [assetIdBase, setAssetIdBase] = useState('BTC');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/getC`, {
        params: {
          asset_id_base: assetIdBase,
        },
      });
      setData(response.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Coin Rate</h1>
      <input
        type="text"
        value={assetIdBase}
        onChange={(e) => setAssetIdBase(e.target.value.toUpperCase())}
        placeholder="Enter Asset ID (e.g., BTC)"
      />
      <button onClick={fetchData}>Fetch Rate</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>{data.asset_id_base} Rate</h2>
          <p>{JSON.stringify(data)}</p>
        </div>
      )}
    </div>
  );
}
