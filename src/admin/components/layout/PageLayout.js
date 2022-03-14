import React from 'react'
import { Layout, Breadcrumb } from 'antd';

import TopNav from '../../../components/topnav/TopNav';
import SideBar from '../../../admin/components/sidebar/SideBar';
const { Header, Content, Footer} = Layout;

const PageLayout = ({title,children}) => {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <SideBar/>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0 }} >
            <TopNav/>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <b>{title ? title.toUpperCase(): ""}</b>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Project 3 - Tran Van Tuyen - QLCV</Footer>
        </Layout>
      </Layout>
    );
}

export default PageLayout;

