import { createAction, createAsyncAction } from '@lib/redux';

export const updateCurrentUser = createAction('updateCurrentUser');
export const updateCurrentUserAvatar = createAction('updateCurrentUserAvatar');

export const {
  updateUser,
  updateUserSuccess,
  updateUserFail
} = createAsyncAction('updateUser', 'UPDATE_USER');

export const setUpdating = createAction('updatingUser');
export const setUpdateStatus = createAction('updateStatus');

export const setReducer = createAction('setUserReducer');

export const resetUser = createAction('resetUser');
