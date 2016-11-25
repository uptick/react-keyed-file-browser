import React from 'react'
import ReactDOM from 'react-dom'
import Moment from 'moment'

import FileBrowser from 'react-keyed-file-browser'

var mount = document.querySelectorAll('div.demo-mount-flat-simple');
ReactDOM.render(
  <FileBrowser
    loading={false}
    files={[
      {
        key: 'cat.png',
        modified: +Moment().subtract(1, 'hours'),
        size: 1.5 * 1024 * 1024
      },
      {
        key: 'kitten.png',
        modified: +Moment().subtract(3, 'days'),
        size: 545 * 1024
      },
      {
        key: 'elephant.png',
        modified: +Moment().subtract(3, 'days'),
        size: 52 * 1024
      },
    ]}
  />,
  mount[0]
);
