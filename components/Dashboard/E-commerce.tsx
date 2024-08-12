import React, { useState, useEffect } from 'react';
import { AreaChart, SimpleBar } from "@/components/Charts";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import dynamic from "next/dynamic";
import DataCard from "../Cards/DataCard";
import axios from 'axios'; // Import Axios for making HTTP requests

// const sendToTelegram = async (message: any) => {
//   try {
//     const BOT_TOKEN = '7160750255:AAGX_9Ullz6Nt0pi_bERyplMqbg_C732F6E';
//     const CHAT_ID = '140867059'; // Can be a group chat or your own chat ID
    
//     // Construct the Telegram bot API URL
//     const apiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

//     // Send the message to the bot
//     await axios.post(apiUrl, {
//       chat_id: CHAT_ID,
//       text: message,
//     });

//     console.log('Message sent to Telegram successfully');
//   } catch (error) {
//     console.error('Error sending message to Telegram:', error);
//   }
// };



function ECommerce() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [seconds, setSeconds] = useState(10); // Initial seconds count

  const fetchGasData = () => {
    fetch('https://api.etherscan.io/api' +
      '?module=gastracker' +
      '&action=gasoracle' +
      '&apikey=ZZIEIMYMJSYSQADP3VGXPA3JGY7QE5PT2F')
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        console.log(data.result);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGasData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchGasData();
      setSeconds(10); // Reset seconds count after each fetch
    }, 10000); // Fetch data every 10 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setSeconds(prevSeconds => prevSeconds > 0 ? prevSeconds - 1 : 10); // Decrement seconds count every second
    }, 1000); // Update every second

    return () => clearInterval(countdown); // Cleanup on unmount
  }, []);

  // useEffect(() => {
  //   if (data && data.result && data.result.SafeGasPrice) {
  //     const message = `Safe Gas Price: ${data.result.SafeGasPrice}`;
  //     sendToTelegram(message); // Send SafeGasPrice to Telegram bot
  //   }
  // }, [data]);

  if (isLoading) return <p>Loading...</p>;
  if (!data) return <p>No profile data</p>;

  return (
    <>
      <div>
        <p>Next update in: {seconds} seconds</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        <DataCard name="Safe Gas fee" amount={data.result.SafeGasPrice} edge={seconds}/>
        <DataCard name="Propos gas fee" amount={data.result.ProposeGasPrice} edge={seconds}/>
        <DataCard name="Fast gas fee" amount={data.result.FastGasPrice} edge={seconds}/>
      </div>
      <div className="space-y-5 py-5">
        <AreaChart />
        <SimpleBar />
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <TableOne />
        </div>
        <ChatCard />
      </div>
    </>
  );
}

export default ECommerce;

