import React from 'react';
import ReactDOM from 'react-dom';
// import Form, { Field } from 'rc-field-form';
import Form, { Field } from './rc-field-form';

ReactDOM.render(
  <Form
    initialValues={{ username: '1', password: '2' }}
    onFinish={(values) => {
      console.log('成功', values);
    }}
    onFinishFailed={(errorInfo) => {
      // 校验
      console.log('校验失败', errorInfo);
    }}
  >
    <Field name="username" rules={[{ required: true }]}>
      <input placeholder="用户名" />
    </Field>
    <Field name="password" rules={[{ required: true }]}>
      <input placeholder="密码" />
    </Field>
    <button>提交</button>
  </Form>,
  document.getElementById('root')
);
