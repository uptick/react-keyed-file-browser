import React from 'react'
import PropTypes from 'prop-types'

const Actions = (props) => {
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

    // Custom Props
    addGateway,
    addReport,
    addOrganization,
    permissions,
    customActions,
    browserType
  } = props;

  /** @type any */
  let actions = []

  customActions.forEach((action, index) => {
    actions.push(
      <li key={`custom-action-${index}`}>
        <a
          onClick={() => {
            action.onClick();
          }}
          href="#"
          role="button"
        >
          {action.icon}
          {action.name}
        </a>
      </li>
    );
  });

  if (selectedItems.length) {
    // Something is selected. Build custom actions depending on what it is.
    const selectedItemsAction = selectedItems.filter(item => item.action)
    if (selectedItemsAction.length === selectedItems.length && [...new Set(selectedItemsAction)].length === 1) {
      // Selected item has an active action against it. Disable all other actions.
      let actionText
      switch (selectedItemsAction[0].action) {
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
      if (browserType === 'sensor') 
        actions.push(
          <li key="action-add-report">
            <a
              onClick={() => {
                addReport(selectedItems[0]);
              }}
              href="#"
              role="button"
            >
              {icons.ReportAdd}
              Create Report
            </a>
          </li>
        );

      if (isFolder && canCreateFolder &&
        !nameFilter && !selectedItems[0].isGateway &&
        (permissions === "owner"
          || permissions === null
          || permissions === undefined)
      ) {
        if (browserType === 'sensor') 
          actions.push(
            <li key="action-add-gateway">
              <a
                onClick={() => {
                  addGateway(selectedItems[0]);
                }}
                href="#"
                role="button"
              >
                {icons.GatewayAdd}
                Add Gateway
              </a>
            </li>
          );
        actions.push(
          <li key="action-add-folder">
            <a
              onClick={onCreateFolder}
              href="#"
              role="button"
            >
              {icons.FolderAdd}
              Add Subfolder
            </a>
          </li>
        )
      }

      const itemsWithoutKeyDerived = selectedItems.find(item => !item.keyDerived)
      if (!itemsWithoutKeyDerived && !isFolder && canRenameFile && selectedItems.length === 1 && permissions === "owner") {
        actions.push(
          <li key="action-rename">
            <a
              onClick={onRenameFile}
              href="#"
              role="button"
            >
              {icons.Rename}
              Rename
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canRenameFolder && permissions === "owner") {
        actions.push(
          <li key="action-rename">
            <a
              onClick={onRenameFolder}
              href="#"
              role="button"
            >
              {icons.Rename}
              Rename
            </a>
          </li>
        )
      }

      if (!itemsWithoutKeyDerived && !isFolder && canDeleteFile && permissions === "owner") {
        actions.push(
          <li key="action-delete">
            <a
              onClick={onDeleteFile}
              href="#"
              role="button"
            >
              {icons.Delete}
              Delete
            </a>
          </li>
        )
      } else if (!itemsWithoutKeyDerived && isFolder && canDeleteFolder && permissions === "owner") {
        actions.push(
          <li key="action-delete">
            <a
              onClick={onDeleteFolder}
              href="#"
              role="button"
            >
              {icons.Delete}
              Delete
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
              Download
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
    // Nothing selected: We're in the 'root' folder. 
    // Only allowed action is adding an organization.
    if (canCreateFolder && !nameFilter) {
      if (browserType === 'sensor') 
        actions.push(
          <li key="action-add-report">
            <a
              onClick={() => {
                addReport("root");
              }}
              href="#"
              role="button"
            >
              {icons.ReportAdd}
              Create Report
            </a>
          </li>
        );
      actions.push(
        <li key="action-add-folder">
          <a
            onClick={() => {
              addOrganization();
            }}
            href="#"
            role="button"
          >
            {icons.OrganizationAdd}
            Add Organization
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

  // Custom Actions
  addGateway: PropTypes.func,
  addReport: PropTypes.func,
  addOrganization: PropTypes.func,
  permissions: PropTypes.string,
  customActions: PropTypes.arrayOf(PropTypes.object),
  browserType: PropTypes.string
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

  // Custom Props
  addGateway: null,
  addReport: null,
  addOrganization: null,
  permissions: null,
  customActions: [],
  browserType: null
}

export default Actions
