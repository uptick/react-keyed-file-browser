import React from 'react'
import type { ConfirmDeletionRendererProps } from '@module/types'

const SingleConfirmation: React.FC<ConfirmDeletionRendererProps> = ({
  children,
  handleDeleteSubmit,
  handleFileClick,
  url,
}) => {
  return (
    <form className="deleting" onSubmit={handleDeleteSubmit}>
      <a href={url} download="download" onClick={handleFileClick}>
        {children}
      </a>
      <div>
        <button type="submit">Confirm Deletion</button>
      </div>
    </form>
  )
}

SingleConfirmation.defaultProps = {
  url: '#',
}

export { SingleConfirmation }
