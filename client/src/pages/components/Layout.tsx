import SideBar from './SideBar';
import { useMyContext } from '../utils/SideBarContext';
import { Outlet } from 'react-router-dom';
function Layout() {
  //@ts-ignore
  const { isCollapsed, setisCollapsed } = useMyContext();
  return (
    <div className="flex">
      <div
        className="flex"
        style={{
          width: isCollapsed ? '5%' : '13%',
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <SideBar setisCollapsed={setisCollapsed} isCollapsed={isCollapsed} />
      </div>
      <Outlet />
    </div>
  );
}

export default Layout;
