import React from 'react'
import ReactDOM from 'react-dom/client'
import '../index.scss'
import { RouterProvider } from 'react-router-dom'
import { TableContextProvider } from './contexts/table-context'
import { GenericError } from './pages/generic-error-page/generic-error'
import { Router } from './router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TableContextProvider>
      <RouterProvider router={Router} fallbackElement={<GenericError />} />
    </TableContextProvider>
  </React.StrictMode>
)
