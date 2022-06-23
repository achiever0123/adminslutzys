import React from 'react';
import classNames from 'classnames';
import './loader.less';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  spinning?: boolean,
  // eslint-disable-next-line react/require-default-props
  fullScreen?: boolean
}

const Loader = ({ spinning = false, fullScreen = false }: IProps) => (
  <div
    className={classNames('loader', {
      hidden: !spinning,
      fullScreen
    })}
  >
    <div className="warpper">
      <div className="inner" />
      <div className="text">LOADING</div>
    </div>
  </div>
);

export default Loader;
