import { useCallback, useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { FaRegCompass } from 'react-icons/fa6';
import React from 'react';

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
        `http://localhost:5004/competitor?company_name=tata motors`,
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
