import React, { forwardRef } from 'react';
import Form, { useForm } from '../rc-field-form';

export const FormContext = React.createContext();

function ZAFrom(props, ref) {
  const { children, ...rests } = props;
  const [formInstance] = useForm();

  return (
    <Form {...rests} form={formInstance} ref={ref}>
      <FormContext.Provider value={formInstance}>
        {props.children}
      </FormContext.Provider>
    </Form>
  );
}
export default forwardRef(ZAFrom);
