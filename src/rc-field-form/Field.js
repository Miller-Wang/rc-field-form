import React from 'react';
import FieldContext from './FieldContext';

/**
 * 实现双向数据绑定
 * input的值显示的是  formInstance.store对应的字段值
 * 当input的值发生改变时，要把值放在formInstance.store上
 */
class Field extends React.Component {
  static contextType = FieldContext;

  componentDidMount() {
    this.context.registerField(this);
  }

  onStoreChange = () => {
    this.forceUpdate();
  };

  getControlled = (childProps) => {
    const { name } = this.props;
    const { getFieldValue, setFieldValue } = this.context;
    return {
      ...childProps,
      value: getFieldValue(name),
      onChange: (e) => {
        setFieldValue(name, e.target.value);
      },
    };
  };
  render() {
    console.log('渲染 Field');
    const children = this.props.children;
    // 给children添加属性
    return React.cloneElement(children, this.getControlled(children.props));
  }
}

export default Field;
