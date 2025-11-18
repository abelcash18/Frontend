import HomePage from "./routes/homePage/homePage";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ListPage from "./routes/listPage/listPage";
import NotFound from "./routes/NotFound/NotFound.jsx"
import Contact from "./routes/contact/contact";
import  { Layout, RequireAuth } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import About from "./routes/about/about";
import AgentsPage from "./routes/agentsPage/agentsPage";
import AgentProfilePage from "./routes/agentProfilePage/agentProfilePage";
import ResetPassword from "./routes/resetPassword/resetPassword";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children:[
        {
          path:"/",
          element:<HomePage/>,
          errorElement:<NotFound/>
        },
        {
          path:"/list",
          element:<ListPage/>
        },
        //  {
        //   path:"*",
        //   element:<NotFound/>
        // },
        {
          path:"/contact",
          element:<Contact/>
        },
        {
          path:"/about",
          element:<About/>
        },
        {
          path:"/agents",
          element:<AgentsPage/>
        },
        {
          path:"/agents/:id",
          element:<AgentProfilePage/>
        },
        {
          path:"/:id",
          element:<SinglePage/>
        },
        {
          path:"/login",
          element:<Login/>
        },
        {
          path:"/register",
          element:<Register/>
        },
        {
          path:"/reset-password",
          element:<ResetPassword/>
        }
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path:"/profile",
          element:<ProfilePage/>,
        },
         {
          path:"/profile/update",
          element:<ProfileUpdatePage/>
        },
      ],
    }
  ]);

  return (
    <RouterProvider router={router}/>
  );
} 

export default App;