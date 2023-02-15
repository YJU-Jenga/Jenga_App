import React from 'react';

import RootNavigator from './src/navigation';
import {store} from './store';
import {Provider} from 'react-redux';

export default function App() {
  return (
    <Provider store={store}>
      <RootNavigator />
    </Provider>
  );
}
