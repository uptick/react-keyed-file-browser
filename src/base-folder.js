import PropTypes from 'prop-types'
import React from 'react'

class BaseFolder extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    fileKey: PropTypes.string,

    newName: PropTypes.string,
    keyDerived: PropTypes.bool,
    isDraft: PropTypes.bool,
    isRenaming: PropTypes.bool,
    isDeleting: PropTypes.bool,

    connectDragSource: PropTypes.func,
    connectDropTarget: PropTypes.func,
    isDragging: PropTypes.func,
    action: PropTypes.func,

    browserProps: PropTypes.shape({
      select: PropTypes.func,
      toggleFolder: PropTypes.func,
      beginAction: PropTypes.func,
      endAction: PropTypes.func,
      preview: PropTypes.func,

      createFiles: PropTypes.func,
      createFolder: PropTypes.func,
      moveFile: PropTypes.func,
      moveFolder: PropTypes.func,
      renameFolder: PropTypes.func,
      deleteFolder: PropTypes.func,
    }),
  }

  state = {
    newName: this.props.isDraft ? 'New folder' : this.getName(),
  }

  componentDidMount() {
    if (this.props.isDraft) {
      this.selectAllNewName()
    }
  }
  componentDidUpdate(oldProps, oldState) {
    if (!oldProps.isRenaming && this.props.isRenaming) {
      this.selectAllNewName()
    }
  }
  selectAllNewName = () => {
    window.requestAnimationFrame(() => {
      const currentName = this.refs.newName.value
      this.refs.newName.setSelectionRange(0, currentName.length)
      this.refs.newName.focus()
    })
  }

  getName() {
    if (this.props.name) {
      return this.props.name
    }
    const folders = this.props.fileKey.split('/')
    return this.props.newName || folders[folders.length - 2]
  }

  handleFolderClick = (event) => {
    event.stopPropagation()
    this.props.browserProps.select(this.props.fileKey)
  }
  handleFolderDoubleClick = (event) => {
    event.stopPropagation()
    this.toggleFolder()
  }

  handleRenameClick = (event) => {
    if (!this.props.browserProps.renameFolder) {
      return
    }
    this.props.browserProps.beginAction('rename', this.props.fileKey)
  }
  handleNewNameChange = (event) => {
    const newName = this.refs.newName.value
    this.setState(state => {
      state.newName = newName
      return state
    })
  }
  handleRenameSubmit = (event) => {
    event.preventDefault()
    const newName = this.state.newName.trim()
    if (newName.length === 0) {
      // todo: move to props handler
      // window.notify({
      //   style: 'error',
      //   title: 'Invalid new folder name',
      //   body: 'Folder name cannot be blank',
      // })
      return
    }
    if (newName.indexOf('/') !== -1) {
      // todo: move to props handler
      // window.notify({
      //   style: 'error',
      //   title: 'Invalid new folder name',
      //   body: 'Folder names cannot contain forward slashes.',
      // })
      return
    }
    let newKey = this.props.fileKey.substr(0, this.props.fileKey.substr(0, this.props.fileKey.length - 1).lastIndexOf('/'))
    if (newKey.length) {
      newKey += '/'
    }
    newKey += newName
    newKey += '/'
    if (this.props.isDraft) {
      this.props.browserProps.createFolder(newKey)
    } else {
      this.props.browserProps.renameFolder(this.props.fileKey, newKey)
    }
  }

  handleDeleteClick = (event) => {
    if (!this.props.browserProps.deleteFolder) {
      return
    }
    this.props.browserProps.beginAction('delete', this.props.fileKey)
  }
  handleDeleteSubmit = (event) => {
    event.preventDefault()
    if (!this.props.browserProps.deleteFolder) {
      return
    }
    this.props.browserProps.deleteFolder(this.props.fileKey)
  }

  handleCancelEdit = (event) => {
    this.props.browserProps.endAction()
  }

  toggleFolder = () => {
    this.props.browserProps.toggleFolder(this.props.fileKey)
  }

  connectDND(render) {
    const inAction = (this.props.isDragging || this.props.action)
    if (this.props.keyDerived) {
      if (
        typeof this.props.browserProps.moveFolder === 'function' &&
        !inAction &&
        !this.props.isRenaming &&
        !this.props.isDeleting
      ) {
        render = this.props.connectDragSource(render)
      }
      if (
        typeof this.props.browserProps.createFiles === 'function' ||
        typeof this.props.browserProps.moveFolder === 'function' ||
        typeof this.props.browserProps.moveFile === 'function'
      ) {
        render = this.props.connectDropTarget(render)
      }
    }
    return render
  }
}

const dragSource = {
  beginDrag(props) {
    props.browserProps.select(props.fileKey)
    return {
      key: props.fileKey,
    }
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      return
    }

    const dropResult = monitor.getDropResult()

    const fileNameParts = props.fileKey.split('/')
    const folderName = fileNameParts[fileNameParts.length - 2]

    const newKey = `${dropResult.path ? dropResult.path + '/' : ''}${folderName}/`
    // abort of the new folder name contains itself
    if (newKey.substr(0, props.fileKey.length) === props.fileKey) return

    if (newKey !== props.fileKey && props.browserProps.renameFolder) {
      props.browserProps.openFolder(dropResult.path + '/')
      props.browserProps.renameFolder(props.fileKey, newKey)
    }
  },
}

function dragCollect(connect, monitor) {
  return {
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

const BaseFolderConnectors = {
  dragSource,
  dragCollect,
}

export default BaseFolder
export {
  BaseFolderConnectors,
}
