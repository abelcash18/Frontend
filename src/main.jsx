import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import "./index.scss"
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthContextProvider } from './context/AuthContext.jsx'
import GlobalLoading from './components/Loading/GlobalLoading'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
      <GlobalLoading />
    </AuthContextProvider>
  </React.StrictMode>,
)
