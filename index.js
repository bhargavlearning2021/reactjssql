import React from 'react';
import ReactDOM from 'react-dom';
import AppRouter from './routers/AppRouter';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Telugu from './lang/te.json';
import English from './lang/en.json';

const locale = navigator.language;

let holidayLanguage;

if (locale === 'en' || locale === 'en-US') {
  holidayLanguage = English;
} else {
  holidayLanguage = Telugu;
}

const store = configureStore();
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <IntlProvider locale={locale} messages={holidayLanguage}>
        <AppRouter />
      </IntlProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
