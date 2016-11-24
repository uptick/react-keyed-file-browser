import React from 'react'

class BaseFolder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      newName: this.getName(),
    };
  }

  componentDidUpdate(oldProps, oldState) {
    if (!oldProps.isRenaming && this.props.isRenaming) {
      window.requestAnimationFrame(() => {
        var currentName = this.refs.newName.value;
        this.refs.newName.setSelectionRange(0, currentName.length);
        this.refs.newName.focus();
      });
    }
  }

  getName() {
    if (this.props.name) {
      return this.props.name;
    }
    var folders = this.props.fileKey.split('/');
    return this.props.newName || folders[folders.length - 2];
  }

  handleFolderClick(event) {
    event.stopPropagation();
    this.props.browserProps.select(this.props.fileKey);
  }
  handleFolderDoubleClick(event) {
    event.stopPropagation();
    this.toggleFolder();
  }
  handleRenameClick(event) {
    if (!this.props.browserProps.renameFolder) {
      return;
    }
    this.props.browserProps.beginAction('rename', this.props.fileKey);
  }
  handleNewNameChange(event) {
    var newName = this.refs.newName.value;
    this.setState(state => {
      state.newName = newName;
      return state;
    });
  }
  handleRenameSubmit(event) {
    event.preventDefault();
    var newName = this.state.newName.trim();
    if (newName.length == 0) {
      window.notify({
        style: 'error',
        title: 'Invalid new folder name',
        body: 'Folder name cannot be blank',
      });
      return;
    }
    if (newName.indexOf('/') != -1) {
      window.notify({
        style: 'error',
        title: 'Invalid new folder name',
        body: 'Folder names cannot contain forward slashes.',
      });
      return;
    }
    var newKey = this.props.fileKey.substr(0, this.props.fileKey.substr(0, this.props.fileKey.length - 1).lastIndexOf('/'));
    newKey += '/';
    newKey += newName;
    newKey += '/';
    this.props.browserProps.renameFolder(this.props.fileKey, newKey);
  }

  handleCancelEdit(event) {
    this.props.browserProps.endAction();
  }

  toggleFolder() {
    this.props.browserProps.toggleFolder(this.props.fileKey);
  }
  render() {
    return null;
  }
}

const dragSource = {
  beginDrag(props) {
    props.browserProps.select(props.fileKey);
    return {
      key: props.fileKey,
    };
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }

    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    var fileNameParts = props.fileKey.split('/');
    var folderName = fileNameParts[fileNameParts.length - 2];
    var folderPath = props.fileKey.substr(0, props.fileKey.length - (folderName.length + 2));

    var newKey = dropResult.path + '/' + folderName + '/';
    // abort of the new folder name contains itself
    if (newKey.substr(0, props.fileKey.length) === props.fileKey)
      return;

    if (newKey != props.fileKey && props.browserProps.renameFolder) {
      props.browserProps.openFolder(dropResult.path + '/');
      props.browserProps.renameFolder(props.fileKey, newKey);
    }
  },
};

function dragCollect(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  };
}

export {
  BaseFolder,
  dragSource,
  dragCollect,
}
