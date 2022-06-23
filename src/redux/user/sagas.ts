import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '@lib/redux';
import { userService } from '@services/index';
import { IReduxAction } from 'src/interfaces';
import {
  updateUser,
  setUpdating,
  setUpdateStatus,
  updateCurrentUser
} from './actions';

const userSagas = [
  // TODO - defind update current user or get from auth user info to reload current user data if needed
  {
    on: updateUser,
    * worker(data: IReduxAction<any>) {
      try {
        yield put(setUpdating(true));
        const updated = yield userService.update(data.payload._id, data.payload);
        yield put(updateCurrentUser(updated.data));
        yield put(setUpdateStatus(true));
        // if this is current user, reload user info?
      } catch (e) {
        // TODO - alert error
      } finally {
        yield put(setUpdateStatus(false));
        yield put(setUpdating(false));
      }
    }
  }
];

export default flatten([createSagas(userSagas)]);
