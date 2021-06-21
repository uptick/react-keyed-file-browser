import styled from 'styled-components'

export type TableRow = {
    isDragOver: boolean
    selected: boolean
}

export type TableHeader = {
    type?: 'size' | 'modified'
}

const TableRowContainer = styled.tr<TableRow>`
`

const TableHeaderContainer = styled.th<TableHeader>`
`

export { TableRowContainer, TableHeaderContainer }
