// React Route DOM
import { Navigate, Route, Routes } from "react-router-dom";

import { ThemeProvider } from "@/components/theme-provider"

// Obtiene datos publicos y los comparte con toda la app
import DataInfoProvider from "@/components/data/data-info-provider"

import "./App.css";

import Profile from '@/pages/Profile'
import Splash from '@/pages/Splash'
import Layout from "@/components/layout"

function App() {
  return (
    <DataInfoProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/splash" element={ <Splash/>} />
          <Route element={ <Layout/>} >
            <Route index path="/" element={ <Navigate replace to="/profile" /> }/>
            <Route path="/profile" element={ <Profile/> }/>
          </Route>
        </Routes>
      </ThemeProvider>
    </DataInfoProvider>
  );
}

export default App;
