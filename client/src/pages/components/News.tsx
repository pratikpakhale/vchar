import { useCallback, useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { FaRegCompass } from 'react-icons/fa6';
import React from 'react';

const topIndianCompanies = [
  'Reliance Industries',
  'Tata Consultancy Services (TCS)',
  'HDFC Bank',
  'Infosys',
  'Hindustan Unilever',
  'ICICI Bank',
  'Kotak Mahindra Bank',
  'State Bank of India (SBI)',
  'Bharti Airtel',
  'Wipro',
  'Axis Bank',
  'Bajaj Finance',
  'Tech Mahindra',
  'Maruti Suzuki India',
  'NTPC',
  'Larsen & Toubro',
  'Sun Pharmaceutical Industries',
  'Asian Paints',
  'Tata Steel',
  'HCL Technologies',
  'ITC Limited',
  'Power Grid Corporation of India',
  'UltraTech Cement',
  'Bharat Petroleum Corporation',
  'IndusInd Bank',
  'Oil and Natural Gas Corporation (ONGC)',
  'Coal India',
  'Mahindra & Mahindra',
  'Tata Motors',
  "Dr. Reddy's Laboratories",
];

const randomIndex = Math.floor(Math.random() * topIndianCompanies.length);

export default function NewsContainer() {
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [newsdata, setNewsData] = useState([]);

  const getNewsData = useCallback(async () => {
    try {
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_APP_SERVER_ENDPOINT}/competitor?company_name=${
          topIndianCompanies[randomIndex]
        }`,
        options
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setNewsData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getNewsData();
  }, [getNewsData]);

  return (
    <div className="flex flex-col w-full h-full justify-center items-center pt-10">
      <div className="space-x-4 pb-10 flex flex-row justify-start">
        <div>
          <FaRegCompass className="w-10 h-10 hover:text-purple cursor-pointer" />
        </div>
        <div className="text-4xl noto-sans hover:text-purple cursor-pointer ">
          Discover
        </div>
      </div>

      <div className="pt-10 w-full border-t h-full border-gray-400/35"></div>

      {isLoading ? (
        <div>Crunching latest data...</div>
      ) : (
        <div className="flex flex-col overflow-y-auto h-full">
          {newsdata.map((news, index) => (
            <React.Fragment key={index}>
              <NewsCard news={news} index={index} />
              <div className="p-2"></div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
