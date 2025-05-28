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
import Selector from '@/pages/Selector'
import Form from '@/pages/Form'

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
            <Route path="/selector/:type" element={ <Selector/> }/>
            <Route path="/selector/:type/:study_abbr" element={ <Selector/> }/>
            <Route path="/selector/:type/:study_abbr/:procedure_type" element={ <Form/> }/>
          </Route>
        </Routes>
      </ThemeProvider>
    </DataUserProvider> 
  </DataInfoProvider>
  );
}

export default App;

//<Navigate replace to="/profile" /> 