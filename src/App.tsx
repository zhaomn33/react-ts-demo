import React from 'react'
import { Layout, Menu } from 'antd'
import ProjectListPage from './project'
import UploadCard from './project/components/UploadCard'

const { Header, Content, Footer } = Layout

const App: React.FC = () => {
  return (
    <Layout className="h-screen w-screen">
      {/* <Header style={{ display: "flex", alignItems: "center" }}>
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          items={new Array(15).fill(null).map((_, index) => {
            const key = index + 1;
            return {
              key,
              label: `nav ${key}`,
            };
          })}
        />
      </Header> */}
      <Content className="bg-bg-main p-10">
        {/* <ProjectListPage /> */}
        <UploadCard />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  )
}

export default App
