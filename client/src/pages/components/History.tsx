import { useCallback, useEffect, useState } from 'react';
import { MdOutlineLibraryBooks } from 'react-icons/md';

import { Link } from 'react-router-dom';

import React from 'react';

import { Card, CardDescription, CardTitle } from '../../components/ui/card';

function truncateText(text: string, maxLength: number) {
  if (text && text?.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
}

//@ts-ignore
function NewsCard({ news, index }) {
  return (
    <Card
      style={{ height: '150px', overflow: 'hidden', width: '700px' }}
      className="hover:border-purple"
    >
      <div className="flex flex-row p-4 items-center">
        <div className="flex p-5" style={{ width: '120px', height: '120px' }}>
          {/* <img
                      src={news?.favicons?.high_res}
                      className="w-full h-full object-contain"
                      alt="News Image"
                      style={{ minWidth: '100%', minHeight: '100%' }}
                  /> */}
        </div>
        <div className="flex flex-col flex-grow">
          <div className="flex flex-col space-y-3   cursor-pointer">
            <CardTitle className="hover:text-purple hover:underline">
              <a href={'/search/' + news?.id}>{news?.prompt}</a>
            </CardTitle>
            <CardDescription>{truncateText(news?.answer, 200)}</CardDescription>
          </div>
        </div>
      </div>
    </Card>
  );
}

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
        `${import.meta.env.VITE_APP_SERVER_ENDPOINT}/library`,
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
          <MdOutlineLibraryBooks className="w-10 h-10 hover:text-purple cursor-pointer" />
        </div>
        <div className="text-4xl noto-sans hover:text-purple cursor-pointer ">
          Library
        </div>
      </div>

      <div className="pt-10 w-full border-t h-full border-gray-400/35"></div>

      {isLoading ? (
        <div>Crunching latest data...</div>
      ) : (
        <div className="flex flex-col overflow-y-auto h-full">
          {newsdata.map((news, index) => (
            <React.Fragment key={index}>
              {/* @ts-ignore */}
              <Link to={'/search/' + news?.id}>
                <NewsCard news={news} index={index} />
              </Link>
              <div className="p-2"></div>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
