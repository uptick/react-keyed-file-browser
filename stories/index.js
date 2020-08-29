import React from 'react'
import { addHours, subHours, subDays, subMonths } from 'date-fns'
import { State, Store } from '@sambego/storybook-state'
import FileBrowser, { FileRenderers, FolderRenderers, Groupers, Icons } from '../src'
import './stories'

export default {
  title: 'File Browser',
  component: FileBrowser,
}

const files = [
  {
    key: 'animals/',
    modified: addHours(new Date(), 1).getTime(),
    size: 0,
  },
  {
    key: 'animals/dog.png',
    modified: subHours(new Date(), 1).getTime(),
    size: 0,
  },
  {
    key: 'cat.png',
    modified: subHours(new Date(), 1).getTime(),
    size: 1.5 * 1024 * 1024,
  },
  {
    key: 'kitten.png',
    modified: subDays(new Date(), 3).getTime(),
    size: 545 * 1024,
  },
  {
    key: 'elephant.png',
    modified: subDays(new Date(), 3).getTime(),
    size: 52 * 1024,
  },
]

const longListOfFiles = [
  {key: 'dog.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'cat.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'rabbit.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'fish.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'donkey.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'crocodile.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'parrot.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'monkey.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'llama.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'giraffe.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'elephant.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'ladybug.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'hamster.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'snake.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'squirrel.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'tiger.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'poodle.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'sloth.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'camel.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'kangaroo.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'spider.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'bear.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'puma.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'zebra.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'gazelle.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'vulture.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'panda.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'dolphin.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'turtle.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'whale.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'gorilla.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'ant.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'mouse.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'moose.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'deer.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'husky.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'elk.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'mantis.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
  {key: 'duck.png', modified: subHours(new Date(), Math.floor(Math.random() * 100)), size : 1024 * Math.ceil(Math.random() * 10)},
]

const store = new Store({ files })

export const simpleFlatAndReadOnlyExample = () => <FileBrowser files={files} />

export const differentRendersAndGroupers = () => (
  <FileBrowser
    icons={Icons.FontAwesome(4)}
    files={[
      {
        key: 'cat.js',
        modified: subHours(new Date(), 1).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'kitten.png',
        modified: subDays(new Date(), 3).getTime(),
        size: 545 * 1024,
      },
      {
        key: 'elephant.png',
        modified: subDays(new Date(), 3).getTime(),
        size: 52 * 1024,
      },
      {
        key: 'dog.png',
        modified: subHours(new Date(), 1).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'turtle.png',
        modified: subMonths(new Date(), 3).getTime(),
        size: 545 * 1024,
      },
      {
        key: 'gecko.png',
        modified: subDays(new Date(), 2).getTime(),
        size: 52 * 1024,
      },
      {
        key: 'centipede.png',
        modified: subHours(new Date(), 0.5).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'possum.png',
        modified: subDays(new Date(), 32).getTime(),
        size: 545 * 1024,
      },
    ]}
    renderStyle="list"
    headerRenderer={null}
    group={Groupers.GroupByModifiedRelative}
    fileRenderer={FileRenderers.ListThumbnailFile}
    folderRenderer={FolderRenderers.ListThumbnailFolder}
  />
)

export const groupByFolder = () => (
  <FileBrowser
    icons={Icons.FontAwesome(4)}
    files={[
      {
        key: 'new-folder/',
        modified: subHours(new Date(), 1).getTime(),
        size: 0,
      },
      {
        key: 'documents/sub-documents/word.doc',
        modified: subHours(new Date(), 1).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'documents/sub-documents/presentation.pptx',
        modified: subDays(new Date(), 3).getTime(),
        size: 545 * 1024,
      },
      {
        key: 'documents/plain.txt',
        modified: subDays(new Date(), 3).getTime(),
        size: 52 * 1024,
      },
      {
        key: 'documents/pdf.pdf',
        modified: subHours(new Date(), 1).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'documents/spreadsheet.xlsx',
        modified: subMonths(new Date(), 3).getTime(),
        size: 545 * 1024,
      },
      {
        key: 'downloads/package.zip',
        modified: subDays(new Date(), 2).getTime(),
        size: 52 * 1024,
      },
      {
        key: 'movies/video.mp4',
        modified: subHours(new Date(), 0.5).getTime(),
        size: 1.5 * 1024 * 1024,
      },
      {
        key: 'music/song.mp3',
        modified: subDays(new Date(), 32).getTime(),
        size: 545 * 1024,
      },
    ]}
    renderStyle="list"
    onDownloadFile={() => {}}
    headerRenderer={null}
    group={Groupers.GroupByFolder}
    fileRenderer={FileRenderers.ListThumbnailFile}
    folderRenderer={FolderRenderers.ListThumbnailFolder}
  />
)

export const simpleFlatAndReadOnlyExampleWithBulkActions = () => (
  <State store={store}>
    {(state) => (
      <FileBrowser
        icons={Icons.FontAwesome(4)}
        onCreateFolder={(key) => {
          store.set({
            files: store.get('files').concat([
              {
                key: key,
                modified: Date.now(),
                size: (Math.floor(Math.random() * 100) + 1) * 1024,
              },
            ]),
          })
        }}
        onCreateFiles={(files, prefix) => {
          const newFiles = store.get('files').map((file) => {
            let newKey = prefix
            if (
              prefix !== '' &&
              prefix.substring(prefix.length - 1, prefix.length) !== '/'
            ) {
              newKey += '/'
            }
            newKey += file.name
            return {
              key: newKey,
              size: file.size,
              modified: Date.now(),
            }
          })

          const uniqueNewFiles = []
          newFiles.map((newFile) => {
            let exists = false
            state.files.map((existingFile) => {
              if (existingFile.key === newFile.key) {
                exists = true
              }
            })
            if (!exists) {
              uniqueNewFiles.push(newFile)
            }
          })
          store.set({
            files: store.get('files').concat(uniqueNewFiles),
          })
        }}
        onMoveFolder={(oldKey, newKey) => {
          const newFiles = []
          store.get('files').map((file) => {
            if (file.key.substr(0, oldKey.length) === oldKey) {
              newFiles.push({
                ...file,
                key: file.key.replace(oldKey, newKey),
                modified: Date.now(),
              })
            } else {
              newFiles.push(file)
            }
          })
          store.set({
            files: newFiles,
          })
        }}
        onMoveFile={(oldKey, newKey) => {
          const newFiles = []
          store.get('files').map((file) => {
            if (file.key === oldKey) {
              newFiles.push({
                ...file,
                key: newKey,
                modified: Date.now(),
              })
            } else {
              newFiles.push(file)
            }
          })
          store.set({
            files: newFiles,
          })
        }}
        onRenameFolder={(oldKey, newKey) => {
          const newFiles = []
          store.get('files').map((file) => {
            if (file.key.substr(0, oldKey.length) === oldKey) {
              newFiles.push({
                ...file,
                key: file.key.replace(oldKey, newKey),
                modified: Date.now(),
              })
            } else {
              newFiles.push(file)
            }
          })
          store.set({
            files: newFiles,
          })
        }}
        onRenameFile={(oldKey, newKey) => {
          const newFiles = []
          store.get('files').map((file) => {
            if (file.key === oldKey) {
              newFiles.push({
                ...file,
                key: newKey,
                modified: Date.now(),
              })
            } else {
              newFiles.push(file)
            }
          })
          store.set({
            files: newFiles,
          })
        }}
        onDeleteFolder={(folderKeys) => {
          const newFiles = []
          store.get('files').map((file) => {
            if (
              !folderKeys.find(
                (folderKey) =>
                  file.key.substr(0, folderKey.length) === folderKey
              )
            ) {
              newFiles.push(file)
            }
          })
          store.set({
            files: newFiles,
          })
        }}
        onDeleteFile={(fileKeys) => {
          store.set({
            files: store
              .get('files')
              .filter((file) => !fileKeys.includes(file.key)),
          })
        }}
        onDownloadFile={(fileKeys) => {
          console.log('Downloading files: ', fileKeys)
        }}
        files={state.files}
      />
    )}
  </State>
)

export const aLotOfFiles = () => (
  <FileBrowser
    files={longListOfFiles}
    onDeleteFile={(args) => { console.log("Deleting file: ", args) }}
    onRenameFile={(args) => { console.log("Renaming file: ", args) }}
  />
)
