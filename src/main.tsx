import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StyleProvider } from '@ant-design/cssinjs';
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <StyleProvider><App /></StyleProvider>
  </React.StrictMode>,
)
