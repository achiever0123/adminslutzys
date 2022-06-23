import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';

import storeHolder from '@lib/storeHolder';
import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== 'production') {
    return applyMiddleware(...middleware);
  }
  return applyMiddleware(...middleware);
};

function configureStore(initialState: any) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(rootReducer, initialState, bindMiddleware([sagaMiddleware])) as any;

  store.sagaTask = sagaMiddleware.run(rootSaga);

  storeHolder.setStore(store);

  return store;
}

export default configureStore;
