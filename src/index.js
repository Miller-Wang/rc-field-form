import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, Select, Toast } from 'zarm';
import Form, { FormItem } from './za-form/index';
import 'zarm/dist/zarm.css';

const asyncValidate = (rule, value, callback, form) => {
  // 方式一
  // if (value === 'admin') {
  //   return Promise.reject(`用户名已经被占用`);
  // } else {
  //   return Promise.resolve('');
  // }

  // 方式二
  // if (value === 'admin') {
  //   callback(`用户名已经被占用`);
  // } else {
  //   callback();
  // }

  // 方式三 异步校验
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (value === 'admin') {
        reject(`用户名已经被占用`);
      } else {
        resolve('');
      }
    }, 3000);
  });
};

const MySelect = (props) => {
  const { onChange, ...rests } = props;
  return <Select {...rests} onOk={onChange} />;
};

const TestZarmUI = (props) => {
  const formRef = useRef();
  // 手动提交
  const handleSubmit = async () => {
    try {
      const values = await formRef.current.validateFields();
      Toast.show(JSON.stringify(values));
    } catch (error) {
      Toast.show(JSON.stringify(error));
    }
  };

  // 表单提交
  const onFinish = (values) => {
    Toast.show(JSON.stringify(values));
  };

  const onFinishFailed = (errorInfo) => {
    Toast.show('校验失败' + JSON.stringify(errorInfo));
  };

  return (
    <div>
      <Form onFinish={onFinish} onFinishFailed={onFinishFailed} ref={formRef}>
        <FormItem
          name="username"
          rules={[
            { required: true, validator: asyncValidate, trigger: 'blur' },
          ]}
          title="异步校验"
        >
          <Input placeholder="用户名" />
        </FormItem>
        <FormItem
          name="password"
          rules={[
            {
              required: true,
              min: 6,
              trigger: 'blur',
              message: '密码不少于6位',
            },
          ]}
          title="密码"
        >
          <Input placeholder="密码" />
        </FormItem>

        <FormItem
          name="option"
          rules={[
            {
              required: true,
              message: '请选择城市',
            },
          ]}
          title="城市"
        >
          <MySelect
            dataSource={[
              { value: '2', label: '上海市' },
              { value: '1', label: '北京市' },
            ]}
          />
        </FormItem>

        <Button
          htmlType="submit"
          block
          theme="primary"
          style={{ marginBottom: '10px' }}
        >
          表单内提交
        </Button>
      </Form>
      <Button
        theme="primary"
        block
        onClick={handleSubmit}
        style={{ marginBottom: '10px' }}
      >
        手动提交
      </Button>
    </div>
  );
};

ReactDOM.render(<TestZarmUI />, document.getElementById('root'));
