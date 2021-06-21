import React from 'react'
import ListThumbnailFile from './list-thumbnail.js'

const SimpleListThumbnail: React.FC = (props) => {
  return (
        <ListThumbnailFile
        {...props}
        showName={false}
        showSize={false}
        showModified={false}
        isSelectable={false}
      />
  )
}

export { SimpleListThumbnail }
