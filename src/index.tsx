import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import 'react-loading-skeleton/dist/skeleton.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './components/_redux/store';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <App />
                <ToastContainer />
            </PersistGate>
        </Provider>
    </React.StrictMode>
);

reportWebVitals();
