import React from 'react'
import type { HeaderRendererProps } from '@module/types'

import { TableRowContainer, TableHeaderContainer } from './style'

const RawTableHeader: React.FC<HeaderRendererProps> = () => {
  return (
    <TableRowContainer isDragOver={false} selected={true}>
      <TableHeaderContainer>Files</TableHeaderContainer>
      <TableHeaderContainer type="size">Size</TableHeaderContainer>
      <TableHeaderContainer type="modified">
        Last Modified
      </TableHeaderContainer>
    </TableRowContainer>
  )
}

export { RawTableHeader }
