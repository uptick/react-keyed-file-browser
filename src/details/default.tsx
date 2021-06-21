import React from 'react'
import type { DetailRendererProps } from '@module/types'

const DefaultDetails: React.FC<DetailRendererProps> = ({ file, close }) => {
  function handleCloseClick(event) {
    if (event) {
      event.preventDefault()
    }

    close()
  }

  const path = file.key.split('/')
  const name = path.length ? path[path.length - 1] : ''

  return (
    <div>
      <h2>Item Detail</h2>
      <dl>
        <dt>Key</dt>
        <dd>{file.key}</dd>

        <dt>Name</dt>
        <dd>{name}</dd>
      </dl>
      <a href="#" onClick={handleCloseClick}>
        Close
      </a>
    </div>
  )
}

export { DefaultDetails }
