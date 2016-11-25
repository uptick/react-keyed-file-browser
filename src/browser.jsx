import Clone from 'clone'
import React from 'react'
import ReactDom from 'react-dom'
import jQuery from 'jquery'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import LoadingSpinner from './loading-spinner.jsx'

import TableHeader from './headers/table.jsx'
import TableFolder from './folders/table.jsx'
import TableFile from './files/table.jsx'

import GroupByFolder from './groupers/by-folder.jsx'
import SortByName from './sorters/by-name.jsx'

const SEARCH_RESULTS_PER_PAGE = 20;

function organiseFiles(files, filter, group, sort) {
  var organisedFiles = Clone(files);

  if (filter) {
    var filteredFiles = [];
    var terms = filter.split(' ');
    for (var fileIndex = 0; fileIndex < organisedFiles.length; fileIndex++) {
      var file = organisedFiles[fileIndex];
      var skip = false;
      for (var termIndex = 0; termIndex < terms.length; termIndex++) {
        var term = terms[termIndex].toLowerCase().trim();
        if (file.key.toLowerCase().trim().indexOf(term) == -1) {
          skip = true;
          break;
        }
      }
      if (skip) {
        continue;
      }
      filteredFiles.push(file);
    }
    organisedFiles = filteredFiles;
  }
  if (typeof group === 'function') {
    organisedFiles = group(
      organisedFiles,
      ''
    );
  }
  else {
    var newFiles = [];
    organisedFiles.map((file) => {
      if (file.size) {
        newFiles.push(file);
      }
    });
    organisedFiles = newFiles;
  }

  if (typeof sort === 'function') {
    organisedFiles = sort(organisedFiles);
  }

  return organisedFiles;
}

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.handleGlobalClick = this.handleGlobalClick.bind(this);
    this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);

    this.state = {
      ...this.state,

      files: organiseFiles(this.props.files, '', this.props.group, this.props.sort),

      openFolders: {},
      selection: null,
      activeAction: null,
      actionTarget: null,

      nameFilter: '',
      searchResultsShown: SEARCH_RESULTS_PER_PAGE,

      previewFile: null,
      loadedPreviews: {},

      addFolder: null,
      newFolderName: '',
      addFolderPending: false,

      displayed: false,
    };
  }

  componentDidMount() {
    if (this.props.renderStyle == 'table' && this.props.nestChildren) {
      console.warn('Invalid settings: Cannot nest table children in file browser');
    }

    window.addEventListener('click', this.handleGlobalClick);
    window.addEventListener('keydown', this.handleGlobalKeyDown);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.handleGlobalClick);
    window.removeEventListener('keydown', this.handleGlobalKeyDown);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.group !== this.props.group || prevProps.files !== this.props.files) {
      this.reorganiseFiles();
    }
  }

  reorganiseFiles() {
    this.setState({
      files: organiseFiles(
        this.props.files,
        this.state.nameFilter,
        this.props.group,
        this.props.sort,
      ),
    });
  }

  // item manipulation
  renameFile(oldKey, newKey) {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: newKey,
    }, () => {
      this.props.onRenameFile(oldKey, newKey);
    });
  }
  renameFolder(oldKey, newKey) {
    this.setState(state => {
      state.activeAction = null;
      state.actionTarget = null;
      state.selection = newKey;
      if (oldKey in state.openFolders) {
        state.openFolders = {
          ...state.openFolders,
        };
        delete state.openFolders[newKey];
        state.openFolders[newKey] = true;
      }
      return state;
    }, () => {
      this.props.onRenameFolder(oldKey, newKey);
    });
  }
  moveFile(oldKey, newKey) {
    this.setState({
      activeAction: null,
      actionTarget: null,
      selection: newKey,
    }, () => {
      this.props.onMoveFile(oldKey, newKey);
    });
  }
  moveFolder(oldKey, newKey) {
    this.setState(state => {
      state.activeAction = null;
      state.actionTarget = null;
      state.selection = newKey;
      if (oldKey in state.openFolders) {
        state.openFolders = {
          ...state.openFolders,
        };
        delete state.openFolders[newKey];
        state.openFolders[newKey] = true;
      }
      return state;
    }, () => {
      this.props.onMoveFolder(oldKey, newKey);
    });
  }
  createFile(files, prefix) {}
  createFolder(key) {}
  deleteFile(key) {}
  deleteFolder(key) {}

  // browser manipulation
  beginAction(action, key) {
    this.setState(state => {
      state.activeAction = action;
      state.actionTarget = key;
      return state;
    });
  }
  endAction() {
    this.beginAction(null, null);
  }
  select(key) {
    this.setState(state => {
      state.selection = key;
      if (state.actionTarget !== null && state.actionTarget !== key) {
        state.actionTarget = null;
        state.activeAction = null;
      }
      return state;
    });
  }
  preview(file) {
    this.setState(state => {
      state.previewFile = file;
      return state;
    });
  }
  closePreview() {
    this.setState(state => {
      state.previewFile = null;
      return state;
    });
  }
  openFilePath(path) {
    this.setState(state => {
      state.previewFile = null;
      state.nameFilter = '';
      state.searchResultsShown = SEARCH_RESULTS_PER_PAGE;
      state.selection = path;

      var splitPath = path.split('/');
      splitPath.map((pathItem, itemIndex) => {
        var fullPath = '';
        for (var addItemIndex = 0; addItemIndex <= itemIndex; addItemIndex++) {
          fullPath += splitPath[addItemIndex];
          fullPath += '/';
        }
        state.openFolders[fullPath] = true;
      });

      return state;
    });
  }
  closeAddFolder() {
    this.setState(state => {
      state.addFolder = null;
      return state;
    });
  }
  handleShowMoreClick(event) {
    event.preventDefault();
    this.setState(state => {
      state.searchResultsShown += SEARCH_RESULTS_PER_PAGE;
      return state;
    });
  }
  toggleFolder(folderKey) {
    this.setState(state => {
      if (folderKey in state.openFolders)
        delete state.openFolders[folderKey];
      else
        state.openFolders[folderKey] = true;
      return state;
    });
  }
  openFolder(folderKey) {
    this.setState(state => {
      state.openFolders[folderKey] = true;
      return state;
    });
  }

  // event handlers
  handleGlobalClick(event) {
    var inBrowser = (jQuery(this.refs.browser).has(event.target).length > 0);
    var inPreview = (
      typeof this.refs.preview !== 'undefined'
      && jQuery(this.refs.preview).has(event.target).length > 0
    );
    if (!inBrowser && !inPreview) {
      this.setState(state => {
        state.selection = null;
        state.actionTarget = null;
        state.activeAction = null;
        return state;
      });
    }
  }
  handleGlobalKeyDown(event) {
    if (event.which == 27 && this.state.previewFile !== null) {
      this.closePreview();
    }
  }
  handleActionBarRenameClick(event) {
    event.preventDefault();
    this.beginAction('rename', this.state.selection);
  }
  handleActionBarDeleteClick(event) {
    event.preventDefault();
    this.beginAction('delete', this.state.selection);
  }
  handleActionBarAddFolderClick(event) {
    event.preventDefault();
    var addKey = this.state.selection;
    if (addKey.substr(addKey.length - 1, addKey.length) !== '/')
      addKey = addKey.substr(0, addKey.lastIndexOf('/') || 0) + '/';
    this.setState(state => {
      state.addFolder = addKey;
      return state;
    });
  }
  handleFilterChange(event) {
    var newValue = this.refs.filter.value;
    this.setState(state => {
      state.nameFilter = newValue;
      state.searchResultsShown = SEARCH_RESULTS_PER_PAGE;
      return state;
    }, this.reorganiseFiles.bind(this));
  }
  clearFilter() {
    this.setState(state => {
      state.nameFilter = '';
      return state;
    }, this.reorganiseFiles.bind(this));
  }

  renderActionBar() {
    if (!this.props.showActionBar) {
      return null;
    }

    var selectedFile = null;
    if (this.state.selection !== null) {
      var filePart = this.state.selection.split('/');
      filePart = filePart[filePart.length - 1];
      var findInOrganised = (files) => {
        for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
          var file = files[fileIndex];
          if (file.key === this.state.selection)
            selectedFile = file;
          if (file.children)
            findInOrganised(file.children);
        }
      };
      findInOrganised(this.state.files);
    }
    var selectionIsFolder = (selectedFile && !selectedFile.size);

    var filter;
    if (this.props.canFilter) {
      filter = (
        <input
          ref="filter"
          type="search"
          placeholder="Filter files"
          value={this.state.nameFilter}
          onChange={this.handleFilterChange.bind(this)}
        />
      );
    }

    var actions;
    if (selectedFile) {
      if (selectedFile.action) {
        var actionText;
        switch (selectedFile.action) {

          case 'delete':
            actionText = 'Deleting ...';
            break;

          case 'rename':
            actionText = 'Renaming ...';
            break;

          default:
            actionText = 'Moving ...';
            break;
        }
        actions = (
          <div className="item-actions">
            <LoadingSpinner /> {actionText}
          </div>
        );
      }
      else {
        actions = [];
        if (selectionIsFolder && typeof this.props.onAddFolder === 'function') {
          actions.push(
            <li key="action-add-folder">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarAddFolderClick.bind(this)}
                href="#"
                role="button"
              >
                <i className="fa fa-folder-o" aria-hidden="true"></i>
                &nbsp;Add Subfolder
              </a>
            </li>
          );
        }
        if (
          selectedFile.keyDerived
          && (
            (!selectionIsFolder && typeof this.props.onDeleteFile === 'function')
            || (selectionIsFolder && typeof this.props.onDeleteFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-delete">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarDeleteClick.bind(this)}
                href="#"
                role="button"
              >
                <i className="fa fa-trash-o" aria-hidden="true"></i>
                &nbsp;Delete
              </a>
            </li>
          );
        }
        if (
          selectedFile.keyDerived
          && (
            (selectionIsFolder && typeof this.props.onRenameFile === 'function')
            || (!selectionIsFolder && typeof this.props.onRenameFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-rename">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarRenameClick.bind(this)}
                href="#"
                role="button"
              >
                <i className="fa fa-i-cursor" aria-hidden="true"></i>
                &nbsp;Rename
              </a>
            </li>
          );
        }

        if (actions.length) {
          actions = (<ul className="item-actions">{actions}</ul>);
        }
        else {
          actions = (<div className="item-actions"></div>);
        }
      }
    }
    else {
      actions = [];

      if (typeof this.props.onAddFolder === 'function') {
        actions.push(
          <li key="action-add-folder">
            <a
              className="btn btn-primary btn-sm"
              onClick={this.handleActionBarAddFolderClick.bind(this)}
              href="#"
              role="button"
            >
              <i className="fa fa-folder-o" aria-hidden="true"></i>
              &nbsp;Add Folder
            </a>
          </li>
        );
      }

      if (actions.length) {
        actions = (<ul className="item-actions">{actions}</ul>);
      }
      else {
        actions = (<div className="item-actions"></div>);
      }
    }

    return (
      <div className="action-bar">
        {filter}
        {actions}
      </div>
    );
  }
  renderFiles(files, depth) {
    var renderedFiles = [];
    for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
      var file = files[fileIndex];

      var browserProps = {
        // browser config
        nestChildren: this.props.nestChildren,
        folderRenderer: this.props.folderRenderer,
        fileRenderer: this.props.fileRenderer,
        // browser state
        openFolders: this.state.openFolders,
        nameFilter: this.state.nameFilter,
        selection: this.state.selection,
        activeAction: this.state.activeAction,
        actionTarget: this.state.actionTarget,

        // browser manipulation
        select: this.select.bind(this),
        openFolder: this.openFolder.bind(this),
        toggleFolder: this.toggleFolder.bind(this),
        beginAction: this.beginAction.bind(this),
        endAction: this.endAction.bind(this),
        preview: this.preview.bind(this),
      };
      // item manipulation
      if (typeof this.props.onRenameFile === 'function') {
        browserProps.renameFile = this.renameFile.bind(this);
      }
      if (typeof this.props.onRenameFolder === 'function') {
        browserProps.renameFolder = this.renameFolder.bind(this);
      }
      if (typeof this.props.onMoveFile === 'function') {
        browserProps.moveFile = this.moveFile.bind(this);
      }
      if (typeof this.props.onMoveFolder === 'function') {
        browserProps.moveFolder = this.moveFolder.bind(this);
      }
      if (typeof this.props.onCreateFile === 'function') {
        browserProps.createFile = this.createFile.bind(this);
      }
      if (typeof this.props.onCreateFolder === 'function') {
        browserProps.createFolder = this.createFolder.bind(this);
      }
      if (typeof this.props.onDeleteFile === 'function') {
        browserProps.deleteFile = this.deleteFile.bind(this);
      }
      if (typeof this.props.onDeleteFolder === 'function') {
        browserProps.deleteFolder = this.deleteFolder.bind(this);
      }

      var thisItemProps = {
        key: 'file-'+file.key,
        fileKey: file.key,
        depth: this.state.nameFilter ? 0 : depth,

        isSelected: (file.key == browserProps.selection),
        isOpen: (
          file.key in browserProps.openFolders
          || browserProps.nameFilter
        ),
        isRenaming: (
          browserProps.activeAction == 'rename'
          && browserProps.actionTarget == file.key
        ),
        isDeleting: (
          browserProps.activeAction == 'delete'
          && browserProps.actionTarget == file.key
        ),
      };

      if (file.size) {
        renderedFiles.push(
          <this.props.fileRenderer
            {...file}
            {...thisItemProps}
            browserProps={browserProps}
          />
        );
      }
      else {
        if (!this.state.nameFilter) {
          renderedFiles.push(
            <this.props.folderRenderer
              {...file}
              {...thisItemProps}
              browserProps={browserProps}
            />
          );
        }
        if (this.state.nameFilter || (thisItemProps.isOpen && !browserProps.nestChildren)) {
          renderedFiles = renderedFiles.concat(this.renderFiles(file.children, depth + 1));
        }
      }
    }
    return renderedFiles;
  }
  render() {
    var files;
    var headerProps = {
      fileKey: '',
      browserProps: {
        canCreateFiles: this.props.canCreateFiles,
        openFolder: this.openFolder,
        select: this.select,
        upload: this.upload,
      },
    };
    switch (this.props.renderStyle) {
      case 'table':
        var contents;
        if (this.props.loading) {
          contents = (<tr className="loading"><td><LoadingSpinner /> Loading</td></tr>);
        }
        else {
          contents = this.renderFiles(this.state.files, 0);
          if (!contents.length) {
            if (this.state.nameFilter) {
              contents = (<tr>
                <td colSpan="100">
                  No files matching "{this.state.nameFilter}".
                </td>
              </tr>);
            }
            else {
              contents = (<tr>
                <td colSpan="100">
                  No files.
                </td>
              </tr>);
            }
          }
          else {
            if (this.state.nameFilter) {
              var numFiles = contents.length;
              contents = contents.slice(0, this.state.searchResultsShown);
              if (numFiles > contents.length) {
                contents.push(<tr key="show-more">
                  <td colSpan="100">
                    <a
                      onClick={this.handleShowMoreClick.bind(this)}
                      className="btn btn-block btn-info"
                      href="#"
                    >
                      Show more results
                    </a>
                  </td>
                </tr>);
              }
            }
          }
        }

        var header;
        if (this.props.headerRenderer !== null) {
          header = (
            <thead>
              <this.props.headerRenderer
                {...headerProps}
              />
            </thead>
          );
        }

        files = (
          <table border="0" cellSpacing="0" cellPadding="0">
            {header}
            <tbody>
              {contents}
            </tbody>
          </table>
        );
        break;

      case 'list':
        var contents;
        if (this.props.loading) {
          contents = (<p className="loading"><LoadingSpinner /> Loading</p>);
        }
        else {
          contents = this.renderFiles(this.state.files, 0);
          if (!contents.length) {
            if (this.state.nameFilter)
              contents = (<p className="empty">No files matching "{this.state.nameFilter}"</p>);
            else
              contents = (<p className="empty">No files.</p>);
          }
          else {
            var more;
            if (this.state.nameFilter) {
              var numFiles = contents.length;
              contents = contents.slice(0, this.state.searchResultsShown);
              if (numFiles > contents.length) {
                more = (<a
                  onClick={this.handleShowMoreClick.bind(this)}
                  className="btn btn-block btn-info"
                  href="#"
                >
                  Show more results
                </a>);
              }
            }
            contents = (
              <div>
                <ul>{contents}</ul>
                {more}
              </div>
            );
          }
        }

        var header;
        if (this.props.headerRenderer !== null) {
          header = (
            <this.props.headerRenderer
              {...headerProps}
            />
          );
        }

        files = (
          <div>
            {header}
            {contents}
          </div>
        );

        break;

      default:
        files = (<p>Unknown render style: {this.props.renderStyle}</p>);
        break;
    }

    var addFolder;
    var preview;
    if (this.state.addFolder !== null) {
      addFolder = (
        <div onClick={this.closeAddFolder.bind(this)} ref="addFolder">
          <div
            className="modal fade in"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="gridModalLabel"
            aria-hidden="true"
            style={{display: 'block'}}
          >
            <div
              className="modal-dialog"
              role="document"
            >
              <div
                className="modal-content"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <form onSubmit={this.handleAddFolderSubmit.bind(this)}>
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={this.closeAddFolder.bind(this)}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                    <h4 className="modal-title">Add New Folder</h4>
                  </div>
                  <div className="modal-body">
                    <p>
                      Contained within: <span className="text-muted">{this.state.addFolder}</span>
                    </p>
                    <input
                      type="text"
                      value={this.state.newFolderName}
                      onChange={this.handleNewFolderNameChange.bind(this)}
                      ref="newFolderName"
                      className="form-control"
                      autoFocus={true}
                      disabled={this.state.addFolderPending}
                      placeholder="New folder name"
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary pull-xs-left"
                      onClick={this.closeAddFolder.bind(this)}
                    >
                      Close
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={(
                        this.state.addFolderPending
                        || (
                          this.state.newFolderName.length === 0
                          || this.state.newFolderName.indexOf('/') !== -1
                        )
                      )}
                    >
                      Add
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade in"></div>
        </div>
      );
    }
    else {
      if (this.state.previewFile !== null) {
        preview = (
          <p>Preview</p>
        );
      }
    }

    return (
      <div className="rendered-react-keyed-file-browser">
        {this.props.actions}
        <div className="rendered-file-browser" ref="browser">
          {this.renderActionBar()}
          <div className="files">
            {files}
          </div>
        </div>
        {preview}
        {addFolder}
      </div>
    );
  }
}
FileBrowser.defaultProps = {
  showActionBar: true,
  canFilter: true,

  onAddFolder: null,
  onAddFile: null,
  onMoveFolder: null,
  onMoveFile: null,
  onRenameFolder: null,
  onRenameFile: null,
  onDeleteFolder: null,
  onDeleteFile: null,

  group: GroupByFolder,
  sort: SortByName,
  nestChildren: false,

  startOpen: false,

  renderStyle: 'table',
  headerRenderer: TableHeader,
  folderRenderer: TableFolder,
  fileRenderer: TableFile,
};

export default DragDropContext(HTML5Backend)(FileBrowser)
