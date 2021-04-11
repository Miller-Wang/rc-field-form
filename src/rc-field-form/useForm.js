import { useRef, useState } from 'react';
import Schema from 'async-validator';

class FormStore {
  constructor(forceRerender) {
    this.forceRerender = forceRerender;
    this.store = {}; // 非常重要，用来存放表单值的对象
    this.callbacks = {};
    this.fieldEntities = [];
  }

  registerField = (fieldEntity) => {
    this.fieldEntities.push(fieldEntity);
  };

  // 设置字段的值
  setFieldsValue = (newStore) => {
    this.store = { ...this.store, ...newStore };
    this.fieldEntities.forEach((entity) => entity.onStoreChange());
  };

  setFieldValue = (key, val) => {
    this.store[key] = val;
    this.fieldEntities.forEach((entity) => {
      if (entity.props.name && entity.props.name === key) {
        entity.onStoreChange();
      }
    });
  };

  // 获取单个值
  getFieldValue = (name) => this.store[name];

  getFieldsValue = () => ({ ...this.store });

  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
  };

  // 设置初始值
  setInitialValues = (initialValues) => {
    this.store = { ...initialValues };
  };

  // 提交表单时执行
  submit = async () => {
    const { onFinish, onFinishFailed } = this.callbacks;
    try {
      await this.validateFields();
      onFinish && onFinish({ ...this.store });
    } catch (error) {
      onFinishFailed && onFinishFailed(error.errors);
    }
  };

  // 校验表单
  validateFields = () => {
    let values = this.getFieldsValue();
    const descriptor = this.fieldEntities.reduce((memo, entity) => {
      let rules = entity.props.rules;
      if (rules && rules.length) {
        let config = rules.reduce((ruleMemo, rule) => {
          ruleMemo = { ...ruleMemo, ...rule };
          return ruleMemo;
        }, {});
        memo[entity.props.name] = config;
      }
      return memo;
    }, {});
    return new Schema(descriptor).validate(values);
  };

  // 对外暴露方法
  getForm = () => {
    return {
      setFieldsValue: this.setFieldsValue,
      setFieldValue: this.setFieldValue,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setCallbacks: this.setCallbacks,
      setInitialValues: this.setInitialValues,
      submit: this.submit,
      registerField: this.registerField,
    };
  };
}

export default function useForm() {
  // 可以在多次组件渲染时，保证current不变
  let formRef = useRef();
  const [, forceUpdate] = useState({});
  if (!formRef.current) {
    // 强制刷新
    const forceReRender = () => {
      forceUpdate({});
    };
    let formStore = new FormStore(forceReRender);
    let formInstance = formStore.getForm();
    formRef.current = formInstance;
  }

  return [formRef.current];
}
