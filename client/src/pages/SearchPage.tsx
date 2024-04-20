// import { useMyContext } from '../pages/utils/SideBarContext';
import OutputContainer from './components/OutputContainer';
import { ScrollArea } from '../components/ui/scroll-area';

function SearchPage() {
  //@ts-ignore
  return (
    <div className="py-4 h-screen w-full relative">
      <div className="h-full w-full  border-1 border-gray-100">
        <ScrollArea className="h-full w-full bg-vcharBlack rounded-lg border">
          <OutputContainer />
        </ScrollArea>
      </div>
    </div>
  );
}

export default SearchPage;
