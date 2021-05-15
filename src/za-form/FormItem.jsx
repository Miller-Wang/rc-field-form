import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { Cell, Message } from 'zarm';
import { Field } from '../rc-field-form';
import { FormContext } from './Form';

function getRuleConfig(rules) {
  return rules.reduce((ruleMemo, rule) => {
    ruleMemo = { ...ruleMemo, ...rule };
    return ruleMemo;
  }, {});
}

const FormItem = (props) => {
  const { children, title, name, rules } = props;
  const [errorInfo, setErrorInfo] = useState();

  const formInstance = useContext(FormContext);

  const ruleConfig = useMemo(() => getRuleConfig(rules), [rules]);

  const { trigger, validator } = ruleConfig;

  // 校验当前 FormItem
  const validateItem = useCallback(() => {
    setTimeout(async () => {
      const { getFieldError, getFieldValue } = formInstance;

      if (validator && typeof validator === 'function') {
        const validatorRes = validator(
          rules,
          getFieldValue(name),
          (error) => setErrorInfo([error]),
          formInstance
        );
        // 是promise
        if (validatorRes && validatorRes.then) {
          try {
            await validatorRes;
            setErrorInfo();
          } catch (error) {
            setErrorInfo([error]);
          }
        }
      } else {
        const errors = getFieldError([name]);
        setErrorInfo(errors);
      }
    });
  }, [formInstance, name]);

  useEffect(() => {
    // 方法劫持
    const { submit, validateFields } = formInstance;
    formInstance.submit = (...args) => {
      validateItem();
      submit(...args);
    };

    formInstance.validateFields = (...args) => {
      validateItem();
      return validateFields(...args);
    };
  }, [formInstance, validateItem]);

  const getControlled = (childProps) => {
    const { onChange, onBlur } = childProps;

    return {
      ...childProps,
      onChange: async (e) => {
        onChange && onChange(e);
        trigger === 'change' && validateItem();
      },
      onBlur: async (e) => {
        onBlur && onBlur(e);
        trigger === 'blur' && validateItem();
      },
    };
  };

  return (
    <Field name={name} rules={rules}>
      <Cell
        title={title}
        help={
          errorInfo &&
          errorInfo.length > 0 && (
            <Message theme="danger">{errorInfo[0]}</Message>
          )
        }
      >
        {React.cloneElement(children, getControlled(children.props))}
      </Cell>
    </Field>
  );
};

export default FormItem;
