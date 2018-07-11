import React from 'react';
import Page from 'src/components/page';
import { Table, Row, Col, Button, Icon, Divider, Modal, Form, Input, message, Popconfirm, Cascader } from 'antd';
import { withRouter } from 'react-router-dom';

const FormItem = Form.Item;
const { TextArea } = Input;
const CascaderFile = { label: 'name', value: 'id', children: 'children' }

class ArticleList extends Page {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      loading: false,
      modal: {
        visible: false,
        title: '',
        record: {},
        confirmLoading: false,
      },
      category: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        totalCount: 10,
      },
    };
    // 函数声明
    this.handleAddArticle = this.handleAddArticle.bind(this);
    this.handleEditArticle = this.handleEditArticle.bind(this);
    this.handleOnOk = this.handleOnOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.hanleGoDetail = this.hanleGoDetail.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  componentDidMount() {
    this.fetch(1);
  }

  fetch(currentPage = 1) {
    this.setState({
      loading: true,
    });
    const { page } = this.state;
    this.axios.get('/article/headers', {
      params: {
        currentPage,
        pageSize: page.pageSize,
      },
    })
      .then((res) => {
        const { list, currentPage, totalCount } = res.result;

        this.setState({
          // list: currentPage === 1 ? list : this.state.list.concat(list),
          list,
          page: {
            ...this.state.page,
            currentPage,
            totalCount,
          }
        })
      })
      .finally(() => this.setState({
        loading: false,
      }));
  }

  /**
   * 分页
   */
  handlePageChange(page) {
    this.fetch(page);
  }

  /**
   * 获取分类列表
   */
  fetchCategory() {
    return this.state.category.length === 0 && this.axios.get('/category/all')
      .then((res) => {
        if (res.code === 0) {
          const result = res.result;

          result.forEach((item, index) => {
            if (!item.children || item.children.length === 0) {
              item.disabled = true;
            }
          });

          this.setState({
            category: res.result,
          });
        }
      })
  }

  /**
   * 新建文章
   */
  handleAddArticle() {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        title: '新建文章',
      }
    });
    // 查询分类
    this.fetchCategory();
  }

  /**
   * 编辑文章
   */
  handleEditArticle(record) {
    record.cate_line_id = [record.cate_header_id ,record.cate_line_id];

    this.setState({
      modal: {
        ...this.state.modal,
        visible: true,
        title: '编辑文章',
        record,
      }
    });
    // 查询分类
    this.fetchCategory();
  }

  /**
   * modal弹窗的确认
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
          this.addArticle(values);
        } else {
          this.editArticle(values);
        }
      }
    });
  }

  /**
   * modal弹窗取消
   */
  handleCancel() {
    this.setState({
      modal: {
        ...this.state.modal,
        visible: false,
        title: '',
        record: {},
      }
    });
  }

  /**
   * 新增文章
   */
  addArticle(values) {
    values.cate_line_id = values.cate_line_id[1];

    this.axios.post('/article/headers/insert', values)
      .then((res) => {
        // 提示
        message.success('新增成功');
        // modal-》loading
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: false,
            visible: false,
          }
        }));
        // modal里的form重置为空
        this.props.form.resetFields()
        // 重新加载表格
        this.fetch();
      })
      .catch((err) => {
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: false,
          }
        }));
      })
  }

  /**
   * 编辑文章
   */
  editArticle(values) {
    values.cate_line_id = values.cate_line_id[1];

    this.axios.post('/article/headers/update', values)
      .then((res) => {
        // 提示
        message.success('修改成功');
        // modal-》loading
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: false,
            visible: false,
            record: {},
          }
        }));
        // modal里的form重置为空
        this.props.form.resetFields()
        // 重新加载表格
        this.fetch();
      })
      .catch((err) => {
        this.setState((preState) => ({
          modal: {
            ...preState.modal,
            confirmLoading: false,
          }
        }));
      })
  }

  /**
   * 删除
   */
  handleDelete(record) {
    this.axios.post('/article/headers/delete', record).then((res) => {
      // 提示
      message.success('删除成功');
      this.fetch();
    })
  }

  /**
   * 去详情
   */
  hanleGoDetail(record) {
    this.props.history.push(`/articles/${record.id}`);
  }

  render() {
    const { list, loading, modal, category, page } = this.state;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 16
      },
    };
    const columns = [{
      title: '文章编码',
      dataIndex: 'code',
      key: 'code',
      render: (text, record) => {
        return <a onClick={this.hanleGoDetail.bind(this, record)}>{text}</a>
      }
    }, {
      title: '文章标题',
      dataIndex: 'title',
      key: 'title',
    }, {
      title: '文章分类',
      dataIndex: 'cate_name',
      key: 'cate_name',
    }, {
      title: '文章简介',
      dataIndex: 'desciption',
      key: 'desciption',
    }, {
      title: '创建时间',
      dataIndex: 'creation_date',
      key: 'creation_date',
    }, {
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={this.handleEditArticle.bind(this, record)}>编辑</Button>
          <Divider type="vertical" />
          <Popconfirm title="确认删除当前分类和分类下的子分类？" onConfirm={this.handleDelete.bind(this, record)}>
            <Button type="danger">删除</Button>
          </Popconfirm>
        </span>
      ),
    }];

    return (
      <div className="articles-list">
        <div className="top-bar">
          <Row>
            <Col span={6}>
              <Button type="primary" onClick={this.handleAddArticle}><Icon type="plus"/>新建</Button>
            </Col>
            <Col span={18}></Col>
          </Row>
        </div>
        <Table 
          columns={columns}
          loading={loading}
          dataSource={list}
          rowKey="code"
          pagination={{
            current: page.currentPage,
            pageSize: page.pageSize,
            total: page.totalCount,
            onChange: this.handlePageChange,
          }}
          />
        <Modal
          title={modal.title}
          visible={modal.visible}
          onOk={this.handleOnOk}
          onCancel={this.handleCancel}
          confirmLoading={modal.confirmLoading}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="文章编码">
              {getFieldDecorator('code', {
                rules: [{
                  required: true, message: '请输入文章编码',
                }],
                initialValue: modal.record.code || '',
              })(
                <Input disabled={!!modal.record.code}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文章标题">
              {getFieldDecorator('title', {
                rules: [{
                  required: true, message: '文章标题',
                }],
                initialValue: modal.record.title || '',
              })(
                <Input />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文章类别">
              {getFieldDecorator('cate_line_id', {
                rules: [{
                  required: true, message: '请选择文章类别',
                }],
                initialValue: modal.record.cate_line_id || '',
              })(
                <Cascader options={category} filedNames={CascaderFile}/>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="文章简介">
              {getFieldDecorator('desciption', {
                rules: [{
                  required: true, message: '请输入文章简介',
                }],
                initialValue: modal.record.desciption || '',
              })(
                <TextArea />
              )}
            </FormItem>
          </Form>
        </Modal>
        <style jsx>{`
          @import 'src/assets/style/common/variables.styl';

          .articles-list {
            height: 100%;
            background: $white;
            padding: 25px;

            & .top-bar {
              margin-bottom: 20px;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Form.create()(withRouter(ArticleList));