import React from 'react'

import ListThumbnail from './list-thumbnail.jsx'

const SimpleListThumbnailFile = React.createClass({
  render: function() {
    return (
      <ListThumbnail
        {...this.props}
        showName={false}
        showSize={false}
        showModified={false}
        isSelectable={false}
      />
    );
  },
});

export default SimpleListThumbnailFile
