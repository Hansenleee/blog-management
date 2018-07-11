import React from 'react';
import Page from 'src/components/page';
import { Menu, Icon, Button } from 'antd';
import menuData, { getPathMap } from 'src/common/menu';
import classnames from 'classnames';
import appRoutes from './routes';
import { Switch, Link, withRouter } from 'react-router-dom';
import events from 'src/utils/events';
import Login from 'src/components/login';
import 'src/assets/style/common/flexible.styl'

const { SubMenu, Item } = Menu;
const menuPath = getPathMap(menuData);

class App extends Page {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      menuConfig: {},
      loginVisible: false,
    }
    // 函数声明
    this.toggleCollapsed = this.toggleCollapsed.bind(this);
  }

  componentWillMount() {
    this.getDefaultMenuSet();
  }

  componentDidMount() {
    this.setListener()
  }

  /**
   * 获取初始化菜单栏状态
   */
  getDefaultMenuSet() {
    const pathname = this.props.location.pathname;
    const path = menuPath[pathname];

    if (path) {
      this.setState({
        menuConfig: {
          defaultOpenKeys: path.parents,
          defaultSelectedKeys: [path.key],
        },
      })
    }
  }

  /**
   * menu缩放
   */
  toggleCollapsed() {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }

  /**
   * 事件监听
   */
  setListener() {
    events.on('change-login-visible', () => this.setState((preState) => ({
      loginVisible: !preState.loginVisible,
    })));
  }

  render() {
    const { collapsed, menuConfig, loginVisible } = this.state;
    const siderBarClass = classnames({
      'side-bar': true,
      'collapsed': collapsed,
    });

    return (
      <div className="app flex">
        <div className={siderBarClass}>
          <div className="app-logo">
            <Link to="/dashbord">{collapsed ? 'L&N' : 'Lee & NP'}</Link>
          </div>
          <Menu
            {...menuConfig}
            mode="inline"
            theme="dark"
            inlineCollapsed={this.state.collapsed}
            style={{height: '100%'}}
          >
            {
              menuData.map((data) => {
                return (
                  <SubMenu key={data.key} title={<span><Icon type={data.icon} /><span>{data.name}</span></span>}>
                    {
                      data.children.map((child) => {
                        return (
                          <Item key={child.key}><Link to={child.path}>{child.name}</Link></Item>
                        )
                      })
                    }
                  </SubMenu>
                )
              })
            }
          </Menu>
        </div>
        <div className="container flex vertical">
          <header>
            <Button type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
              <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
            </Button>
            <div className="info">
              <Icon type="user"/>
              <span>管理员</span>
            </div>
          </header>
          <div className="main-body">
            <Switch>
              {appRoutes}
            </Switch>
          </div>
        </div>
        <Login visible={loginVisible}/>
        <style jsx>{`
          @import 'src/assets/style/common/flexible.styl';
          @import 'src/assets/style/common/variables.styl';

          .app {
            width: 100%;
            height: 100%;

            & .side-bar {
              position: relative;
              z-index: $z-index-sider-bar;
              width: 256px;
              height: 100%;
              box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
              background: #001529;
              transition: width 0.5s;

              &.collapsed {
                width: 80px;
              }

              & .app-logo {
                height: 64px;
                line-height: 64px;
                background: #002140;
                color: $white;
                text-align: center;
                font-size: 20px;
                cursor: pointer;

                & :global(a) {
                  color: $white;
                  display: block;
                  text-decoration: none;
                }
              }
            }

            & .container {
              position: relative;
              flex: 1;
              background: $gloabl-background;
              flex-wrap: nowrap;
              overflow: hidden;

              & > header {
                height: 64px;
                line-height: 64px;
                padding: 0 40px;
                background: $white;
                box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

                & .info {
                  position: absolute;
                  right: 40px;
                  top: 0px;
  
                  & span {
                    margin-left: 6px;
                  }
                }
              }

              & .main-body {
                flex: 1;
                margin-top: 10px;
                background: transparent;
                overflow: hidden;
              }
            }
          }
        `}</style>
      </div>
    )
  }
}

export default withRouter(App);