import React from 'react'
import ReactDom from 'react-dom'
import jQuery from 'jquery'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

import LoadingSpinner from './loading-spinner.jsx'
import Previewer from './previewer.jsx'

import TableHeader from './headers/table.jsx'
import TableFolder from './folders/table.jsx'
import TableFile from './files/table.jsx'

import GroupByFolder from './groupers/by-folder.jsx'
import SortByName from './sorters/by-name.jsx'

const SEARCH_RESULTS_PER_PAGE = 20;

class FileBrowser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.state,

      rawFiles: [],
      organisedFiles: [],

      getFilesLoading: true,
      getFilesError: null,
      preuploadConfig: null,
      filesRoot: '',

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
    var reactClass = this;
    if (reactClass.props.renderStyle == 'table' && reactClass.props.nestChildren)
      console.warn('Invalid settings: Cannot nest table children in file browser');

    jQuery(document).on('click', function(event) {
      if (!reactClass.isMounted())
        return;
      var inBrowser = (jQuery(reactClass.refs.browser).has(event.target).length > 0);
      var inPreview = (
        typeof reactClass.refs.preview !== 'undefined'
        && jQuery(reactClass.refs.preview).has(event.target).length > 0
      );
      if (!inBrowser && !inPreview) {
        reactClass.setState(state => {
          state.selection = null;
          return state;
        });
      }
    });
    jQuery(document).on('keydown', reactClass.handleGlobalKeyDown);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.group !== this.props.group) {
      this.organiseFiles(nextProps.startOpen, nextProps);
    }
  }

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
  renameFile(oldKey, newKey) {
    console.log('renaming file', oldKey, 'to', newKey);
  }
  renameFolder(oldKey, newKey) {
    console.log('renaming folder', oldKey, 'to', newKey);
  }
  delete(key) {
    console.log('deleting', key);
  }
  select(key) {
    this.setState(state => {
      state.selection = key;
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
    }, () => {
      this.organiseFiles(false, this.props);
    });
  }
  closeAddFolder() {
    this.setState(state => {
      state.addFolder = null;
      return state;
    });
  }
  handleNewFolderNameChange() {
    var newValue = this.refs.newFolderName.value;
    this.setState(state => {
      state.newFolderName = newValue;
      return state;
    });
  }
  handleAddFolderSubmit(event) {
    event.preventDefault();
    var reactClass = this;
    var newFolderName = reactClass.state.addFolder + reactClass.state.newFolderName;
    reactClass.setState(state => {
      state.addFolderPending = true;
      return state;
    }, function() {
      var formData = new FormData();
      formData.append('key', newFolderName);
      formData.append('acl', reactClass.state.preuploadConfig.acl);
      formData.append('Content-Type', '');
      formData.append('AWSAccessKeyId', reactClass.state.preuploadConfig.aws_access_key);
      formData.append('policy', reactClass.state.preuploadConfig.policy)
      formData.append('signature', reactClass.state.preuploadConfig.signature);
      formData.append('file', '');
      jQuery.ajax({
        method: 'POST',
        url: reactClass.state.preuploadConfig.bucket_url,
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        success: function(response) {
          reactClass.setState(state => {
            state.addFolder = null;
            state.newFolderName = '';
            state.addFolderPending = false;
            return state;
          }, () => {
            reactClass.loadFiles(false);
          });
        },
        error: function(response) {
          reactClass.setState(state => {
            state.addFolderPending = false;
            return state;
          });
        }
      });
    });
  }
  handleShowMoreClick(event) {
    event.preventDefault();
    this.setState(state => {
      state.searchResultsShown += SEARCH_RESULTS_PER_PAGE;
      return state;
    });
  }

  organiseFiles(openAll, props) {
    var reactClass = this;
    reactClass.setState(state => {
      state.organisedFiles = state.rawFiles;
      if (reactClass.state.nameFilter) {
        var filteredFiles = [];
        var terms = reactClass.state.nameFilter.split(' ');
        for (var fileIndex = 0; fileIndex < state.organisedFiles.length; fileIndex++) {
          var file = state.organisedFiles[fileIndex];
          var skip = false;
          for (var termIndex = 0; termIndex < terms.length; termIndex++) {
            var term = terms[termIndex].toLowerCase().trim();
            if (file.key.toLowerCase().trim().indexOf(term) == -1) {
              skip = true;
              break;
            }
          }
          if (skip)
            continue;
          filteredFiles.push(file);
        }
        state.organisedFiles = filteredFiles;
      }
      if (props.group !== null) {
        state.organisedFiles = props.group(
          state.organisedFiles,
          state.filesRoot
        );
      }
      else {
        var newFiles = [];
        state.organisedFiles.map((file) => {
          if (file.size)
            newFiles.push(file);
        });
        state.organisedFiles = newFiles;
      }
      if (props.sort !== null)
        state.organisedFiles = props.sort(state.organisedFiles);

      if (openAll) {
        var openChildren = function(files) {
          files.map((file) => {
            if (file.children) {
              state.openFolders[file.key] = true;
              openChildren(file.children)
            }
          });
        };
        openChildren(state.organisedFiles);
      }

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

  handleGlobalKeyDown(event) {
    if (!this.isMounted())
      return;
    if (event.which == 27 && this.state.previewFile !== null) {
      this.closePreview();
    }
  }
  handleActionBarRenameClick(event) {
    this.beginAction('rename', this.state.selection);
  }
  handleActionBarDeleteClick(event) {
    this.beginAction('delete', this.state.selection);
  }
  handleActionBarAddFolderClick(event) {
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
    }, () => {
      this.organiseFiles(false, this.props);
    });
  }
  clearFilter() {
    this.setState(state => {
      state.nameFilter = '';
      return state;
    }, () => {
      this.organiseFiles(false, this.props);
    });
  }

  renderActionBar() {
    var reactClass = this;

    if (!this.props.showActionBar)
      return null;

    var areActions = (
      reactClass.props.canDeleteFiles
      || reactClass.props.canRenameFiles
      || reactClass.props.canRenameFolders
    );
    var actions = [];
    if (!reactClass.state.getFilesLoading) {
      if (reactClass.state.selection !== null) {
        var filePart = reactClass.state.selection.split('/');
        filePart = filePart[filePart.length - 1];
        var selectedFile;
        var findInOrganised = function(files) {
          for (var fileIndex = 0; fileIndex < files.length; fileIndex++) {
            var file = files[fileIndex];
            if (file.key === reactClass.state.selection)
              selectedFile = file;
            if (file.children)
              findInOrganised(file.children);
          }
        };
        findInOrganised(reactClass.state.organisedFiles);

        var selectionIsFolder = (selectedFile && selectedFile.size);

        if (selectedFile) {
          if (selectedFile.action) {
            var actionName;
            switch (selectedFile.action) {

              case 'delete':
                actionName = 'Deleting file ...';
                break;

              case 'rename':
                actionName = 'Renaming ...';
                break;

              default:
                actionName = 'Moving ...';
                break;
            }
            actions.push(
              <li key={'action-pending-'+selectedFile.action} className="waiting">
                <LoadingSpinner /> {actionName}
              </li>
            );
          }
          else {
            if (reactClass.props.canDeleteFiles && selectionIsFolder) {
              actions.push(
                <li key="action-delete">
                  <a
                    className="btn btn-primary btn-sm"
                    onClick={reactClass.handleActionBarDeleteClick}
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
                (selectionIsFolder && reactClass.props.canRenameFiles)
                || (!selectionIsFolder && reactClass.props.canRenameFolders)
              )
            ) {
              actions.push(
                <li key="action-rename">
                  <a
                    className="btn btn-primary btn-sm"
                    onClick={reactClass.handleActionBarRenameClick}
                    href="#"
                    role="button"
                  >
                    <i className="fa fa-i-cursor" aria-hidden="true"></i>
                    &nbsp;Rename
                  </a>
                </li>
              );
            }
            if (reactClass.props.canCreateFolders) {
              actions.push(
                <li key="action-add-folder">
                  <a
                    className="btn btn-primary btn-sm"
                    onClick={reactClass.handleActionBarAddFolderClick}
                    href="#"
                    role="button"
                  >
                    <i className="fa fa-folder-o" aria-hidden="true"></i>
                    &nbsp;Add Folder
                  </a>
                </li>
              );
            }
          }
        }
      }
    }
    if (actions.length)
      actions = (<ul>{actions}</ul>);
    else
      actions = (<span>-</span>);

    var filter;
    if (reactClass.props.canFilter) {
      filter = (
        <div style={{position: 'relative'}}>
          <input
            ref="filter"
            type="text"
            className="form-control input-sm"
            placeholder="Filter files"
            value={reactClass.state.nameFilter}
            onChange={reactClass.handleFilterChange}
          />
          <span className="clear" onClick={reactClass.clearFilter}>
            <i className="fa fa-times" aria-hidden="true"></i>
          </span>
        </div>
      );
    }

    if (this.props.canFilter && areActions) {
      return (
        <div className="action-bar row m-b-1">
          <div className="filters col-md-6">
            {filter}
          </div>
          <div className="actions col-md-6">
            {actions}
          </div>
        </div>
      );
    }
    else if (this.props.canFilter && !areActions) {
      return (
        <div className="action-bar m-b-1">
          <div className="filters">
            {filter}
          </div>
        </div>
      );
    }
    else if (!this.props.canFilter && areActions) {
      return (
        <div className="action-bar m-b-1">
          <div className="actions">
            {actions}
          </div>
        </div>
      );
    }
    return <div className="action-bar"></div>;
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
        canCreateFiles: this.props.canCreateFiles,
        canCreateFolders: this.props.canCreateFolders,
        canRenameFiles: this.props.canRenameFiles,
        canRenameFolders: this.props.canRenameFolders,
        canMoveFiles: this.props.canMoveFiles,
        canMoveFolders: this.props.canMoveFolders,
        // browser state
        openFolders: this.state.openFolders,
        nameFilter: this.state.nameFilter,
        selection: this.state.selection,
        activeAction: this.state.activeAction,
        actionTarget: this.state.actionTarget,

        // browser state functions
        select: this.select,
        openFolder: this.openFolder,
        toggleFolder: this.toggleFolder,
        beginAction: this.beginAction,
        endAction: this.endAction,
        // data functions
        renameFolder: this.renameFolder,
        renameFile: this.renameFile,
        upload: this.upload,
        preview: this.preview,
        delete: this.delete,
      };
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
    if (!this.state.getFilesLoading && this.state.getFilesError !== null) {
      files = (
        <div className="alert alert-danger">
          <p>{this.state.getFilesError}</p>
        </div>
      );
    }
    else {
      var headerProps = {
        fileKey: this.state.filesRoot,
        isSelected: (this.state.selection == this.state.filesRoot),

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
          if (this.state.getFilesLoading) {
            contents = (<tr className="loading"><td><LoadingSpinner /> Loading</td></tr>);
          }
          else {
            contents = this.renderFiles(this.state.organisedFiles, 0);
            if (!contents.length) {
              if (this.state.nameFilter) {
                contents = (<tr>
                  <td>
                    No files matching "{this.state.nameFilter}".
                  </td>
                </tr>);
              }
              else {
                contents = (<tr>
                  <td>
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
                        onClick={this.handleShowMoreClick}
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
            <table className="table">
              {header}
              <tbody>
                {contents}
              </tbody>
            </table>
          );
          break;

        case 'list':
          var contents;
          if (this.state.getFilesLoading) {
            contents = (<p className="loading"><LoadingSpinner /> Loading</p>);
          }
          else {
            contents = this.renderFiles(this.state.organisedFiles, 0);
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
                    onClick={this.handleShowMoreClick}
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
    }

    var addFolder;
    var preview;
    if (this.state.addFolder !== null) {
      addFolder = (
        <div onClick={this.closeAddFolder} ref="addFolder">
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
                onClick={function(event) {
                  event.stopPropagation();
                }}
              >
                <form onSubmit={this.handleAddFolderSubmit}>
                  <div className="modal-header">
                    <button
                      type="button"
                      className="close"
                      aria-label="Close"
                      onClick={this.closeAddFolder}
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
                      onChange={this.handleNewFolderNameChange}
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
                      onClick={this.closeAddFolder}
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
          <Previewer
            {...this.state.previewFile}
            fileKey={this.state.previewFile.key}
            closePreview={this.closePreview}
            openFilePath={this.openFilePath}
          />
        );
      }
    }

    if (this.props.canCreateFiles) {
      return (
        <div>
          {this.props.actions}
          <div className="row">
            <div className="col-sm-12 col-md-7 col-lg-9 rendered-file-browser" ref="browser">
              {this.renderActionBar()}
              <div className="files">
                {files}
              </div>
            </div>
            {preview}
            {addFolder}
          </div>
        </div>
      );
    }
    else {
      return (
        <div>
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
}
FileBrowser.defaultProps = {
  showActionBar: true,

  canCreateFolders: true,
  canCreateFiles: true,
  canRenameFolders: true,
  canRenameFiles: true,
  canMoveFolders: true,
  canMoveFiles: true,
  canDeleteFolders: true,
  canDeleteFiles: true,

  canFilter: true,

  group: GroupByFolder,
  sort: SortByName,
  nestChildren: false,

  startOpen: false,

  renderStyle: 'table',
  headerRenderer: TableHeader,
  folderRenderer: TableFolder,
  fileRenderer: TableFile,

  displayTrigger: null,
};

export default DragDropContext(HTML5Backend)(FileBrowser)
