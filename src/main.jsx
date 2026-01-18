  import { StrictMode } from 'react'
  import { createRoot } from 'react-dom/client'
  import { createBrowserRouter, RouterProvider } from 'react-router-dom'

  import App from './App.jsx'
  import AppLayout from './layout/AppLayout.jsx'
  import AddNewLead from './pages/AddNewLead.jsx'
  import AddNewAgent from './pages/AddNewAgent.jsx'
  import LeadList from './pages/LeadList.jsx'
  import LeadDetails from './pages/LeadDetails.jsx'
  import AgentList from './pages/AgentList.jsx'

  import { Flip, ToastContainer } from 'react-toastify'
  import 'react-toastify/dist/ReactToastify.css'

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
          path: "/leads/:leadId",
          element: <LeadDetails />
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
