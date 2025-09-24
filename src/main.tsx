import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@app/App.tsx'
import { ReduxProvider } from '@app/providers/ReduxProvider.tsx'
import { BrowserRouter } from 'react-router-dom'
import '@ant-design/v5-patch-for-react-19';
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <PersistGate 
        loading={null}
        persistor={persistor}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </ReduxProvider>
  </StrictMode>,
)
