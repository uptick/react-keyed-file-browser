import React from 'react'
import PropTypes from 'prop-types'
// drag and drop
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

// default renderers
import TableHeader from './headers/table.js'
import TableFolder from './folders/table.js'
import TableFile from './files/table.js'

// default processors
import GroupByFolder from './groupers/by-folder.js'
import SortByName from './sorters/by-name.js'

const SEARCH_RESULTS_PER_PAGE = 20;

function getItemProps(file, browserProps) {
  return {
    key: `file-${file.key}`,
    fileKey: file.key,
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
    isDraft: !!file.draft,
  };
}

class DefaultDetail extends React.Component {
  constructor(props) {
    super(props);

    this.handleCloseClick = ::this.handleCloseClick;
  }

  handleCloseClick(event) {
    if (event) {
      event.preventDefault();
    }
    this.props.close();
  }

  render() {
    var name = this.props.file.key.split('/');
    name = name.length ? name[name.length - 1] : '';

    return (
      <div>
        <h2>Item Detail</h2>
        <dl>
          <dt>Key</dt>
          <dd>{this.props.file.key}</dd>

          <dt>Name</dt>
          <dd>{name}</dd>
        </dl>
        <a href="#" onClick={this.handleCloseClick}>Close</a>
      </div>
    );
  }
}

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.handleGlobalClick = ::this.handleGlobalClick;
    // browser manipulation
    this.select = ::this.select;
    this.openFolder = ::this.openFolder;
    this.toggleFolder = ::this.toggleFolder;
    this.beginAction = ::this.beginAction;
    this.endAction = ::this.endAction;
    this.preview = ::this.preview;
    // file manipulation
    this.renameFile = ::this.renameFile;
    this.renameFolder = ::this.renameFolder;
    this.moveFile = ::this.moveFile;
    this.moveFolder = ::this.moveFolder;
    this.createFiles = ::this.createFiles;
    this.createFolder = ::this.createFolder;
    this.deleteFile = ::this.deleteFile;
    this.deleteFolder = ::this.deleteFolder;
    // action bar
    this.handleActionBarRenameClick = ::this.handleActionBarRenameClick;
    this.handleActionBarDeleteClick = ::this.handleActionBarDeleteClick;
    this.handleActionBarAddFolderClick = ::this.handleActionBarAddFolderClick;
    // detail
    this.closeDetail = ::this.closeDetail;

    this.state = {
      ...this.state,

      openFolders: {},
      selection: null,
      activeAction: null,
      actionTarget: null,

      nameFilter: '',
      searchResultsShown: SEARCH_RESULTS_PER_PAGE,

      previewFile: null,

      addFolder: null,
    };
  }

  componentDidMount() {
    if (this.props.renderStyle == 'table' && this.props.nestChildren) {
      console.warn('Invalid settings: Cannot nest table children in file browser');
    }

    window.addEventListener('click', this.handleGlobalClick);
  }
  componentWillUnmount() {
    window.removeEventListener('click', this.handleGlobalClick);
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
      if (state.selection.substr(0, oldKey.length) === oldKey) {
        state.selection = state.selection.replace(oldKey, newKey);
      }
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
  createFiles(files, prefix) {
    this.setState(state => {
      state.openFolders = {
        ...state.openFolders,
      };
      if (prefix) {
        state.openFolders[prefix] = true;
      }
      state.selection = null;
      return state;
    }, () => {
      this.props.onCreateFiles(files, prefix);
    });
  }
  createFolder(key) {
    this.setState(state => {
      state.activeAction = null;
      state.actionTarget = null;
      state.selection = key;
    }, this.props.onCreateFolder(key));
  }
  deleteFile(key) {
    this.props.onDeleteFile(key);
  }
  deleteFolder(key) {
    this.props.onDeleteFolder(key);
  }

  // browser manipulation
  beginAction(action, key) {
    this.setState(state => {
      state.activeAction = action;
      state.actionTarget = key;
      return state;
    });
  }
  endAction() {
    if (this.state.selection !== null && this.state.selection.indexOf('__new__') != -1) {
      this.setState({selection: null});
    }
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
  closeDetail() {
    this.setState(state => {
      state.previewFile = null;
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
    var inBrowser = !!(this.refs.browser.contains(event.target));
    var inPreview = !!(
      typeof this.refs.preview !== 'undefined'
      && this.refs.preview.contains(event.target)
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
    if (this.state.activeAction === 'createFolder') {
      return;
    }
    var addKey = '';
    if (this.state.selection) {
      addKey += this.state.selection;
      if (addKey.substr(addKey.length - 1, addKey.length) !== '/') {
        addKey += '/';
      }
    }
    addKey += '__new__/';
    this.setState(state => {
      state.actionTarget = addKey;
      state.activeAction = 'createFolder';
      state.selection = addKey;
      state.openFolders = {
        ...state.openFolders,
      };
      if (this.state.selection) {
        state.openFolders[this.state.selection] = true;
      }
      return state;
    });
  }
  handleFilterChange(event) {
    var newValue = this.refs.filter.value;
    this.setState(state => {
      state.nameFilter = newValue;
      state.searchResultsShown = SEARCH_RESULTS_PER_PAGE;
      return state;
    });
  }
  clearFilter() {
    this.setState(state => {
      state.nameFilter = '';
      return state;
    });
  }

  getBrowserProps() {
    return {
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
      select: this.select,
      openFolder: this.openFolder,
      toggleFolder: this.toggleFolder,
      beginAction: this.beginAction,
      endAction: this.endAction,
      preview: this.preview,

      // item manipulation
      renameFile: this.props.onRenameFile ? this.renameFile : undefined,
      renameFolder: this.props.onRenameFolder ? this.renameFolder : undefined,
      moveFile: this.props.onMoveFile ? this.moveFile : undefined,
      moveFolder: this.props.onMoveFolder ? this.moveFolder : undefined,
      createFiles: this.props.onCreateFiles ? this.createFiles : undefined,
      createFolder: this.props.onCreateFolder ? this.createFolder : undefined,
      deleteFile: this.props.onDeleteFile ? this.deleteFile : undefined,
      deleteFolder: this.props.onDeleteFolder ? this.deleteFolder : undefined,

      getItemProps: getItemProps,
    };
  }
  renderActionBar(selectedItem) {
    if (!this.props.showActionBar) {
      return null;
    }

    var selectionIsFolder = (selectedItem && !selectedItem.size);
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
    if (selectedItem) {
      if (selectedItem.action) {
        var actionText;
        switch (selectedItem.action) {
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
        if (
          selectionIsFolder
          && typeof this.props.onCreateFolder === 'function'
          && !this.state.nameFilter
        ) {
          actions.push(
            <li key="action-add-folder">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarAddFolderClick}
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
          selectedItem.keyDerived
          && (
            (!selectionIsFolder && typeof this.props.onDeleteFile === 'function')
            || (selectionIsFolder && typeof this.props.onDeleteFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-delete">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarDeleteClick}
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
          selectedItem.keyDerived
          && (
            (selectionIsFolder && typeof this.props.onRenameFile === 'function')
            || (!selectionIsFolder && typeof this.props.onRenameFolder === 'function')
          )
        ) {
          actions.push(
            <li key="action-rename">
              <a
                className="btn btn-primary btn-sm"
                onClick={this.handleActionBarRenameClick}
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
          actions = (<div className="item-actions">&nbsp;</div>);
        }
      }
    }
    else {
      actions = [];

      if (typeof this.props.onCreateFolder === 'function' && !this.state.nameFilter) {
        actions.push(
          <li key="action-add-folder">
            <a
              className="btn btn-primary btn-sm"
              onClick={this.handleActionBarAddFolderClick}
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
        actions = (<div className="item-actions">&nbsp;</div>);
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
    var browserProps = this.getBrowserProps();
    var renderedFiles = [];
    files.map((file) => {
      var thisItemProps = {
        ...browserProps.getItemProps(file, browserProps),
        depth: this.state.nameFilter ? 0 : depth,
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
    });
    return renderedFiles;
  }
  render() {
    var renderedFiles;
    var browserProps = this.getBrowserProps();
    var headerProps = {
      fileKey: '',
      browserProps: browserProps,
    };

    var files = this.props.files.concat([]);
    if (this.state.activeAction === 'createFolder') {
      files.push({
        key: this.state.actionTarget,
        size: 0,
        draft: true,
      });
    }
    if (this.state.nameFilter) {
      var filteredFiles = [];
      var terms = this.state.nameFilter.split(' ');
      files.map((file) => {
        var skip = false;
        terms.map((term) => {
          if (file.key.toLowerCase().trim().indexOf(term) == -1) {
            skip = true;
            return;
          }
        });
        if (skip) {
          return;
        }
        filteredFiles.push(file);
      });
      files = filteredFiles;
    }
    if (typeof this.props.group === 'function') {
      files = this.props.group(files, '');
    }
    else {
      var newFiles = [];
      files.map((file) => {
        if (file.size) {
          newFiles.push(file);
        }
      });
      files = newFiles;
    }
    var selectedItem = null;
    var findSelected = (item) => {
      if (item.key === this.state.selection) {
        selectedItem = item;
      }
      if (item.children) {
        item.children.map(findSelected);
      }
    }
    files.map(findSelected);
    if (typeof this.props.sort === 'function') {
      files = this.props.sort(files);
    }

    switch (this.props.renderStyle) {
      case 'table':
        var contents = this.renderFiles(files, 0);
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

        var header;
        if (this.props.headerRenderer) {
          header = (
            <thead>
              <this.props.headerRenderer
                {...headerProps}
              />
            </thead>
          );
        }

        renderedFiles = (
          <table border="0" cellSpacing="0" cellPadding="0">
            {header}
            <tbody>
              {contents}
            </tbody>
          </table>
        );
        break;

      case 'list':
        var contents = this.renderFiles(files, 0);
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

        var header;
        if (this.props.headerRenderer) {
          header = (
            <this.props.headerRenderer
              {...headerProps}
            />
          );
        }

        renderedFiles = (
          <div>
            {header}
            {contents}
          </div>
        );
        break;
    }

    var Detail = this.props.detailRenderer;
    return (
      <div className="rendered-react-keyed-file-browser">
        {this.props.actions}
        <div className="rendered-file-browser" ref="browser">
          {this.props.showActionBar && this.renderActionBar(selectedItem)}
          <div className="files">
            {renderedFiles}
          </div>
        </div>
        {this.state.previewFile !== null && (
          <Detail
            file={this.state.previewFile}
            close={this.closeDetail}
          />
        )}
      </div>
    );
  }
}
FileBrowser.defaultProps = {
  showActionBar: true,
  canFilter: true,

  group: GroupByFolder,
  sort: SortByName,

  nestChildren: false,
  renderStyle: 'table',

  startOpen: false,

  headerRenderer: TableHeader,
  folderRenderer: TableFolder,
  fileRenderer: TableFile,
  detailRenderer: DefaultDetail,
};
FileBrowser.PropTypes = {
  showActionBar: PropTypes.bool.isRequired,
  canFilter: PropTypes.bool.isRequired,

  group: PropTypes.func.isRequired,
  sort: PropTypes.func.isRequired,

  nestChildren: PropTypes.bool.isRequired,
  renderStyle: PropTypes.oneOf([
    'list',
    'table',
  ]).isRequired,

  startOpen: PropTypes.bool.isRequired,

  headerRenderer: PropTypes.func,
  folderRenderer: PropTypes.func.isRequired,
  fileRenderer: PropTypes.func.isRequired,
  detailRenderer: PropTypes.func.isRequired,

  onCreateFolder: PropTypes.func,
  onCreateFiles: PropTypes.func,
  onMoveFolder: PropTypes.func,
  onMoveFile: PropTypes.func,
  onRenameFolder: PropTypes.func,
  onRenameFile: PropTypes.func,
  onDeleteFolder: PropTypes.func,
  onDeleteFile: PropTypes.func,
};

export default DragDropContext(HTML5Backend)(FileBrowser)
