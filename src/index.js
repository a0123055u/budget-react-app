import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { TokenProvider } from './components/TokenService/TokenService';
const root = ReactDOM.createRoot(document.getElementById('root'));


root.render(
  // double API is called due to React.StrictMode in development mode only.
  <React.StrictMode>
    <TokenProvider>
    <App />
    </TokenProvider>
 </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
