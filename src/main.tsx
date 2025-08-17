import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@app/App.tsx'
import { ReduxProvider } from '@app/providers/ReduxProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';



createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ReduxProvider>
  </StrictMode>,
)
