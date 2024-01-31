import './styles/reset.css'
import './styles/styles.css'
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'
import { Provider as StateProviderRedux } from 'react-redux'
import { store } from './state/store'

const domNode = document.getElementById('root')
const root = createRoot(domNode)

root.render(
  <StateProviderRedux store={store}>
    <App />
  </StateProviderRedux>
)
