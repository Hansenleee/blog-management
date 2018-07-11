import React from 'react';
import Page from 'src/components/page';
import { Table, Row, Col, Button, Icon, Divider, Modal, Form, Input, message, Popconfirm } from 'antd';

const FormItem = Form.Item;

class CategoryList extends Page {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
      modal: {
        visible: false,
        confirmLoading: false,
        record: {},
        parentRecord: {},
      },
    };
    // 函数声明
    this.handleOnOk = this.handleOnOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  /**
   * 获取分类列表
   */
  fetch() {
    this.setState({
      loading: true,
    });
    return this.axios.get('/category/all')
      .then((res) => {
        if (res.code === 0) {
          this.setState({
            list: res.result,
          });
        }
      })
      .finally(() => this.setState({
        loading: false,
      }));
  }

  /**
   * 显隐modal框
   */
  handleChangeModal(visible) {
    this.setState((preState) => ({
      modal: {
        ...preState.modal,
        visible: visible === undefined ? !preState.state.visible : visible,
      }
    }))
  }

  /**
   * modal确认
   */
  handleOnOk() {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: true,
          }
        }))

        if (!this.state.modal.record.code) {
          this.addHeaderData(values);
        } else {
          this.editCategory(values);
        }
      }
    });
  }

  /**
   * 新增顶级分类
   */
  addHeaderData(values) {
    const parentRecord = this.state.modal.parentRecord;
    let url = '/category/header/insert';
    let data = values;

    if (!!parentRecord.code) {
      url = '/category/line/insert';
      data = Object.assign({}, values, {
        header_id: parentRecord.id,
      })
    }


    this.axios.post(url, data)
      .then((res) => {
        // 提示
        message.success('新增成功');
        // modal-》loading
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: false,
            parentRecord: {},
          }
        }));
        // 关闭modal
        this.handleChangeModal(false);
        // modal里的form重置为空
        this.props.form.resetFields()
        // 重新加载表格
        this.fetch();
      })
  }

  /**
   * 编辑分类
   */
  editCategory(values) {
    const record = this.state.modal.record;

    const url = record.level === 1 ? '/category/header/update' : '/category/line/update';

    this.axios.post(url, values).then((res) => {
      // 提示
      message.success('修改成功');
      // modal-》loading
      this.setState((preState) => ({
        modal: {
          ...preState.modal,
          confirmLoading: false,
          record: {},
        }
      }));
      // 关闭modal
      this.handleChangeModal(false);
      // modal里的form重置为空
      this.props.form.resetFields()
      // 重新加载表格
      this.fetch();
    })
  }

  /**
   * modal取消
   */
  handleCancel() {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false,
        record: {},
        parentRecord: {},
      },
    });
  }

  /**
   * 编辑
   */
  handleEdit(record) {
    this.setState({
      modal: {
        ...this.state.modal,
        record,
      },
    });
    this.handleChangeModal(true);
  }

  /**
   * 删除
   */
  handleDelete(record) {
    const url = record.level === 1 ? '/category/header/delete' : '/category/line/delete';

    this.axios.post(url, record).then((res) => {
      // 提示
      message.success('删除成功');
      this.fetch();
    })
  }
  
  /**
   * 新增子分类
   */
  handleAddCategory(record) {
    this.setState({
      modal: {
        ...this.state.modal,
        parentRecord: record,
      },
    });
    this.handleChangeModal(true);
  }

  render() {
    const { list, loading, modal } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      },
    };
    // table数据
    const columns = [{
      title: '分类编码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button onClick={this.handleEdit.bind(this, record)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确认删除当前分类和分类下的子分类？" onConfirm={this.handleDelete.bind(this, record)}>
            <Button type="danger">删除</Button>
          </Popconfirm>
          {
            record.level !== 2 ?
              <React.Fragment>
                <Divider type="vertical" />
                <Button type="primary" onClick={this.handleAddCategory.bind(this, record)}>新增子分类</Button>
              </React.Fragment> : null
          }
        </span>
      ),
    }]

    return (
      <div className="category-list">
        <div className="top-bar">
          <Row>
            <Col span={6}>
              <Button type="primary" onClick={this.handleChangeModal.bind(this, true)}>
                <Icon type="plus"/>新增顶级分类
              </Button>
            </Col>
            <Col span={18}></Col>
          </Row>
        </div>
        <Table 
          columns={columns}
          dataSource={list}
          rowKey="code"
          loading={loading}
          pagination={false}/>
        <Modal
          title="新增分类"
          visible={modal.visible}
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
          confirmLoading={modal.confirmLoading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="分类编码">
              {getFieldDecorator('code', {
                rules: [{
                  required: true, message: '请输入分类编码',
                }],
                initialValue: modal.record.code || '',
              })(
                <Input disabled={!!modal.record.code}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="分类名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true, message: '请输入分类名称',
                }],
                initialValue: modal.record.name || '',
              })(
                <Input />
              )}
            </FormItem>
          </Form>
        </Modal>
        <style jsx>{`
          @import 'src/assets/style/common/variables.styl';

          .category-list {
            height: 100%;
            background: $white;
            padding: 25px;

            & .top-bar {
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>
    )
  }
}

export default Form.create()(CategoryList);