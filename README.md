# react-keyed-file-browser

[![npm version](https://badge.fury.io/js/react-keyed-file-browser.svg)](http://badge.fury.io/js/react-keyed-file-browser)
![Downloads](http://img.shields.io/npm/dm/react-keyed-file-browser.svg?style=flat)

Folder based file browser given a flat keyed list of objects, powered by React.

## Live Demo

Check out the live demo here: http://abasystems.github.io/react-keyed-file-browser/

## Installation

Install the package with npm:

```
npm install react-keyed-file-browser
```

Then require and use with ES6 imports:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import FileBrowser from 'react-keyed-file-browser'

var mount = document.querySelectorAll('div.browser-mount');
ReactDOM.render(
  <FileBrowser
    files=[]
  />,
  mount[0]
);
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

Full reference documentation coming soon. For now, take a look at the reference implementation with
event handlers on the live demo at http://abasystems.github.io/react-keyed-file-browser/.
