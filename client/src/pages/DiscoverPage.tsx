import { useState } from 'react';
import { Skeleton } from '../components/ui/skeleton';
import NewsContainer from '../pages/components/News';
import { ScrollArea } from '../components/ui/scroll-area';

//@ts-ignore
const Card = ({ title, content }) => (
  <div className="border-gray-400 border rounded-lg p-4 mb-4">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p>{content}</p>
  </div>
);

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      {/* <Skeleton className="h-52 w-72 rounded-xl" /> */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-72" />
        <Skeleton className="h-4 w-72" />
      </div>
    </div>
  );
}
export default function DiscoverPage() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="p-4 h-screen w-full">
      <div className="border-1 border-gray-100 h-full w-full">
        <ScrollArea className="h-full w-full bg-vcharBlack rounded-lg border">
          {!isLoading && (
            //@ts-ignore
            <NewsContainer />
          )}
          {isLoading && (
            <div className="h-full flex items-center justify-center">
              <SkeletonCard />
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
