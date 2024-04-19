import { Skeleton } from '../../components/ui/skeleton';

import Progress from './Progress';

function AnswerSkeleton({
  prompt,
  progress,
  time,
}: {
  prompt: string;
  progress: {
    icon: string;
    message: string;
  }[];
  time: string;
}) {
  return (
    <>
      <div className="w-2/3 h-full flex justify-center items-start pt-10">
        <div className="w-2/3">
          <div className="text-2xl space-grotesk mb-6">{prompt}</div>
          <Progress progress={progress} fullHeight={true} time={time} />
          <Skeleton className="mt-6 w-full   cursor-pointer flex items-center px-6 h-16 py-4 text-wrap" />
          <Skeleton className="mt-2 w-full   cursor-pointer flex items-center px-6 h-10 py-4 text-wrap" />
          <Skeleton className="mt-2 w-full   cursor-pointer flex items-center px-6 h-16 py-4 text-wrap" />
          <Skeleton className="mt-2 w-full   cursor-pointer flex items-center px-6 h-10 py-4 text-wrap" />
        </div>

        <div className="ml-6 w-1/3">
          <div>
            <h1 className="text-xl space-grotesk mb-6">Sources -</h1>
            <div>
              <Skeleton className="mt-2 h-24 w-full  hover:text-purple cursor-pointer flex items-center px-6 py-4 text-wrap" />
              <Skeleton className="mt-2 w-full h-24  hover:text-purple cursor-pointer flex items-center px-6 py-4 text-wrap" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AnswerSkeleton;
