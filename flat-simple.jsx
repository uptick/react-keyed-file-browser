import React from 'react'
import ReactDOM from 'react-dom'

import FileBrowser from 'react-keyed-file-browser'

class SimpleFlatDemo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      visible: true,
    };
  }

  render() {
    var browser;
    if (this.state.visible) {
      browser = (
        <FileBrowser
          loading={false}
          files={[]}
        />
      );
    }
    else {
      browser = (<p>Hidden</p>);
    }

    return (
      <div>
        <input
          ref="visible"
          type="checkbox"
          checked={this.state.visible}
          onChange={(event) => {
            this.setState({visible: this.refs.visible.checked});
          }}
        />
        {browser}
      </div>
    );
  }
}

var mount = document.querySelectorAll('div.demo-mount-flat-simple');
ReactDOM.render(
  <SimpleFlatDemo />,
  mount[0]
);
