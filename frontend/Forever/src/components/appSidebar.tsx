import type React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import NavMain from './navMain';
import NavUser from './navUser';
import { NavLink } from 'react-router-dom';

const categories = [
  {
    title: "Cash",
    url: "Cash",
    icon: "ri-cash-line",
    items: ['CNY', 'JPY', 'USD']
  },
  {
    title: "Deposit",
    url: "#",
    icon: "ri-wallet-line",
    items: []
  },
  {
    title: "Bond",
    url: "#",
    icon: "ri-coupon-line",
    items: []
  },
  {
    title: "Stock",
    url: "#",
    icon: "ri-stock-line",
    items: []
  },
  {
    title: "Fund",
    url: "#",
    icon: "ri-funds-box-line",
    items: []
  },
  {
    title: "Others",
    url: "#",
    icon: "ri-more-line",
    items: []
  }
];
const user = {
  name: "Leon",
  email: "Leon@example.com",
  avatar: "/avatars/shadcn.jpg",
}
function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' style={{fontFamily: 'Roboto'}} {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5' size='lg'>
              <NavLink to=''>
                <i className='ri-tent-fill text-xl'></i>
                <span className='text-base font-semibold'>Forever.</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain categories={categories} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar
