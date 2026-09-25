import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'

// NOTE: API base URL and auth headers now live in ./api.js (shared axios
// instance with silent token refresh). Don't set axios.defaults here —
// the auth pages use authApi and the rest use the intercepted client.
createRoot(document.getElementById('root')).render(

<StrictMode>

<App />

{/* Global Toast Container */}

<Toaster
position="top-right"
toastOptions={{

style:{
background:"#241D15",
color:"#F2EAE0",
border:"1px solid #4A3B2B",
borderRadius:"14px"
},

success:{
duration:3000
},

error:{
duration:3000
}

}}
/>

</StrictMode>

)
