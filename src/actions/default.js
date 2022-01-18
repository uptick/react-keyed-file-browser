import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

const Actions = (props) => {
  const { t } = props

  const {
    selectedItems,
    isFolder,
    icons,
    nameFilter,

    canCreateFolder,
    onCreateFolder,

    canRenameFile,
    onRenameFile,

    canRenameFolder,
    onRenameFolder,

    canDeleteFile,
    onDeleteFile,

    canDeleteFolder,
    onDeleteFolder,

    canDownloadFile,
    onDownloadFile,

    canDownloadFolder,
    onDownloadFolder,

    canUploadFile,
    onUploadFile,

    canExternalViewer,
    onExternalViewerClick,

  } = props

  /** @type any */
  let actions = []

  if (selectedItems.length) {
    // Something is selected. Build custom actions depending on what it is.
    const selectedItemsAction = selectedItems.filter(item => item.action)
    if (selectedItemsAction.length === selectedItems.length && [...new Set(selectedItemsAction)].length === 1) {
      // Selected item has an active action against it. Disable all other actions.
      let actionText
      switch (selectedItemsAction[0].action) {
        case 'delete':
          actionText = t('deleting')
          break

        case 'rename':
          actionText = t('renaming')
          break

        default:
          actionText = t('moving')
          break
      }

      actions = (
        // TODO: Enable plugging in custom spinner.
        <div className="item-actions">
          {icons.Loading} {actionText}
        </div>
      )
    } else {
      if (isFolder && canCreateFolder && !nameFilter) {
        actions.push(
          <li key="action-add-folder">
            <a
              onClick={onCreateFolder}
              href="#"
              role="button"
            >
              {icons.Folder}
              &nbsp;{t('addSubfolder')}
            </a>
          </li>
        )
      }

      const itemsWithoutKeyDerived = selectedItems.find(item => !item.keyDerived)
      if (!itemsWithoutKeyDerived && !isFolder && canRenameFile && selectedItems.length === 1) {
        actions.push(
          <li key="action-rename">
            <a
              onClick={onRenameFile}
              href="#"
              role="button"
            >
              {icons.Rename}
              &nbsp;{t('rename')}
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canRenameFolder) {
        actions.push(
          <li key="action-rename">
            <a
              onClick={onRenameFolder}
              href="#"
              role="button"
            >
              {icons.Rename}
              &nbsp;{t('rename')}
            </a>
          </li>
        )
      }

      if (!itemsWithoutKeyDerived && !isFolder && canDeleteFile) {
        actions.push(
          <li key="action-delete">
            <a
              onClick={onDeleteFile}
              href="#"
              role="button"
            >
              {icons.Delete}
              &nbsp;{t('delete')}
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canDeleteFolder) {
        actions.push(
          <li key="action-delete">
            <a
              onClick={onDeleteFolder}
              href="#"
              role="button"
            >
              {icons.Delete}
              &nbsp;{t('delete')}
            </a>
          </li>
        )
      }

      if (canUploadFile && onUploadFile) {
        actions.push(
          <li key="action-upload-file">
            <a
              onClick={onUploadFile}
              href="#"
              role="button"
            >
              {icons.File}
              &nbsp;{t('upload')}
            </a>
          </li>
        )
      }

      if (canExternalViewer && onExternalViewerClick) {
        actions.push(
          <li key="action-external-viewer">
            <a
              onClick={onExternalViewerClick}
              href="#"
              role="button"
            >
              {icons.ExternalViewer}
              &nbsp;{t('externalViewer')}
            </a>
          </li>
        )
      }

      if ((!isFolder && canDownloadFile) || (isFolder && canDownloadFolder)) {
        actions.push(
          <li key="action-download">
            <a
              onClick={isFolder ? onDownloadFolder : onDownloadFile}
              href="#"
              role="button"
            >
              {icons.Download}
              &nbsp;{t('download')}
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
    if (canCreateFolder && !nameFilter) {
      actions.push(
        <li key="action-add-folder">
          <a
            onClick={onCreateFolder}
            href="#"
            role="button"
          >
            {icons.Folder}
            &nbsp;{t('addFolder')}
          </a>
        </li>
      )
    }

    if (canUploadFile && onUploadFile) {
      actions.push(
        <li key="action-upload-file">
          <a
            onClick={onUploadFile}
            href="#"
            role="button"
          >
            {icons.File}
            &nbsp;{t('upload')}
          </a>
        </li>
      )
    }
    if (canExternalViewer && onExternalViewerClick) {
      actions.push(
        <li key="action-external-viewer">
          <a
            onClick={onExternalViewerClick}
            href="#"
            role="button"
          >
            {icons.ExternalViewer}
            &nbsp;{t('externalViewer')}
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

  return actions
}

Actions.propTypes = {
  selectedItems: PropTypes.arrayOf(PropTypes.object),
  isFolder: PropTypes.bool,
  icons: PropTypes.object,
  nameFilter: PropTypes.string,

  canCreateFolder: PropTypes.bool,
  onCreateFolder: PropTypes.func,

  canRenameFile: PropTypes.bool,
  onRenameFile: PropTypes.func,

  canRenameFolder: PropTypes.bool,
  onRenameFolder: PropTypes.func,

  canDeleteFile: PropTypes.bool,
  onDeleteFile: PropTypes.func,

  canDeleteFolder: PropTypes.bool,
  onDeleteFolder: PropTypes.func,

  canDownloadFile: PropTypes.bool,
  onDownloadFile: PropTypes.func,

  canDownloadFolder: PropTypes.bool,
  onDownloadFolder: PropTypes.func,

  canUploadFile: PropTypes.bool,
  onUploadFile: PropTypes.func,

  canExternalViewer: PropTypes.bool,
  onExternalViewerClick: PropTypes.func,

  onFileDoubleClick: PropTypes.func,
}

Actions.defaultProps = {
  selectedItems: [],
  isFolder: false,
  icons: {},
  nameFilter: '',

  canCreateFolder: false,
  onCreateFolder: null,

  canRenameFile: false,
  onRenameFile: null,

  canRenameFolder: false,
  onRenameFolder: null,

  canDeleteFile: false,
  onDeleteFile: null,

  canDeleteFolder: false,
  onDeleteFolder: null,

  canDownloadFile: false,
  onDownloadFile: null,

  canDownloadFolder: false,
  onDownloadFolder: null,

  canUploadFile: false,
  onUploadFile: null,

  canExternalViewer: false,
  onExternalViewerClick: null,

  onFileDoubleClick: null,
}

export default withNamespaces()(Actions)
