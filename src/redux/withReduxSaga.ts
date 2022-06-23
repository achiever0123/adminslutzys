/* eslint-disable func-names */
import nextReduxWrapper from 'next-redux-wrapper';
import nextReduxSaga from 'next-redux-saga';
import store from './store';

export default function (BaseComponent: any) {
  return nextReduxWrapper(store as any)(nextReduxSaga(BaseComponent));
}
