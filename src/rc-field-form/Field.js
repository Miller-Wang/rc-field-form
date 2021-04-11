import React from 'react';
import FieldContext from './FieldContext';

class Field extends React.Component {
  static contextType = FieldContext;

  render() {
    return this.props.children;
  }
}

export default Field;
