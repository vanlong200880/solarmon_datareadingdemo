import React, { Component, PropTypes } from 'react'

export default class TagEditor extends Component {
  render () {
    const { entity } = this.props

    return (
      <div className='custom-editor'>
        <div>
          <h1><i className='fa fa-folder' /> {entity.name}</h1>
        </div>
      </div>
    )
  }
}

TagEditor.propTypes = {
  entity: PropTypes.object.isRequired
}
