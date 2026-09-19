import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AppRouter } from './app/router'
import { LanguageProvider } from './i18n/language'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AppRouter />
    </LanguageProvider>
  </StrictMode>,
)
