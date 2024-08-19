'use client';

import { useEffect, useState } from 'react';
import { Card, SparkAreaChart } from '@tremor/react';

export default function BtcPage() {
  const [chartData, setChartData] = useState([]);
  const [lastPrice, setLastPrice] = useState(null);
  const [percentageChange, setPercentageChange] = useState(null);
  const [priceClass, setPriceClass] = useState(''); // کلاس CSS برای انیمیشن

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch historical BTC data from your API
        const historyResponse = await fetch('/api/btc');
        const historyResult = await historyResponse.json();

        if (historyResult.result && historyResult.result.rows) {
          const rows = historyResult.result.rows;

          // Prepare chart data
          const formattedData = rows.map((row) => ({
            date: row.date_time.split(' ')[0], // Use date without time
            price: row.unit_price,
          }));

          // Calculate percentage change
          const lastDayPrice = rows[0].unit_price;
          const previousDayPrice = rows[1].unit_price;
          const change = ((lastDayPrice - previousDayPrice) / previousDayPrice) * 100;

          setChartData(formattedData);
          setPercentageChange(change.toFixed(2));
        }

        // Fetch the latest BTC price from Kraken API
        const krakenResponse = await fetch('https://api.kraken.com/0/public/Ticker?pair=BTCUSD');
        const krakenResult = await krakenResponse.json();

        if (krakenResult.result && krakenResult.result.XXBTZUSD) {
          const newLastPrice = parseFloat(krakenResult.result.XXBTZUSD.c[0]).toFixed(2);

          // Apply animation class if the price has changed
          if (lastPrice !== null && newLastPrice !== lastPrice) {
            setPriceClass(newLastPrice > lastPrice ? 'price-up' : 'price-down');
          }

          setLastPrice(newLastPrice);

          // Remove the animation class after 500ms
          setTimeout(() => setPriceClass(''), 500);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Update every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Card className="mx-auto flex max-w-lg items-center justify-between px-4 py-3.5">
      <div className="flex items-center space-x-2.5">
        <p className="text-tremor-content-strong dark:text-dark-tremor-content-strong font-medium">BTC</p>
        <span className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">Bitcoin</span>
      </div>
      <SparkAreaChart
        data={chartData}
        categories={['price']}
        index={'date'}
        colors={['emerald']}
        className="h-8 w-20 sm:h-10 sm:w-36"
      />
      <div className="flex items-center space-x-2.5">
        <span className={`font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong ${priceClass}`}>
          ${lastPrice}
        </span>
        <span className={`rounded px-2 py-1 text-tremor-default font-medium text-white ${percentageChange >= 0 ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {percentageChange >= 0 ? '+' : ''}{percentageChange}%
        </span>
      </div>
    </Card>
  );
}
