import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'


createRoot(document.getElementById('root')).render(

<StrictMode>

<App />

{/* Global Toast Container */}

<Toaster
position="top-right"
toastOptions={{

style:{
background:"#111827",
color:"#fff",
border:"1px solid #374151",
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