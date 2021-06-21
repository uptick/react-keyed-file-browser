import React from 'react'
import type { ActionRendererProps } from '@module/types'

const DefaultAction = (props: ActionRendererProps) => {
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
  } = props

  let actions: any = []

  if (selectedItems.length) {
    // Something is selected. Build custom actions depending on what it is.
    const selectedItemsAction = selectedItems.filter((item) => item.action)

    if (
      selectedItemsAction.length === selectedItems.length &&
      [...new Set(selectedItemsAction)].length === 1
    ) {
      let actionText
      switch (selectedItemsAction[0]?.action) {
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
          {icons?.Loading} {actionText}
        </div>
      )
    } else {
      if (isFolder && canCreateFolder && !nameFilter) {
        actions.push(
          <li key="action-add-folder">
            <a onClick={onCreateFolder} href="#" role="button">
              {icons?.Folder}
              &nbsp;Add Subfolder
            </a>
          </li>
        )
      }

      const itemsWithoutKeyDerived = selectedItems.find(
        (item) => !item.keyDerived
      )
      if (
        !itemsWithoutKeyDerived &&
        !isFolder &&
        canRenameFile &&
        selectedItems.length === 1
      ) {
        actions.push(
          <li key="action-rename">
            <a onClick={onRenameFile} href="#" role="button">
              {icons?.Rename}
              &nbsp;Rename
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canRenameFolder) {
        actions.push(
          <li key="action-rename">
            <a onClick={onRenameFolder} href="#" role="button">
              {icons?.Rename}
              &nbsp;Rename
            </a>
          </li>
        )
      }

      if (!itemsWithoutKeyDerived && !isFolder && canDeleteFile) {
        actions.push(
          <li key="action-delete">
            <a onClick={onDeleteFile} href="#" role="button">
              {icons?.Delete}
              &nbsp;Delete
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canDeleteFolder) {
        actions.push(
          <li key="action-delete">
            <a onClick={onDeleteFolder} href="#" role="button">
              {icons?.Delete}
              &nbsp;Delete
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
              {icons?.Download}
              &nbsp;Download
            </a>
          </li>
        )
      }

      if (actions.length) {
        actions = <ul className="item-actions">{actions}</ul>
      } else {
        actions = <div className="item-actions">&nbsp;</div>
      }
    }
  } else {
    // Nothing selected: We're in the 'root' folder. Only allowed action is adding a folder.
    if (canCreateFolder && !nameFilter) {
      actions.push(
        <li key="action-add-folder">
          <a onClick={onCreateFolder} href="#" role="button">
            {icons?.Folder}
            &nbsp;Add Folder
          </a>
        </li>
      )
    }

    if (actions.length) {
      actions = <ul className="item-actions">{actions}</ul>
    } else {
      actions = <div className="item-actions">&nbsp;</div>
    }
  }

  return actions
}

DefaultAction.defaultProps = {
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
}

export { DefaultAction }
