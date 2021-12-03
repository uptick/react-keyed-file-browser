# react-keyed-file-browser

[![Build Status](https://travis-ci.org/uptick/react-keyed-file-browser.svg?branch=master)](https://travis-ci.org/uptick/react-keyed-file-browser)
[![npm version](https://badge.fury.io/js/react-keyed-file-browser.svg)](http://badge.fury.io/js/react-keyed-file-browser)
![Downloads](http://img.shields.io/npm/dm/react-keyed-file-browser.svg?style=flat)

Folder based file browser given a flat keyed list of objects, powered by React.

## Live Demo

Check out the live demo here: http://uptick.github.io/react-keyed-file-browser/

## Installation

Install the package with npm:

```bash
# NPM
npm install react-keyed-file-browser

# Yarn
yarn add react-keyed-file-browser
```


```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import FileBrowser from 'react-keyed-file-browser'

ReactDOM.render(
  <FileBrowser
    files={[]}
  />,
  document.getElementById('root')
);
```

Include icons from FontAwesome 4:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import FileBrowser, { Icons } from 'react-keyed-file-browser'

// this imports the FontAwesome Icon Styles
import 'font-awesome/css/font-awesome.min.css'

var mount = document.querySelectorAll('div.browser-mount');
ReactDOM.render(
  <FileBrowser
    files={[]}
    icons={Icons.FontAwesome(4)}
  />,
  mount[0]
);
```

or your own icons by specifying as so:
```javascript
  <FileBrowser
    files={[]}
    icons={{
      File: <i className="file" aria-hidden="true" />,
      Image: <i className="file-image" aria-hidden="true" />,
      PDF: <i className="file-pdf" aria-hidden="true" />,
      Rename: <i className="i-cursor" aria-hidden="true" />,
      Folder: <i className="folder" aria-hidden="true" />,
      FolderOpen: <i className="folder-open" aria-hidden="true" />,
      Delete: <i className="trash" aria-hidden="true" />,
      Loading: <i className="circle-notch spin" aria-hidden="true" />,
    }}
  />
```

Optionally, include the built css with an import:

```scss
@import 'node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css';
```
or tag:

```html
<link
  href="static/node_modules/react-keyed-file-browser/dist/react-keyed-file-browser.css"
  rel="stylesheet"
>
```
## Examples

Using a custom drag and drop provider.
```javascript
import { RawFileBrowser } from 'react-keyed-file-browser'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

<DndProvider backend={HTML5Backend}>
  <RawFileBrowser files={[]}/>
</DndProvider>
```


Full reference documentation coming soon. For now, take a look at the reference implementation with
event handlers on the live demo at http://uptick.github.io/react-keyed-file-browser/.
