import { useRef, useState } from 'react';

class FormStore {
  constructor(forceRerender) {
    this.forceRerender = forceRerender;
    this.store = {}; // 非常重要，用来存放表单值的对象
    this.callbacks = {};
  }

  // 设置字段的值
  setFieldsValue = (newStore) => {
    this.store = { ...this.store, ...newStore };
  };

  // 获取单个值
  getFieldValue = (name) => this.store[name];

  getFieldsValue = () => ({ ...this.store });

  setCallbacks = (callbacks) => {
    this.callbacks = callbacks;
  };

  // 提交表单时执行
  submit = () => {
    const { onFinish } = this.callbacks;
    onFinish && onFinish(this.store);
  };

  // 对外暴露方法
  getForm = () => {
    return {
      setFieldsValue: this.setFieldsValue,
      getFieldValue: this.getFieldValue,
      setCallbacks: this.setCallbacks,
      submit: this.submit,
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
