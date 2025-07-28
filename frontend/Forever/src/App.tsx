import { useState } from 'react'
import './App.css'
import 'remixicon/fonts/remixicon.css'
import HomeSidebar from './components/homeSidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './components/ui/sidebar'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <SidebarProvider>
        <HomeSidebar />
        <SidebarInset>
        <div className="card">
          <SidebarTrigger />
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button>
        </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  )
}

export default App
