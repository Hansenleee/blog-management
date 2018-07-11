import React from 'react';
import Page from '../page';
import { Modal, Form, Input, message } from 'antd';
import events from 'src/utils/events';
import md5 from 'md5';

const FormItem = Form.Item;

class Login extends Page {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
    // 函数声明
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  /**
   * 登录
   */
  handleSubmit() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.password = md5(values.password).toUpperCase();
        this.setState({
          confirmLoading: true,
        });
        this.axios.post('/user/login', values)
          .then((res) => {
            this.log(res)
            message.success('登录成功');
            // 关闭modal
            this.handleClose();
            // modal里的form重置为空
            this.props.form.resetFields();
            // 刷新
            global.location.reload();
          })
          .finally(() => {
            // modal-》loading
            this.setState({
              confirmLoading: false,
            });
          })
      }
    });
  }

  /**
   * 取消
   */
  handleClose() {
    events.emit('change-login-visible');
  }

  render() {
    const { visible } = this.props;
    const { confirmLoading } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 12
      },
    };

    return (
      <Modal 
        title="登录"
        visible={visible}
        confirmLoading={confirmLoading}
        onOk={this.handleSubmit}
        onCancel={this.handleClose}>
        <div className="login">
          <Form>
            <FormItem
              {...formItemLayout}
              label="用户名">
              {getFieldDecorator('username', {
                rules: [{
                  required: true, message: '请输入用户名',
                }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码">
              {getFieldDecorator('password', {
                rules: [{
                  required: true, message: '请输入密码',
                }],
              })(
                <Input type="password"/>
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    )
  }
}

export default Form.create()(Login);;