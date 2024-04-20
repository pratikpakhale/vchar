import React from 'react';

import { FaTools } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';
import { BsBrowserChrome } from 'react-icons/bs';
import { GiMultipleTargets } from 'react-icons/gi';
import { RiRobot2Fill } from 'react-icons/ri';
import { MdOutlineError } from 'react-icons/md';

import { IoMdTimer } from 'react-icons/io';

import { ScrollArea } from '../../components/ui/scroll-area';

const ProgressTypes = {
  tool: FaTools,
  google: FaGoogle,
  browser: BsBrowserChrome,
  rag: GiMultipleTargets,
  llm: RiRobot2Fill,
  error: MdOutlineError,
};
function Progress({
  progress,
  fullHeight,
  time,
}: {
  progress: {
    icon: string;
    message: string;
  }[];
  fullHeight: boolean;
  time: string;
}) {
  const [heightFull, setHeightFull] = React.useState(fullHeight || false);

  return (
    <>
      <ScrollArea
        className={`${
          heightFull ? 'h-40' : 'h-16'
        }  w-full rounded-md border mt-4 p-4 overflow-y-auto snap-y snap-mandatory transition-height duration-300 ease-in-out`}
        onClick={() => {
          setHeightFull(!heightFull);
        }}
      >
        {progress.map((item, index) => (
          <div
            className="my-1 flex items-center justify-centers font-semibold space-grotesk snap-end"
            key={index}
          >
            {/* @ts-ignore */}
            {React.createElement(ProgressTypes[item.icon])}
            <span className="ml-4">{item.message}</span>
          </div>
        ))}
        {progress.length === 0 && (
          <div className="flex items-center justify-center font-semibold space-grotesk">
            <span>No progress yet</span>
          </div>
        )}
      </ScrollArea>
      <div className="flex justify-end mt-2">
        <div className="flex items-center space-grotesk">
          <IoMdTimer className="mr-2 scale-105" />
          <span>{time}</span>
        </div>
      </div>
    </>
  );
}

export default Progress;
