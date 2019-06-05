import React, { Component } from 'react'
import { view, store } from 'react-stax'

const searchStyle = {
  width: '50%',
  minWidth: 180,
  font: 'inherit',
  border: 'none',
  borderRadius: 2,
  padding: '12px 15px',
  outline: 'none'
}

class SearchBar extends Component {
  store = store();

  static deriveStoresFromProps (props, store) {
    store.value = props.value || ''
  }

  onKeyPress = ev => {
    const { onSearch } = this.props
    if (onSearch && ev.charCode === 13) {
      onSearch(ev.target.value)
    }
  };

  onChange = ev => (this.store.value = ev.target.value);

  render () {
    return (
      <input
        onKeyPress={this.onKeyPress}
        onChange={this.onChange}
        placeholder='Search'
        type='search'
        value={this.store.value}
        style={searchStyle}
      />
    )
  }
}

export default view(SearchBar)
