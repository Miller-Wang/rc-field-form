import React, { useRef } from 'react';
import FieldContext from './FieldContext';
import useForm from './useForm';
/**
 *
 * @param {*} props
 * initialValues 初始对象
 * onFinish 完成回调
 * @returns
 */
const Form = ({ initialValues, onFinish, onFinishFailed, children }) => {
  let [formInstance] = useForm();
  formInstance.setCallbacks({
    onFinish,
    onFinishFailed,
  });
  console.log('渲染 form');
  const mountRef = useRef(null);
  if (!mountRef.current) {
    initialValues && formInstance.setInitialValues(initialValues);
    mountRef.current = true;
  }
  return (
    <form
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        // 调用表单提交方法
        formInstance.submit();
      }}
    >
      <FieldContext.Provider value={formInstance}>
        {children}
      </FieldContext.Provider>
    </form>
  );
};

export default Form;
