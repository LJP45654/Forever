import { ChevronRight } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarMenuSub, SidebarMenuSubItem, SidebarMenuSubButton } from "./ui/sidebar";
import { NavLink } from "react-router-dom";

function NavMain({
  categories,
}: {
  categories: {
    title: string
    url: string
    icon?: string
    items: string[]
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {categories.map((category) => (
          category.items.length === 0 ?
            <SidebarMenuItem key={category.title}>
              <SidebarMenuButton tooltip={category.title} className='flex gap-[8px]'>
                <i className={`${category.icon} text-[16px]`} />
                <span className='text-[16px]'>{category.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            :
            <Collapsible key={category.title} asChild className='group/collapsible'>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={category.title} className='flex gap-[8px]'>
                    <i className={`${category.icon} text-[16px]`} />
                    <NavLink to={category.url} className='grow'>
                      <span className='text-[16px]'>{category.title}</span>
                    </NavLink>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {category.items.map((item) => (
                      <SidebarMenuSubItem key={item}>
                        <SidebarMenuSubButton asChild>
                          <NavLink to={`${category.url}\\${item}`}>
                            <span>{item}</span>
                          </NavLink>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

export default NavMain