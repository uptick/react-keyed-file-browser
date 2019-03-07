import PropTypes from 'prop-types'
import React from 'react'
// drag and drop
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

// default components (most overridable)
import { DefaultDetail } from './details'
import { DefaultFilter } from './filters'

// default renderers
import { TableHeader } from './headers'
import { TableFile } from './files'
import { TableFolder } from './folders'

// default processors
import { GroupByFolder } from './groupers'
import { SortByName } from './sorters'

import { isFolder } from './utils'

const SEARCH_RESULTS_PER_PAGE = 20

function getItemProps(file, browserProps) {
  return {
    key: `file-${file.key}`,
    fileKey: file.key,
    isSelected: (file.key === browserProps.selection),
    isOpen: file.key in browserProps.openFolders || browserProps.nameFilter,
    isRenaming: browserProps.activeAction === 'rename' && browserProps.actionTarget === file.key,
    isDeleting: browserProps.activeAction === 'delete' && browserProps.actionTarget === file.key,
    isDraft: !!file.draft,
  }
}

class RawFileBrowser extends React.Component {
  static propTypes = {
    files: PropTypes.array.isRequired,
    actions: PropTypes.node,
    showActionBar: PropTypes.bool.isRequired,
    canFilter: PropTypes.bool.isRequired,
    noFilesMessage: PropTypes.string,

    group: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,

    icons: PropTypes.shape({
      Folder: PropTypes.element,
      FolderOpen: PropTypes.element,
      File: PropTypes.element,
      PDF: PropTypes.element,
      Image: PropTypes.element,
      Delete: PropTypes.element,
      Rename: PropTypes.element,
      Loading: PropTypes.element,
      Download: PropTypes.element,
    }),

    nestChildren: PropTypes.bool.isRequired,
    renderStyle: PropTypes.oneOf([
      'list',
      'table',
    ]).isRequired,

    startOpen: PropTypes.bool.isRequired, // TODO: remove?

    headerRenderer: PropTypes.func,
    headerRendererProps: PropTypes.object,
    filterRenderer: PropTypes.func,
    filterRendererProps: PropTypes.object,
    fileRenderer: PropTypes.func,
    fileRendererProps: PropTypes.object,
    folderRenderer: PropTypes.func,
    folderRendererProps: PropTypes.object,
    detailRenderer: PropTypes.func,
    detailRendererProps: PropTypes.object,

    onCreateFiles: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onCreateFolder: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onMoveFile: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onMoveFolder: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onRenameFile: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onRenameFolder: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onDeleteFile: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onDeleteFolder: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
    onDownloadFile: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),

    onSelect: PropTypes.func,
    onSelectFile: PropTypes.func,
    onSelectFolder: PropTypes.func,

    onPreviewOpen: PropTypes.func,
    onPreviewClose: PropTypes.func,

    onFolderOpen: PropTypes.func,
    onFolderClose: PropTypes.func,
  }

  static defaultProps = {
    showActionBar: true,
    canFilter: true,
    noFilesMessage: 'No files.',

    group: GroupByFolder,
    sort: SortByName,

    nestChildren: false,
    renderStyle: 'table',

    startOpen: false,

    headerRenderer: TableHeader,
    headerRendererProps: {},
    filterRenderer: DefaultFilter,
    filterRendererProps: {},
    fileRenderer: TableFile,
    fileRendererProps: {},
    folderRenderer: TableFolder,
    folderRendererProps: {},
    detailRenderer: DefaultDetail,
    detailRendererProps: {},

    icons: {},

    onSelect: (fileOrFolder) => {}, // Always called when a file or folder is selected
    onSelectFile: (file) => {}, //    Called after onSelect, only on file selection
    onSelectFolder: (folder) => {}, //    Called after onSelect, only on folder selection

    onPreviewOpen: (file) => {}, // File opened
    onPreviewClose: (file) => {}, // File closed

    onFolderOpen: (folder) => {}, // Folder opened
    onFolderClose: (folder) => {}, // Folder closed
  }

  state = {
    openFolders: {},
    selection: null,
    activeAction: null,
    actionTarget: null,

    nameFilter: '',
    searchResultsShown: SEARCH_RESULTS_PER_PAGE,

    previewFile: null,

    addFolder: null,
  }

  componentDidMount() {
    if (this.props.renderStyle === 'table' && this.props.nestChildren) {
      console.warn('Invalid settings: Cannot nest table children in file browser')
    }

    window.addEventListener('click', this.handleGlobalClick)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleGlobalClick)
  }

  getFile = (key) => this.props.files.find(f => f.key === key)

  // item manipulation
  createFiles = (files, prefix) => {
    this.setState(prevState => {
      const stateChanges = { selection: null }
      if (prefix) {
        stateChanges.openFolders = {
          ...prevState.openFolders,
          [prefix]: true,
        }
      }
      return stateChanges
    }, () => {
      this.props.onCreateFiles(files, prefix)
    })
  }

  createFolder = (key) => {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: key,
    }, this.props.onCreateFolder(key))
  }

  moveFile = (oldKey, newKey) => {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: newKey,
    }, () => {
      this.props.onMoveFile(oldKey, newKey)
    })
  }

  moveFolder = (oldKey, newKey) => {
    this.setState(prevState => {
      const stateChanges = {
        activeAction: null,
        actionTarget: null,
        selection: newKey,
      }
      if (oldKey in prevState.openFolders) {
        stateChanges.openFolders = {
          ...prevState.openFolders,
          [newKey]: true,
        }
      }
      return stateChanges
    }, () => {
      this.props.onMoveFolder(oldKey, newKey)
    })
  }

  renameFile = (oldKey, newKey) => {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: newKey,
    }, () => {
      this.props.onRenameFile(oldKey, newKey)
    })
  }

  renameFolder = (oldKey, newKey) => {
    this.setState(prevState => {
      const stateChanges = {
        activeAction: null,
        actionTarget: null,
      }
      if (prevState.selection.substr(0, oldKey.length) === oldKey) {
        stateChanges.selection = prevState.selection.replace(oldKey, newKey)
      }
      if (oldKey in prevState.openFolders) {
        stateChanges.openFolders = {
          ...prevState.openFolders,
          [newKey]: true,
        }
      }
      return stateChanges
    }, () => {
      this.props.onRenameFolder(oldKey, newKey)
    })
  }

  deleteFile = (key) => {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: null,
    }, () => {
      this.props.onDeleteFile(key)
    })
  }

  deleteFolder = (key) => {
    this.setState(prevState => {
      const stateChanges = {
        activeAction: null,
        actionTarget: null,
        selection: null,
      }
      if (key in prevState.openFolders) {
        stateChanges.openFolders = { ...prevState.openFolders }
        delete stateChanges.openFolders[key]
      }
      return stateChanges
    }, () => {
      this.props.onDeleteFolder(key)
    })
  }

  downloadFile = (key) => {
    this.setState({
      activeAction: null,
      actionTarget: null,
    }, () => {
      this.props.onDownloadFile(key)
    })
  }

  // browser manipulation
  beginAction = (action, key) => {
    this.setState({
      activeAction: action,
      actionTarget: key,
    })
  }

  endAction = () => {
    if (this.state.selection !== null && this.state.selection.indexOf('__new__') !== -1) {
      this.setState({ selection: null })
    }
    this.beginAction(null, null)
  }

  select = (key, selectedType) => {
    const { actionTarget } = this.state
    const shouldClearState = actionTarget !== null && actionTarget !== key
    const selected = this.getFile(key)

    this.setState(prevState => ({
      selection: key,
      actionTarget: shouldClearState ? null : actionTarget,
      activeAction: shouldClearState ? null : prevState.activeAction,
    }), () => {
      this.props.onSelect(selected)

      if (selectedType === 'file') this.props.onSelectFile(selected)
      if (selectedType === 'folder') this.props.onSelectFolder(selected)
    })
  }

  preview = (file) => {
    if (this.state.previewFile && this.state.previewFile.key !== file.key) this.closeDetail()

    this.setState({
      previewFile: file,
    }, () => {
      this.props.onPreviewOpen(file)
    })
  }

  closeDetail = () => {
    this.setState({
      previewFile: null,
    }, () => {
      this.props.onPreviewClose(this.state.previewFile)
    })
  }

  handleShowMoreClick = (event) => {
    event.preventDefault()
    this.setState(prevState => ({
      searchResultsShown: prevState.searchResultsShown + SEARCH_RESULTS_PER_PAGE,
    }))
  }

  toggleFolder = (folderKey) => {
    const isOpen = folderKey in this.state.openFolders
    this.setState(prevState => {
      const stateChanges = {
        openFolders: { ...prevState.openFolders },
      }
      if (isOpen) {
        delete stateChanges.openFolders[folderKey]
      } else {
        stateChanges.openFolders[folderKey] = true
      }
      return stateChanges
    }, () => {
      const callback = isOpen ? 'onFolderClose' : 'onFolderOpen'
      this.props[callback](this.getFile(folderKey))
    })
  }

  openFolder = (folderKey) => {
    this.setState(prevState => ({
      openFolders: {
        ...prevState.openFolders,
        [folderKey]: true,
      },
    }), () => {
      this.props.onFolderOpen(this.getFile(folderKey))
    })
  }

  // event handlers
  handleGlobalClick = (event) => {
    const inBrowser = !!(this.browserRef && this.browserRef.contains(event.target))

    // TODO: updated old-to-new ref styles, but this ref was never set
    const inPreview = !!(this.previewRef && this.previewRef.contains(event.target))

    if (!inBrowser && !inPreview) {
      this.setState({
        selection: null,
        actionTarget: null,
        activeAction: null,
      })
    }
  }
  handleActionBarRenameClick = (event) => {
    event.preventDefault()
    this.beginAction('rename', this.state.selection)
  }
  handleActionBarDeleteClick = (event) => {
    event.preventDefault()
    this.beginAction('delete', this.state.selection)
  }
  handleActionBarAddFolderClick = (event) => {
    event.preventDefault()
    if (this.state.activeAction === 'createFolder') {
      return
    }
    this.setState(prevState => {
      let addKey = ''
      if (prevState.selection) {
        addKey += prevState.selection
        if (addKey.substr(addKey.length - 1, addKey.length) !== '/') {
          addKey += '/'
        }
      }
      addKey += '__new__/'
      const stateChanges = {
        actionTarget: addKey,
        activeAction: 'createFolder',
        selection: addKey,
      }
      if (prevState.selection) {
        stateChanges.openFolders = {
          ...prevState.openFolders,
          [this.state.selection]: true,
        }
      }
      return stateChanges
    })
  }
  handleActionBarDownloadClick = (event) => {
    event.preventDefault()
    this.downloadFile(this.state.selection)
  }
  updateFilter = (newValue) => {
    this.setState({
      nameFilter: newValue,
      searchResultsShown: SEARCH_RESULTS_PER_PAGE,
    })
  }

  getBrowserProps() {
    return {
      // browser config
      nestChildren: this.props.nestChildren,
      fileRenderer: this.props.fileRenderer,
      fileRendererProps: this.props.fileRendererProps,
      folderRenderer: this.props.folderRenderer,
      folderRendererProps: this.props.folderRendererProps,
      icons: this.props.icons,

      // browser state
      openFolders: this.state.openFolders,
      nameFilter: this.state.nameFilter,
      selection: this.state.selection,
      activeAction: this.state.activeAction,
      actionTarget: this.state.actionTarget,

      // browser manipulation
      select: this.select,
      openFolder: this.openFolder,
      toggleFolder: this.toggleFolder,
      beginAction: this.beginAction,
      endAction: this.endAction,
      preview: this.preview,

      // item manipulation
      createFiles: this.props.onCreateFiles ? this.createFiles : undefined,
      createFolder: this.props.onCreateFolder ? this.createFolder : undefined,
      renameFile: this.props.onRenameFile ? this.renameFile : undefined,
      renameFolder: this.props.onRenameFolder ? this.renameFolder : undefined,
      moveFile: this.props.onMoveFile ? this.moveFile : undefined,
      moveFolder: this.props.onMoveFolder ? this.moveFolder : undefined,
      deleteFile: this.props.onDeleteFile ? this.deleteFile : undefined,
      deleteFolder: this.props.onDeleteFolder ? this.deleteFolder : undefined,

      getItemProps: getItemProps,
    }
  }

  renderActionBar(selectedItem) {
    const {
      icons, canFilter, filterRendererProps,
      filterRenderer: FilterRenderer, onCreateFolder,
      onRenameFile, onRenameFolder, onDeleteFile, onDeleteFolder, onDownloadFile,
    } = this.props
    const selectionIsFolder = (selectedItem && !selectedItem.size)
    let filter
    if (canFilter) {
      filter = (
        <FilterRenderer
          value={this.state.nameFilter}
          updateFilter={this.updateFilter}
          {...filterRendererProps}
        />
      )
    }

    let actions
    if (selectedItem) {
      // Something is selected. Build custom actions depending on what it is.
      if (selectedItem.action) {
        // Selected item has an active action against it. Disable all other actions.
        let actionText
        switch (selectedItem.action) {
          case 'delete':
            actionText = 'Deleting ...'
            break

          case 'rename':
            actionText = 'Renaming ...'
            break

          default:
            actionText = 'Moving ...'
            break
        }
        actions = (
          // TODO: Enable plugging in custom spinner.
          <div className="item-actions">
            {icons.Loading} {actionText}
          </div>
        )
      } else {
        actions = []
        if (
          selectionIsFolder &&
          typeof onCreateFolder === 'function' &&
          !this.state.nameFilter
        ) {
          actions.push(
            <li key="action-add-folder">
              <a
                onClick={this.handleActionBarAddFolderClick}
                href="#"
                role="button"
              >
                {icons.Folder}
                &nbsp;Add Subfolder
              </a>
            </li>
          )
        }
        if (
          selectedItem.keyDerived && (
            (!selectionIsFolder && typeof onRenameFile === 'function') ||
            (selectionIsFolder && typeof onRenameFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-rename">
              <a
                onClick={this.handleActionBarRenameClick}
                href="#"
                role="button"
              >
                {icons.Rename}
                &nbsp;Rename
              </a>
            </li>
          )
        }
        if (
          selectedItem.keyDerived && (
            (!selectionIsFolder && typeof onDeleteFile === 'function') ||
            (selectionIsFolder && typeof onDeleteFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-delete">
              <a
                onClick={this.handleActionBarDeleteClick}
                href="#"
                role="button"
              >
                {icons.Delete}
                &nbsp;Delete
              </a>
            </li>
          )
        }
        if (!selectionIsFolder && typeof onDownloadFile === 'function') {
          actions.push(
            <li key="action-download">
              <a
                onClick={this.handleActionBarDownloadClick}
                href="#"
                role="button"
              >
                {icons.Download}
                &nbsp;Download
              </a>
            </li>
          )
        }
        if (actions.length) {
          actions = (<ul className="item-actions">{actions}</ul>)
        } else {
          actions = (<div className="item-actions">&nbsp;</div>)
        }
      }
    } else {
      // Nothing selected: We're in the 'root' folder. Only allowed action is adding a folder.
      actions = []
      if (
        typeof onCreateFolder === 'function' &&
        !this.state.nameFilter
      ) {
        actions.push(
          <li key="action-add-folder">
            <a
              onClick={this.handleActionBarAddFolderClick}
              href="#"
              role="button"
            >
              {icons.Folder}
              &nbsp;Add Folder
            </a>
          </li>
        )
      }
      if (actions.length) {
        actions = (<ul className="item-actions">{actions}</ul>)
      } else {
        actions = (<div className="item-actions">&nbsp;</div>)
      }
    }

    return (
      <div className="action-bar">
        {filter}
        {actions}
      </div>
    )
  }

  renderFiles(files, depth) {
    const {
      fileRenderer: FileRenderer, fileRendererProps,
      folderRenderer: FolderRenderer, folderRendererProps,
    } = this.props
    const browserProps = this.getBrowserProps()
    let renderedFiles = []

    files.map((file) => {
      const thisItemProps = {
        ...browserProps.getItemProps(file, browserProps),
        depth: this.state.nameFilter ? 0 : depth,
      }

      if (!isFolder(file)) {
        renderedFiles.push(
          <FileRenderer
            {...file}
            {...thisItemProps}
            browserProps={browserProps}
            {...fileRendererProps}
          />
        )
      } else {
        if (!this.state.nameFilter) {
          renderedFiles.push(
            <FolderRenderer
              {...file}
              {...thisItemProps}
              browserProps={browserProps}
              {...folderRendererProps}
            />
          )
        }
        if (this.state.nameFilter || (thisItemProps.isOpen && !browserProps.nestChildren)) {
          renderedFiles = renderedFiles.concat(this.renderFiles(file.children, depth + 1))
        }
      }
    })
    return renderedFiles
  }

  render() {
    const browserProps = this.getBrowserProps()
    const headerProps = {
      browserProps,
      fileKey: '',
      fileCount: this.props.files.length,
    }
    let renderedFiles

    let files = this.props.files.concat([])
    if (this.state.activeAction === 'createFolder') {
      files.push({
        key: this.state.actionTarget,
        size: 0,
        draft: true,
      })
    }
    if (this.state.nameFilter) {
      const filteredFiles = []
      const terms = this.state.nameFilter.toLowerCase().split(' ')
      files.map((file) => {
        let skip = false
        terms.map((term) => {
          if (file.key.toLowerCase().trim().indexOf(term) === -1) {
            skip = true
          }
        })
        if (skip) {
          return
        }
        filteredFiles.push(file)
      })
      files = filteredFiles
    }
    if (typeof this.props.group === 'function') {
      files = this.props.group(files, '')
    } else {
      const newFiles = []
      files.map((file) => {
        if (!isFolder(file)) {
          newFiles.push(file)
        }
      })
      files = newFiles
    }
    let selectedItem = null
    const findSelected = (item) => {
      if (item.key === this.state.selection) {
        selectedItem = item
      }
      if (item.children) {
        item.children.map(findSelected)
      }
    }
    files.map(findSelected)
    if (typeof this.props.sort === 'function') {
      files = this.props.sort(files)
    }

    let header
    let contents = this.renderFiles(files, 0)
    switch (this.props.renderStyle) {
      case 'table':
        if (!contents.length) {
          if (this.state.nameFilter) {
            contents = (<tr>
              <td colSpan="100">
                No files matching "{this.state.nameFilter}".
              </td>
            </tr>)
          } else {
            contents = (<tr>
              <td colSpan="100">
                {this.props.noFilesMessage}
              </td>
            </tr>)
          }
        } else {
          if (this.state.nameFilter) {
            const numFiles = contents.length
            contents = contents.slice(0, this.state.searchResultsShown)
            if (numFiles > contents.length) {
              contents.push(<tr key="show-more">
                <td colSpan="100">
                  <a
                    onClick={this.handleShowMoreClick}
                    href="#"
                  >
                    Show more results
                  </a>
                </td>
              </tr>)
            }
          }
        }

        if (this.props.headerRenderer) {
          header = (
            <thead>
              <this.props.headerRenderer
                {...headerProps}
                {...this.props.headerRendererProps}
              />
            </thead>
          )
        }

        renderedFiles = (
          <table cellSpacing="0" cellPadding="0">
            {header}
            <tbody>
              {contents}
            </tbody>
          </table>
        )
        break

      case 'list':
        if (!contents.length) {
          if (this.state.nameFilter) {
            contents = (<p className="empty">No files matching "{this.state.nameFilter}"</p>)
          } else {
            contents = (<p className="empty">No files.</p>)
          }
        } else {
          let more
          if (this.state.nameFilter) {
            const numFiles = contents.length
            contents = contents.slice(0, this.state.searchResultsShown)
            if (numFiles > contents.length) {
              more = (<a
                onClick={this.handleShowMoreClick}
                href="#"
              >
                Show more results
              </a>)
            }
          }
          contents = (
            <div>
              <ul>{contents}</ul>
              {more}
            </div>
          )
        }

        if (this.props.headerRenderer) {
          header = (
            <this.props.headerRenderer
              {...headerProps}
              {...this.props.headerRendererProps}
            />
          )
        }

        renderedFiles = (
          <div>
            {header}
            {contents}
          </div>
        )
        break
    }

    return (
      <div className="rendered-react-keyed-file-browser">
        {this.props.actions}
        <div className="rendered-file-browser" ref={el => { this.browserRef = el }}>
          {this.props.showActionBar && this.renderActionBar(selectedItem)}
          <div className="files">
            {renderedFiles}
          </div>
        </div>
        {this.state.previewFile !== null && (
          <this.props.detailRenderer
            file={this.state.previewFile}
            close={this.closeDetail}
            {...this.props.detailRendererProps}
          />
        )}
      </div>
    )
  }
}

@DragDropContext(HTML5Backend)
class FileBrowser extends RawFileBrowser {}

export default FileBrowser
export { RawFileBrowser }
