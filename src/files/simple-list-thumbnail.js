import React from 'react'

import ListThumbnailFile from './list-thumbnail.js'

class SimpleListThumbnailFile extends React.Component {
  render() {
    return (
      <ListThumbnailFile
        {...this.props}
        showName={false}
        showSize={false}
        showModified={false}
        isSelectable={false}
      />
    )
  }
}

export default SimpleListThumbnailFile
