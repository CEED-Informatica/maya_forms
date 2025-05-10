// React Route DOM
import { Navigate, Route, Routes } from "react-router-dom"

import { ThemeProvider } from "@/components/theme-provider"

// Providers. Obtienen datos y los comparte con toda la app
import DataInfoProvider from "@/components/data/data-info-provider"
import DataUserProvider from "@/components/data/data-user-provider"

import "./App.css";

import Profile from '@/pages/Profile'
import Splash from '@/pages/Splash'
import Layout from "@/components/layout"

function App() {
  return (
   <DataInfoProvider>
    <DataUserProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/splash" element={ <Splash/>} />
          <Route element={ <Layout/>} >
            <Route index path="/" element={ <Navigate replace to="/profile" /> }/>
            <Route path="/profile" element={ <Profile/> }/>
          </Route>
        </Routes>
      </ThemeProvider>
    </DataUserProvider> 
  </DataInfoProvider>
  );
}

export default App;
