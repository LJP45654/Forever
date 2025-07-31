import "./App.css";
import "remixicon/fonts/remixicon.css";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { Route, Routes } from "react-router-dom";

import Home from "./components/page/home";
import AppSidebar from "./components/appSidebar";
import AppHeader from "./components/appHeader";
import Detail from "./components/page/detail";

function App() {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "20rem",
            "--sidebar-width-mobile": "20rem",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <div className="flex flex-1 flex-col">
            <AppHeader />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Detail />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default App;
