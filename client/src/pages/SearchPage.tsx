import { useMyContext } from '../pages/utils/SideBarContext';
import OutputContainer from './components/OutputContainer';

function SearchPage() {
  //@ts-ignore
  const { isCollapsed } = useMyContext();
  return (
    <div
      style={{
        width: isCollapsed ? '94%' : '86%',
        transition: 'width 0.2s ease-in-out',
      }}
    >
      <OutputContainer />
    </div>
  );
}

export default SearchPage;
