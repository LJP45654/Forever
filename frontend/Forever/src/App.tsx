import './App.css'
import 'remixicon/fonts/remixicon.css'
import HomeSidebar from './components/homeSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'

function App() {
  return (
    <>
      <SidebarProvider style={{
        "--sidebar-width": "20rem",
        "--sidebar-width-mobile": "20rem",
      } as React.CSSProperties}>
        <HomeSidebar />
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default App
