import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './app/store';
import {ToastProvider} from "@/src/context/ToastContext";
import App from "@/src/App";

ReactDOM.createRoot(
    document.getElementById('root')!,
).render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ToastProvider>
            <App/>
          </ToastProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>,
);
