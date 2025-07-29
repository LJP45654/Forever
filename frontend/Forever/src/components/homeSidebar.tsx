import type React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail } from './ui/sidebar';
import NavMain from './navMain';
import NavUser from './navUser';

const categories = [
  {
    title: "Cash",
    url: "#",
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
    title: "Bonds",
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
    title: "Other",
    url: "#",
    icon: "ri-more-line",
    items: []
  }
];
const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
}
function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5' size='lg'>
              <a href='#'>
                <i className='ri-tent-fill text-xl'></i>
                <span className='text-base font-semibold'>Forever.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='font-mono'>
        <NavMain categories={categories} />
      </SidebarContent>
      <SidebarFooter className='font-mono'>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default HomeSidebar
