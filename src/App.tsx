// React Route DOM
import { Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"

// Providers. Obtienen datos y los comparte con toda la app
import DataInfoProvider from "@/components/data/data-info-provider"
import DataUserProvider from "@/components/data/data-user-provider"

import "./App.css";

// Páginas
import Splash from '@/pages/Splash'
import Layout from "@/components/layout"
import StartupRouter from '@/pages/StartupRouter'
import Profile from '@/pages/Profile'
import SelectProfile from '@/pages/SelectProfile'
import Studies from '@/pages/Studies'

function App() {
  return (
   <DataInfoProvider>
    <DataUserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/splash" element={ <Splash/>} />
          <Route element={ <Layout/>} >7
            <Route index path="/" element={ <StartupRouter/> }/>
            <Route path="/select_profile" element={ <SelectProfile/> }/>
            <Route path="/profile" element={ <Profile/> }/>
            <Route path="/studies" element={ <Studies/> }/>
          </Route>
        </Routes>
      </ThemeProvider>
    </DataUserProvider> 
  </DataInfoProvider>
  );
}

export default App;

//<Navigate replace to="/profile" /> 