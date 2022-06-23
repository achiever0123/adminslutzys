import { all, spawn } from 'redux-saga/effects';

import userSagas from './user/sagas';
import authSagas from './auth/sagas';

function* rootSaga() {
  yield all([
    ...authSagas,
    ...userSagas
  ].map(spawn));
}

export default rootSaga;
