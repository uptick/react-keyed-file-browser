import React from 'react'
import Moment from 'moment'
import { storiesOf } from '@storybook/react'
import FileBrowser, { FileRenderers, FolderRenderers, Groupers, Icons } from '../src'
import './stories'

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
      onDownloadFile={() => {}}
      headerRenderer={null}
      group={Groupers.GroupByFolder}
      fileRenderer={FileRenderers.ListThumbnailFile}
      folderRenderer={FolderRenderers.ListThumbnailFolder}
    />
  ))
