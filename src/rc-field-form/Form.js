import React from 'react';
import FieldContext from './FieldContext';
import useForm from './useForm';
/**
 *
 * @param {*} props
 * initialValues 初始对象
 * onFinish 完成回调
 * @returns
 */
const Form = ({ initialValues, onFinish, children }) => {
  let [formInstance] = useForm();
  formInstance.setCallbacks({
    onFinish,
  });
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
