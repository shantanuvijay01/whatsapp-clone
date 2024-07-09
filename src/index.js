import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
// const method = req.method;
// if (method === "OPTIONS") {
//   res.setHeader('Access-Control-Allow-Origin: *');
//   res.setHeader('Access-Control-Allow-Headers:X-API-KEY, X-Requested-With, Content-Type, Accept, Access-Control-Request-method, Access-Control-Request-Headers, Authorization');
//   res.setHeader('HTTP/1.1 200 OK');
// }

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>  
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
