import { Button } from '../../components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

import { FiGithub } from 'react-icons/fi';
import { LuArrowLeftToLine } from 'react-icons/lu';
import { LuArrowRightToLine } from 'react-icons/lu';
import { IoSearch } from 'react-icons/io5';
import { FaRegCompass } from 'react-icons/fa6';
import { MdOutlineLibraryBooks } from 'react-icons/md';
import { FaCirclePlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

//@ts-ignore
function SideBar({ setisCollapsed, isCollapsed }) {
  const navigate = useNavigate();
  return isCollapsed ? (
    <div className="flex flex-col items-center justify-between py-6 h-screen">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex items-center justify-center">
          <img src="/logo.png" className="h-8 inline mr-1" />
        </div>
        <div className=" mt-7 w-full flex items-center justify-center  hover:bg-white/10">
          <Button className="space-grotesk text-lg w-3/4 h-11 flex items-center justify-center  text-gray-400 bg-transparent pointer-events-none">
            <div className="pt-1">
              <FaCirclePlus className="w-6 h-6" />
            </div>
          </Button>
        </div>
        <div
          onClick={() => {
            navigate('/');
          }}
          className=" mt-5 w-full flex items-center justify-center  hover:bg-white/10"
        >
          <Button className="space-grotesk text-lg w-3/4 h-11 flex items-center justify-center  text-gray-400 bg-transparent pointer-events-none">
            <div className="flex flex-row space-x-2">
              <div className="pt-1">
                <IoSearch className="w-6 h-6" />
              </div>
            </div>
          </Button>
        </div>
        <div
          onClick={() => {
            navigate('/discover');
          }}
          className=" mt-1 w-full flex items-center justify-center  hover:bg-white/10"
        >
          <Button className="space-grotesk  text-lg w-3/4 h-11 flex items-center justify-center text-gray-400 bg-transparent pointer-events-none">
            <div className="flex flex-row  space-x-2">
              <div className="pt-1">
                <FaRegCompass className="w-6 h-6" />
              </div>
            </div>
          </Button>
        </div>
        <div
          className=" mt-1 w-full flex items-center justify-center  hover:bg-white/10"
          onClick={() => {
            navigate('/library');
          }}
        >
          <Button className="space-grotesk  text-lg w-3/4 h-11 flex items-center  justify-center text-gray-400 bg-transparent pointer-events-none">
            <div className="flex flex-row space-x-2">
              <div className="pt-1">
                <MdOutlineLibraryBooks className="w-6 h-6" />
              </div>
            </div>
          </Button>
        </div>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div
              onClick={() => {
                setisCollapsed(false);
              }}
              className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/80 roboto-regular hover:bg-white/10"
            >
              <LuArrowRightToLine className="w-6 h-6 " />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Expand</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-between py-6 h-screen">
      <div className="flex flex-col w-full items-center justify-center">
        <div className="flex items-center justify-center cursor-pointer ">
          <img
            src="/logo.png"
            className="h-8 inline mr-2"
            onClick={() => {
              navigate('/');
            }}
          />
          <div
            className="noto-sans inline-block text-2xl"
            onClick={() => {
              navigate('/');
            }}
          >
            vChar
          </div>
          <div className="pl-2 pt-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div
                    onClick={() => {
                      setisCollapsed(true);
                    }}
                    className="px-3 py-2 max-w-fit rounded-full flex items-center justify-between cursor-pointer text-white/80 roboto-regular hover:bg-white/10"
                  >
                    <LuArrowLeftToLine className="w-5 h-" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Collapse</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className=" mt-7 w-full flex items-center justify-center">
          <Button
            className="space-grotesk  rounded-full text-lg w-full h-11 flex items-center justify-center text-gray-400 border bg-vcharBlack border-e border-gray-500 hover:border-purple"
            variant="outline"
            onClick={() => {
              navigate('/');
            }}
          >
            New Thread
          </Button>
        </div>
        <div className="flex flex-col items-center justify-start w-full">
          <div
            onClick={() => {
              navigate('/');
            }}
            className=" mt-5 w-full flex items-center justify-start  hover:bg-white/5 rounded-full cursor-pointer"
          >
            <Button
              className="space-grotesk text-lg w-3/4 h-11 flex items-center justify-start  text-gray-400 bg-transparent pointer-events-none cursor-pointer"
              onClick={() => {
                navigate('/');
              }}
            >
              <div className="flex flex-row space-x-2 ">
                <div className="pt-1">
                  <IoSearch />
                </div>
                <div className="cursor-pointer">Home</div>
              </div>
            </Button>
          </div>
          <div
            onClick={() => {
              navigate('/discover');
            }}
            className=" mt-1 w-full flex items-center justify-start  hover:bg-white/5 rounded-full cursor-pointer"
          >
            <Button className="space-grotesk  text-lg w-3/4 h-11 flex items-center justify-start text-gray-400 bg-transparent pointer-events-none">
              <div className="flex flex-row  space-x-2">
                <div className="pt-1">
                  <FaRegCompass />
                </div>
                <div>Discover</div>
              </div>
            </Button>
          </div>
          <div
            className=" mt-1 w-full flex items-center justify-start  hover:bg-white/5 rounded-full cursor-pointer"
            onClick={() => {
              navigate('/library');
            }}
          >
            <Button className="space-grotesk  text-lg w-3/4 h-11 flex items-center  justify-start text-gray-400 bg-transparent pointer-events-none">
              <div className="flex flex-row space-x-2">
                <div className="pt-1">
                  <MdOutlineLibraryBooks />
                </div>
                <div>Library</div>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <a href="https://github.com/hackfest-dev/HF24-Netherites">
        <FiGithub size="25" className="hover:text-purple cursor-pointer" />
      </a>
    </div>
  );
}

export default SideBar;
