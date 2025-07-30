import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb'
import { NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function AppHeader() {
  const location = useLocation();
  const [paths, setPaths] = useState<string[]>([]);

  useEffect(() => {
    const currentPaths = location.pathname.split('/').filter(path => path !== '');
    setPaths(currentPaths);
  }, [location]);

  return (
    <header className='flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)'>
      <div className='flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6'>
        <SidebarTrigger className='-ml-1' />
        <Separator
          orientation='vertical'
          className='mx-2 data-[orientation=vertical]:h-4'
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <NavLink to='/'>Home</NavLink>
            </BreadcrumbItem>
            { paths.length != 0 && <BreadcrumbSeparator /> }
            { paths.at(0) && <BreadcrumbItem><NavLink to={paths[0]}>{paths[0]}</NavLink></BreadcrumbItem>}
            { paths.at(1) && <><BreadcrumbSeparator /><BreadcrumbItem>{paths[1]}</BreadcrumbItem></>}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

export default AppHeader