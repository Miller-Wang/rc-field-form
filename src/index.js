import React from 'react';
import ReactDOM from 'react-dom';
import Form, { Field } from 'rc-field-form';

ReactDOM.render(
  <Form
    initialValues={{ username: '', password: '' }}
    onFinish={(values) => {
      console.log(values);
    }}
  >
    <Field name="username">
      <input placeholder="用户名" />
    </Field>
    <Field name="password">
      <input placeholder="密码" />
    </Field>
    <button>提交</button>
  </Form>,
  document.getElementById('root')
);
