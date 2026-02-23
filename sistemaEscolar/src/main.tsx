import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import {AppEscolar} from './AppEscolar'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppEscolar />
  </StrictMode>,
)
