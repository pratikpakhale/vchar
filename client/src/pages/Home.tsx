
import Search from './components/Search';
import { useMyContext } from '../pages/utils/SideBarContext';

function Home() {
  //@ts-ignore
  const { isCollapsed } = useMyContext();
  return (

    <div
      style={{
        width: isCollapsed ? '94%' : '86%',
        transition: 'width 0.2s ease-in-out',
      }}
    >
      <Search />
    </div>
  );
}

export default Home;
