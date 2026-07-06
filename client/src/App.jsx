import { useState } from 'react'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gradient mb-4">Parentsphere</h1>
        <p className="text-slate-600 mb-6">Intelligent Parenting & Child Development Platform</p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Get Started
        </button>
      </div>
    </div>
  )
}

export default App
