import React from 'react';
import Prism from 'prismjs'
import Page from 'src/components/page';
import { withRouter } from 'react-router-dom';
// import ReactMarkdown from 'react-markdown';
import { Button, Input, Icon, message } from 'antd';
import marked from 'marked';
// import { debounce } from 'lodash'

const { TextArea } = Input;

class ArticleDetail extends Page {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      content: '',
      parsed: '',
    };
    // 函数声明
    this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
    this.handleSave = this.handleSave.bind(this);
  }

  componentDidMount() {
    this.fetch();
  }

  fetch() {
    this.axios.get('/article/detail', {
      params: {
        id: this.props.match.params.id,
      },
    })
      .then((res) => {
        const result = res.result
        const markedHtml = marked(result.content, {})

        this.setState({
          detail: res.result,
          content: res.result.content,
          parsed: markedHtml,
        }, () => {
          Prism.highlightAll();
        })
      })
  }

  /**
   * textarea改变
   */
  handleTextAreaChange(e) {
    const markedHtml = marked(e.target.value, {})
    this.setState({
      content: e.target.value,
      parsed: markedHtml,
    }, () => {
      Prism.highlightAll()
    });
  }

  /**
   * 保存
   */
  handleSave() {
    this.axios.post('/article/detail/update', {
      header_id: this.props.match.params.id,
      content: this.state.content,
    })
      .then((res) => {
        message.success('保存成功');
      })
  }

  render() {
    const { detail, content, parsed } = this.state;
    return (
      <div className="article-detail flex vertical">
        <div className="header">
          <h2>{detail.title}</h2>
          <p>{detail.desciption}</p>
          <div className="button">
            <Button type="primary" onClick={this.handleSave}><Icon type="save"/>保存</Button>
          </div>
        </div>
        <div className="content flex">
          <div className="editor">
            <TextArea value={content} onChange={(e) => {
              e.persist()
              this.handleTextAreaChange(e)
            }}/>
          </div>
          <div className="show">
            <div className="parse-html" dangerouslySetInnerHTML={{__html: parsed}}/>
            {/* <ReactMarkdown source={content}></ReactMarkdown> */}
          </div>
        </div>
        <style jsx>{`
          @import 'src/assets/style/common/variables.styl';

          .article-detail {
            height: 100%;
            background: $white;
            padding: 25px;

            & .header {
              position: relative;
              text-align: center;
              padding-bottom: 20px;

              & .button {
                position: absolute;
                top: 20px;
                left: 0;
              }
            }

            & .content {
              flex: 1;
              height: 0;
              overflow: hidden;

              & > div {
                flex: 1;
                height: 100%;
                overflow: auto;
              }

              & .editor {
                margin-right: 20px;
                padding-bottom: 2px;

                & :global(textarea) {
                  height: 100% !important;
                }
              }

              & .show {
                margin-left: 20px;
                padding: 4px 11px;
                border: 1px solid #d9d9d9;
                border-radius: 4px;
                transition: all .3s;
                
                &:hover {
                  border-color: #40a9ff;
                }

                & :global(code) {
                  padding: 2px 0;
                  font-size: 90%;
                  color: #c7254e;
                  background-color: #f9f2f4;
                  border-radius: 4px;
                }

                & :global(pre.language-directory) {
                  background: #282c34;
                  color: #fff;
                  border-radius: 6px;

                  & :global(code) {
                    background: transparent;
                    color: #fff;
                    text-shadow: none;
                    padding: 2px 0;
                  }
                }

                & :global(a) {
                  color: #337ab7;
                  text-decoration: none;
                }
              }
            }
          }
        `}</style>
      </div>
    )
  }
}

export default withRouter(ArticleDetail);