  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import { createBrowserRouter, RouterProvider } from 'react-router-dom'

  import App from './App.jsx'
  import AppLayout from './layout/AppLayout.jsx'
  import AddNewLead from './pages/AddNewLead.jsx'
  import AddNewAgent from './pages/AddNewAgent.jsx'
  import LeadList from './pages/LeadList.jsx'
  import LeadsByStatus from './pages/LeadsByStatus.jsx'
  import LeadsByAgent from './pages/LeadsByAgent.jsx'
  import LeadDetails from './pages/LeadDetails.jsx'
  import AgentList from './pages/AgentList.jsx'
  import Sales from './pages/Sales.jsx'
  import Reports from './pages/Reports.jsx'

  import { Flip, ToastContainer } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'
import Settings from './pages/Settings.jsx'

  const router = createBrowserRouter([
    {
      element: <AppLayout />,
      children: [
        {
          path: "/",
          element: <App />
        },
        {
          path: "/leads/new",
          element: <AddNewLead />
        },
        {
          path: "/agents/new",
          element: <AddNewAgent />
        },
        {
          path: "/agents",
          element: <AgentList/>
        },
        {
          path: "/leads",
          element: <LeadList />
        },
        {
          path: "/leads/status",
          element: <LeadsByStatus />
        },
        {
          path: "/leads/agents",
          element: <LeadsByAgent />
        },
        {
          path: "/leads/:leadId",
          element: <LeadDetails />
        },
        {
          path: "/sales",
          element: <Sales />
        },
        {
          path: "/reports",
          element: <Reports />
        },
        {
          path: "/settings",
          element: <Settings />
        },
      ]
    }
  ])


  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
        transition={Flip}
      />
    </StrictMode>,
  )
