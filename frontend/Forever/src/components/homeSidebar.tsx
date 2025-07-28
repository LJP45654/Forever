import type React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubItem, SidebarProvider, SidebarRail } from './ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronRight } from 'lucide-react';

const items = [
  {
    title: "Cash",
    url: "",
    icon: "ri-cash-line",
  },
  {
    title: "Deposit",
    url: "#",
    icon: "ri-wallet-line",
  },
  {
    title: "Bonds",
    url: "#",
    icon: "ri-coupon-line",
  },
  {
    title: "Stock",
    url: "#",
    icon: "ri-stock-line",
  },
  {
    title: "Fund",
    url: "#",
    icon: "ri-funds-box-line",
  },
  {
    title: "Other",
    url: "#",
    icon: "ri-more-line",
  }
]
function HomeSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className='data-[slot=sidebar-menu-button]:!p-1.5'>
              <a href='#'>
                <i className='ri-tent-fill text-xl'></i>
                <span className='text-base font-semibold'>Forever.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item) => (
              <Collapsible key={item.title} asChild className='group/collapsible'>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} className='flex gap-4'>
                      <i className={`${item.icon}`} />
                      <span className='font-mono'>{item.title}</span>
                      <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        1
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>

      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default HomeSidebar
