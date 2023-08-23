import {createBrowserRouter, Navigate} from "react-router-dom";
import Home from "../pages/Home";
import Main from "../pages/Main";
import Dashboard from "../pages/Main/modules/Dashboard";
import WatchingList from "../pages/Main/modules/WathcingList";
import Inventory from "../pages/Main/modules/Inventory";
import Account from "../pages/Main/modules/Account";
import {ProtectedRoute} from "../auth/protected.route";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import ConfirmEmail from "../pages/ConfirmEmail";
import ForgetPasswordPage from "../pages/ForgetPassword";
import ResetPasswordPage from "../pages/ResetPassword";
import ItemTable from "../pages/Main/modules/WathcingList/components/ItemTable";
import InventoryTable from "../pages/Main/modules/Inventory/components/InventoryTable";
import ImportFromFile from "../pages/Main/modules/WathcingList/components/ImportFromFile";
import ImportBySearch from "../pages/Main/modules/WathcingList/components/ImportBySearch";
import AddItem from "../pages/Main/modules/Additem";
import WatchingItem from "../pages/Main/modules/WathcingList/components/WatchingItem";
import MessageBox from "../pages/Main/modules/MessageBox";


export const routes = [
  {
    path: '/',
    element: (
      <Home />
    )
  },
  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <Main />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        index: true,
        element: <Navigate to={'dashboard'} />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'watching-list',
        element: <WatchingList />,
        children: [
          {
            path: '',
            element: <ItemTable />
          },
          {
            path: 'import-from-file',
            element: <ImportFromFile />
          },
          {
            path: 'import-by-search',
            element: <ImportBySearch />
          },


        ]
      },
      {
        path:'additem',
        element: <AddItem/>
      },
      {
        path: 'inventory',
        element: <Inventory />,
        children: [
          {
            path: '',
            element: <InventoryTable />
          },
          {
            path: 'import-from-file',
            element: <ImportFromFile />
          },
          {
            path: 'import-by-search',
            element: <ImportBySearch />
          }
        ]
      },
      {
        path: 'account',
        element: <Account />
      },
      {
        path: 'message-box',
        element: <MessageBox />
      }
    ]
  },
  {
    path: 'login',
    element: <SignIn />
  },
  {
    path: 'register',
    element: <SignUp />
  },
  {
    path: 'confirm-email',
    element: <ConfirmEmail />
  },
  {
    path: 'forget-password',
    element: <ForgetPasswordPage />
  },
  {
    path: 'reset-password',
    element: <ResetPasswordPage />
  }
];

export const router = createBrowserRouter(routes);