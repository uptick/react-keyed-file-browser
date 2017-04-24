import React from 'react'
import classNames from 'classnames'

import ApiUtils from 'apps/core/frontend/utils/api.jsx'

import FileUploader from './uploader.jsx'

class DefaultPlaceholder extends React.Component {
  render() {
    return (
      <div style={{
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        paddingTop: '100px',
        color: '#888',
        fontSize: '20px',
        textAlign: 'center',
        border: '1px solid #eee',
      }}>
        <p>No image</p>
        {this.props.children}
      </div>
    );
  }
}

class FileEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      filePending: true,
      fileResult: null,
      fileError: null,

      showUploader: false,

      updatingCache: false,
    };
  }

  componentDidMount() {
    this.loadFile();
  }
  showUploader() {
    this.setState({showUploader: true});
  }

  loadFile() {
    this.setState(state => {
      state.filePending = true;
      state.fileError = null;
      return state;
    }, () => {
      ApiUtils.http_get({
        autoPrefix: false,
        url: this.props.url,
        success: (response) => {
          if (!this.isMounted())
            return;
          this.setState(state => {
            state.filePending = false;
            state.fileResult = response;
            return state;
          });
        },
        error: (response) => {
          if (!this.isMounted())
            return;
          this.setState(state => {
            state.filePending = false;
            state.fileError = response;
            return state;
          });
        },
      });
    });
  }

  handleUploadComplete() {
    this.setState(state => {
      state.showUploader = false;
      return state;
    }, () => {
      if (this.props.updateCache)
        this.updateCache(this.loadFile);
      else
        this.loadFile();
    });
  }
  updateCache(callback) {
    this.setState(state => {
      state.updatingCache = true;
      return state;
    }, () => {
      ApiUtils.http_post({
        autoPrefix: false,
        url: this.props.url,
        data: {
          'action': 'update_cache',
        },
        success: (response) => {
          this.setState(state => {
            state.updatingCache = false;
            return state;
          }, callback);
        },
        error: (response) => {
          this.setState(state => {
            state.updatingCache = false;
            return state;
          }, callback);
        },
        notifyPending: false,
        notifySuccess: false,
        notifyError: false,
      });
    });
  }

  render() {
    var editButton;
    if (!this.state.showUploader && !this.state.filePending && this.state.fileResult.upload) {
      editButton = (
        <div className="edit-button" onClick={this.showUploader}>
          <i
            className="fa fa-pencil-square-o"
            aria-hidden="true"
          ></i> {this.state.fileResult.file === null ? 'Add Image' : 'Edit Image'}
        </div>
      );
    }

    var imageContents;
    var messagePadding = 0;
    if (this.props.height || this.props.minHeight)
      messagePadding = ((this.props.height || this.props.minHeight) / 2) - 14;
    if (this.state.filePending) {
      imageContents = (
        <div className="text-center" style={{paddingTop: messagePadding+'px',}}>
          {ApiUtils.loading_spinner()} Loading ...
        </div>
      );
    }
    else if (this.state.updatingCache) {
      imageContents = (
        <div className="text-center" style={{paddingTop: messagePadding+'px',}}>
          {ApiUtils.loading_spinner()} Updating image ...
        </div>
      );
    }
    else {
      if (this.state.fileResult.file === null) {
        imageContents = (<this.props.placeholder>{editButton}</this.props.placeholder>);
      }
      else {
        imageContents = (
          <div>
            <img src={this.state.fileResult.file.thumbnail_url} style={{maxWidth: '100%',}} />
            {editButton}
          </div>
        );
      }
    }

    var uploaderContents;
    if (this.state.showUploader && !this.props.uploadDisabled) {
      uploaderContents = (<FileUploader
        preuploadConfig={this.state.fileResult.upload}
        handleComplete={this.handleUploadComplete}
      />);
    }

    var containerStyle = {
      position: 'relative',
      textAlign: 'center',
    };
    if (this.props.height)
      containerStyle.height = this.props.height+'px';
    if (this.props.minHeight)
      containerStyle.minHeight = this.props.minHeight+'px';
    return (
      <div className={classNames('rendered-file-editor', {
        'no-margin': this.props.noMargin,
        'full-bleed': this.props.fullBleed,
      })}>
        <div style={containerStyle} className="preview">{imageContents}</div>
        {uploaderContents}
      </div>
    );
  }
}
FileEditor.defaultProps = {
  height: null,
  minHeight: null,
  placeholder: DefaultPlaceholder,
  updateCache: false,

  noMargin: false,
  fullBleed: true,
  uploadDisabled: false,
};

export default FileEditor
