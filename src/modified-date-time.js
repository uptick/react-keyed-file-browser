import React from 'react'
import PropTypes from 'prop-types'
import { format, formatDistanceToNow } from 'date-fns'

export class ModifiedDateTime extends React.Component {
    static propTypes = {
      formats: PropTypes.array,
      modified: PropTypes.number.isRequired,
    }

    dateTimeFormats = new Map()
      .set('@distanceToNow', (modified) => formatDistanceToNow(modified, { addSuffix: true }))

    constructor(props) {
      super(props)

      this.state = {
        formats: props.formats.slice(0, 2),
      }
    }

    getDateTime(modified, formatString) {
      return formatString ? (this.dateTimeFormats.has(formatString) ? this.dateTimeFormats.get(formatString)(modified) : format(modified, formatString)) : null
    }

    render() {
      const { modified } = this.props
      const { formats } = this.state

      const defaultFormat = formats[0] || '@distanceToNow'
      const altFormat = formats[1]

      const defaultValue = this.getDateTime(modified, defaultFormat) || '-'
      const altValue = this.getDateTime(modified, altFormat)

      const handleClick = () => {
        if (altValue) {
          this.setState(() => ({ formats: [altFormat, defaultFormat] }))
        }
      }

      return (
        <div title={altValue} onClick={handleClick}>
          {defaultValue}
        </div>
      )
    }
}
