import React from 'react';
import { createRoot } from 'react-dom/client'; // Correctly import createRoot
import App from './App';
import './styles/style8.css';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root for the application
const root = createRoot(rootElement);

// Render the App component
root.render(<App />);
