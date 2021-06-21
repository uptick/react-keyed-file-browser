import React from 'react'
import type { ConfirmMultipleDeletionRendererProps } from '@module/types'

const MultipleConfirmation: React.FC<ConfirmMultipleDeletionRendererProps> = ({ handleDeleteSubmit }) => {
  return (
    <button className="deleting" onClick={handleDeleteSubmit}>
      Confirm Deletion
    </button>
  )
}

export { MultipleConfirmation }
