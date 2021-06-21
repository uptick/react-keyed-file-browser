import { FC } from 'react'
import { DragDropMonitor } from 'react-dnd'

export interface FileBrowserFile {
  key: string
  modified: number
  size: number
  url?: string
}

export interface FileBrowserWindow {
  name: string
  begins: Date
  ends: Date
  items: string[]
}

export type FileBrowserFolder = FileBrowserFile

export interface FileProps {
  fileKey: string
  url?: string
  newKey?: string
  isRenaming: boolean
  browserProps: RendererBrowserProps
}

// #region details
declare class DefaultDetail extends FC<DetailRendererProps> {}
export declare const Details: {
  DefaultDetail: DefaultDetail
}
// #endregion details

// #region filters
declare class DefaultFilter extends React.Component<FilterRendererProps> {}
export declare const Filters: {
  DefaultFilter: DefaultFilter
}
// #endregion filters

type FileBrowserFileOrDraft =
  | FileBrowserFile
  | { key: string; size: 0; draft: true }

type FileBrowserTreeFileNode = FileBrowserFile & { keyDerived?: true, action?: ActionType }
type FileBrowserTreeGroupNode = FileBrowserFileOrDraft & {
  keyDerived?: true
  relativeKey: string
  children: FileBrowserTree
  action?: ActionType
}
export type FileBrowserTree = (
  | FileBrowserTreeFileNode
  | FileBrowserTreeGroupNode
)[]

// #region groupers
export type Grouper = (
  files: FileBrowserFileOrDraft[],
  root: string
) => FileBrowserTree

export declare const Groupers: {
  GroupByFolder: Grouper
  GroupByModifiedRelative: Grouper
}
// #endregion groupers

// #region sorters
export type Sorter = (
  files: FileBrowserTree[],
  root: string
) => FileBrowserTree[]

export declare const Sorters: {
  SortByName: Sorter
  SortByModified: Sorter
}
// #endregion sorters

// #region icons
export type FontAwesomeVersion = 4 | 5

export type IconsProp = {
  File: JSX.Element
  Image: JSX.Element
  Video: JSX.Element
  Audio: JSX.Element
  Archive: JSX.Element
  Word: JSX.Element
  Excel: JSX.Element
  PowerPoint: JSX.Element
  Text: JSX.Element
  PDF: JSX.Element
  Rename: JSX.Element
  Folder: JSX.Element
  FolderOpen: JSX.Element
  Delete: JSX.Element
  Loading: JSX.Element
  Download: JSX.Element
} | undefined

// #endregion icons

// #region utils
export declare const Utils: {
  isFolder: (file: FileBrowserFile) => boolean
  moveFilesAndFolders: (
    props: { browserProps: RendererBrowserProps },
    monitor: DragDropMonitor,
    component: any
  ) => void
}
// #endregion utils

// #region handlers
type CreateFilesHandler = (files: File[], prefix: string) => void
type CreateFolderHandler = (key: string) => void
type MoveFileHandler = (oldFileKey: string, newFileKey: string) => void
type MoveFolderHandler = (oldFolderKey: string, newFolderKey: string) => void
type RenameFileHandler = (oldFileKey: string, newFileKey: string) => void
type RenameFolderHandler = (oldFolderKey: string, newFolderKey: string) => void
type DeleteFileHandler = (fileKey: string) => void
type DeleteFolderHandler = (folderKey: string) => void
type DownloadFileHandler = (keys: string[]) => void
// #endregion handlers

// #region renderers

// Header
export type HeaderRendererProps<P = {}> = {
  select: (value: string) => void
  fileKey: string
  fileCount: number
  browserProps: RendererBrowserProps
  connectDropTarget: () => void
} & P

// Filter
export type FilterRendererProps<P = {}> = {
  value: string
  updateFilter: (newValue: string) => void
} & P

export type FilterRenderer<P = {}> = (
  props: FilterRendererProps<P>
) => JSX.Element

// File and Folder
export type FolderAndFileRendererProps<P = {}> = ItemProps &
  P & {
    browserProps: RendererBrowserProps
    depth: number
  }

export type FileRendererProps<P = {}> = FileBrowserTreeFileNode &
  FolderAndFileRendererProps<P>

export type FileRenderer<P = {}> = (props: FileRendererProps<P>) => JSX.Element

export type FolderRendererProps<P = {}> = FileBrowserTreeGroupNode &
  FolderAndFileRendererProps<P>

export type FolderRenderer<P = {}> = (
  props: FolderRendererProps<P>
) => JSX.Element

// Detail

export type DetailRendererProps<P = {}> = {
  file: FileBrowserTreeFileNode
  close: () => void
} & P

export type DetailRenderer<P = {}> = (
  props: DetailRendererProps<P>
) => JSX.Element

// Action

export interface ActionRendererProps {
  browserProps: RendererBrowserProps

  selectedItems: FileBrowserTree
  isFolder: boolean

  icons: IconsProp
  nameFilter: string

  canCreateFolder: boolean
  onCreateFolder: (event: React.FormEvent) => void

  canRenameFile: boolean
  onRenameFile: (event: React.FormEvent) => void

  canRenameFolder: boolean
  onRenameFolder: (event: React.FormEvent) => void

  canDeleteFile: boolean
  onDeleteFile: (event: React.FormEvent) => void

  canDeleteFolder: boolean
  onDeleteFolder: (event: React.FormEvent) => void

  canDownloadFile: boolean
  onDownloadFile: (event: React.FormEvent) => void

  canDownloadFolder: boolean
  onDownloadFolder: (event: React.FormEvent) => void
}

// Confirm Deletion

export interface ConfirmDeletionRendererProps {
  children: React.FC
  handleDeleteSubmit: (event: React.FormEvent) => void
  handleFileClick: (event: React.MouseEvent) => void
  url?: string
}

export type ConfirmDeletionRenderer = (
  props: ConfirmDeletionRenderer
) => JSX.Element

// ConfirmMultipleDeletionRenderer

export interface ConfirmMultipleDeletionRendererProps {
  handleDeleteSubmit: (event: React.FormEvent) => void
}

export type ConfirmMultipleDeletionRenderer = (
  props: ConfirmMultipleDeletionRendererProps
) => JSX.Element

// #endregion renderers

// #region renderer-browser-props
export type ActionType = 'rename' | 'delete' | 'createFolder'

export interface ItemProps {
  key: string
  fileKey: string
  isSelected: boolean
  isOpen: boolean
  isRenaming: boolean
  isDeleting: boolean
  isDraft: boolean
}

export interface RendererBrowserProps {
  // browser config
  nestChildren: boolean
  fileRenderer: FileRenderer
  fileRendererProps: FileRendererProps
  folderRenderer: FolderRenderer
  folderRendererProps: FolderRendererProps
  confirmDeletionRenderer: ConfirmDeletionRenderer
  confirmMultipleDeletionRenderer: ConfirmMultipleDeletionRenderer
  icons: IconsProp

  // browser state
  openFolders: { [prefix: string]: boolean }
  nameFilter: string
  selection: string[]
  activeAction: ActionType | null
  actionTargets: string[]

  // browser manipulation
  select: (
    key: string,
    selectedType?: string,
    ctrlKey?: boolean,
    shiftKey?: boolean
  ) => void
  openFolder: (folderKey: string) => void
  toggleFolder: (folderKey: string) => void
  beginAction: ActionType | null
  endAction: () => void
  preview: (file: FileBrowserFile) => void

  // item manipulation
  createFiles?: CreateFilesHandler
  createFolder?: CreateFolderHandler
  renameFile?: RenameFileHandler
  renameFolder?: RenameFolderHandler
  moveFile?: MoveFileHandler
  moveFolder?: MoveFolderHandler
  deleteFile?: DeleteFileHandler
  deleteFolder?: DeleteFolderHandler

  getItemProps: (
    file: FileBrowserFile,
    browserProps: RendererBrowserProps
  ) => ItemProps
}
// #endregion renderer-browser-props

// #region file-browser-props
export interface FileBrowserProps {
  files: FileBrowserFile[]
  actions?: JSX.Element
  showActionBar?: boolean
  canFilter?: boolean
  noFilesMessage?: string | JSX.Element

  group?: () => void
  sort?: () => void

  icons?: IconsProp

  nestChildren?: boolean
  renderStyle?: 'list' | 'table'

  startOpen?: boolean

  headerRenderer?: HeaderRenderer
  headerRendererProps?: HeaderRendererProps
  filterRenderer?: FilterRenderer
  filterRendererProps?: FilterRendererProps
  fileRenderer?: FileRenderer
  fileRendererProps?: FileRendererProps
  folderRenderer?: FolderRenderer
  folderRendererProps?: FolderRendererProps
  detailRenderer?: DetailRenderer
  detailRendererProps?: DetailRendererProps
  actionRenderer?: ActionRenderer
  confirmDeletionRenderer?: ConfirmDeletionRenderer
  confirmMultipleDeletionRenderer?: ConfirmMultipleDeletionRenderer

  onCreateFiles?: CreateFilesHandler
  onCreateFolder?: CreateFolderHandler
  onMoveFile?: MoveFileHandler
  onMoveFolder?: MoveFolderHandler
  onRenameFile?: RenameFileHandler
  onRenameFolder?: RenameFolderHandler
  onDeleteFile?: DeleteFileHandler
  onDeleteFolder?: DeleteFolderHandler
  onDownloadFile?: DownloadFileHandler

  onSelect?: (fileOrFolder: FileBrowserFile | FileBrowserFolder) => void
  onSelectFile?: (file: FileBrowserFile) => void
  onSelectFolder?: (folder: FileBrowserFolder) => void

  onPreviewOpen?: (file: FileBrowserFile) => void
  onPreviewClose?: (file: FileBrowserFile) => void

  onFolderOpen?: (folder: FileBrowserFolder) => void
  onFolderClose?: (folder: FileBrowserFolder) => void
}
