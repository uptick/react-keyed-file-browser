import React, { useState } from 'react'
import Moment from 'moment'
import { storiesOf } from '@storybook/react'
import { State, Store } from "@sambego/storybook-state"
import FileBrowser, { FileRenderers, FolderRenderers, Groupers, Icons } from '../src'
import './stories'

const store = new Store({
  files: [
    {
      key: 'animals/',
      modified: +Moment().subtract(1, 'hours'),
      size: 0,
    },
    {
      key: 'animals/dog.png',
      modified: +Moment().subtract(1, 'hours'),
      size: 0,
    },
    {
      key: 'cat.png',
      modified: +Moment().subtract(1, 'hours'),
      size: 1.5 * 1024 * 1024,
    },
    {
      key: 'kitten.png',
      modified: +Moment().subtract(3, 'days'),
      size: 545 * 1024,
    },
    {
      key: 'elephant.png',
      modified: +Moment().subtract(3, 'days'),
      size: 52 * 1024,
    }
  ]
});

storiesOf('FileBrowser', module)
  .add('Simple Flat & Read-Only Example', () => (
    <FileBrowser
      files={[
        {
          key: 'animals/',
          modified: +Moment().subtract(1, 'hours'),
          size: 0,
        },
        {
          key: 'animals/dog.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 0,
        },
        {
          key: 'cat.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'kitten.png',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'elephant.png',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
      ]}
    />
  ))
  .add('Different Renderers and Groupers', () => (
    <FileBrowser
      icons={Icons.FontAwesome(4)}
      files={[
        {
          key: 'cat.js',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'kitten.png',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'elephant.png',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'dog.png',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'turtle.png',
          modified: +Moment().subtract(3, 'months'),
          size: 545 * 1024,
        },
        {
          key: 'gecko.png',
          modified: +Moment().subtract(2, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'centipede.png',
          modified: +Moment().subtract(0.5, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'possum.png',
          modified: +Moment().subtract(32, 'days'),
          size: 545 * 1024,
        },
      ]}
      renderStyle="list"
      headerRenderer={null}
      group={Groupers.GroupByModifiedRelative}
      fileRenderer={FileRenderers.ListThumbnailFile}
      folderRenderer={FolderRenderers.ListThumbnailFolder}
    />
  ))
  .add('Group By Folder', () => (
    <FileBrowser
      icons={Icons.FontAwesome(4)}
      files={[
        {
          key: 'new-folder/',
          modified: +Moment().subtract(1, 'hours'),
          size: 0,
        },
        {
          key: 'documents/sub-documents/word.doc',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'documents/sub-documents/presentation.pptx',
          modified: +Moment().subtract(3, 'days'),
          size: 545 * 1024,
        },
        {
          key: 'documents/plain.txt',
          modified: +Moment().subtract(3, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'documents/pdf.pdf',
          modified: +Moment().subtract(1, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'documents/spreadsheet.xlsx',
          modified: +Moment().subtract(3, 'months'),
          size: 545 * 1024,
        },
        {
          key: 'downloads/package.zip',
          modified: +Moment().subtract(2, 'days'),
          size: 52 * 1024,
        },
        {
          key: 'movies/video.mp4',
          modified: +Moment().subtract(0.5, 'hours'),
          size: 1.5 * 1024 * 1024,
        },
        {
          key: 'music/song.mp3',
          modified: +Moment().subtract(32, 'days'),
          size: 545 * 1024,
        },
      ]}
      renderStyle="list"
      onDownloadFile={() => { }}
      headerRenderer={null}
      group={Groupers.GroupByFolder}
      fileRenderer={FileRenderers.ListThumbnailFile}
      folderRenderer={FolderRenderers.ListThumbnailFolder}
    />
  ))
  .add('Simple Flat & Read-Only Example With Bulk Actions', () => (
    <State store={store}>
      {state => (
        <FileBrowser
          icons={Icons.FontAwesome(4)}
          onCreateFolder={key => {
            store.set({
              files: store.get('files').concat([{
                key: key,
              }])
            })
          }}
          onCreateFiles={(files, prefix) => {
            const newFiles = store.get('files').map((file) => {
              let newKey = prefix
              if (prefix !== '' && prefix.substring(prefix.length - 1, prefix.length) !== '/') {
                newKey += '/'
              }
              newKey += file.name
              return {
                key: newKey,
                size: file.size,
                modified: +Moment(),
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
              files: store.get('files').concat(uniqueNewFiles)
            })
          }}
          onMoveFolder={(oldKey, newKey) => {
            const newFiles = []
            store.get('files').map((file) => {
              if (file.key.substr(0, oldKey.length) === oldKey) {
                newFiles.push({
                  ...file,
                  key: file.key.replace(oldKey, newKey),
                  modified: +Moment(),
                })
              } else {
                newFiles.push(file)
              }
            })
            store.set({
              files: newFiles
            })
          }}
          onMoveFile={(oldKey, newKey) => {
            const newFiles = []
            store.get('files').map((file) => {
              if (file.key === oldKey) {
                newFiles.push({
                  ...file,
                  key: newKey,
                  modified: +Moment(),
                })
              } else {
                newFiles.push(file)
              }
            })
            store.set({
              files: newFiles
            })
          }}
          onRenameFolder={(oldKey, newKey) => {
            const newFiles = []
            store.get('files').map((file) => {
              if (file.key.substr(0, oldKey.length) === oldKey) {
                newFiles.push({
                  ...file,
                  key: file.key.replace(oldKey, newKey),
                  modified: +Moment(),
                })
              } else {
                newFiles.push(file)
              }
            })
            store.set({
              files: newFiles
            })
          }}
          onRenameFile={(oldKey, newKey) => {
            const newFiles = []
            store.get('files').map((file) => {
              if (file.key === oldKey) {
                newFiles.push({
                  ...file,
                  key: newKey,
                  modified: +Moment(),
                })
              } else {
                newFiles.push(file)
              }
            })
            store.set({
              files: newFiles
            })
          }}
          onDeleteFolder={folderKeys => {
            const newFiles = []
            store.get('files').map(file => {
              if (!folderKeys.find(folderKey => file.key.substr(0, folderKey.length) === folderKey)) {
                newFiles.push(file);
              }
            })
            store.set({
              files: newFiles
            })
          }}
          onDeleteFile={fileKeys => {
            store.set({
              files: store.get('files').filter(file => !fileKeys.includes(file.key))
            })
          }}
          onDownloadFile={fileKeys => {
            console.log('Downloading files: ', fileKeys)
          }}
          files={state.files}
        />
      )}
    </State>
  ))
