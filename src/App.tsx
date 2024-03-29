import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import {
  AppstoreOutlined,
  DesktopOutlined,
  MailOutlined,
  ContainerOutlined,
  FileTextOutlined,
  LayoutOutlined,
  ReconciliationOutlined
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import ProjectListPage from './project'
import UploadCard from './project/components/UploadCard'
import CreateModal from './project/components/CreateModal'
import SideAreaLayout from './project/components/SideAreaLayout'
import FieldConfigProTable from './project/components/FieldConfigProTable'
import RowEditProTable from './project/components/RowEditProTable'
import SocketPage from './project/components/SocketPage'
import VirtualTable from './project/components/VirtualTable'
import EditTableList from './project/components/EditTableList'
import EditableTable from './project/components/EditableTable'

const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('文件上传', 'upload', <MailOutlined />),
  getItem('表格', 'table', <AppstoreOutlined />),
  getItem('弹框', 'modal', <DesktopOutlined />),
  getItem('侧边栏Layout', 'layout', <LayoutOutlined />),
  getItem('高级可编辑表格', 'editProTable', <FileTextOutlined />),
  getItem('单行编辑表格', 'rowEditTable', <ContainerOutlined />),
  getItem('虚拟编辑表格', 'virtualTable', <ReconciliationOutlined />),
  getItem('编辑表格列表', 'editTableList', <AppstoreOutlined />),
  getItem('可编辑表格', 'editTable', <AppstoreOutlined />),
  getItem('socket', 'socket', <MailOutlined />)
]

const route:{ [key:string] :any; } = {
  'upload': <UploadCard />,
  'table': <ProjectListPage />,
  'modal': <CreateModal />,
  'layout': <SideAreaLayout />,
  'editProTable': <FieldConfigProTable />,
  'rowEditTable': <RowEditProTable />,
  'virtualTable': <VirtualTable />,
  'editTableList': <EditTableList />,
  'editTable': <EditableTable />,
  'socket': <SocketPage />
}

const App: React.FC = () => {
  const [current, setCurrent] = useState('socket')
  return (
    <Layout className="h-screen w-screen">
      <Sider>
        <Menu
          className='w-[200px] h-full'
          defaultSelectedKeys={['upload']}
          mode="inline"
          items={items}
          selectedKeys={[current]}
          onClick={(e) => setCurrent(e.key)}
        />
      </Sider>
      <Content className="bg-bg-main p-10 overflow-auto">
        {route[current]}
      </Content>
      {/* <Footer style={{ textAlign: 'center' }}>
        Ant Design ©2023 Created by Ant UED
      </Footer> */}
    </Layout>
  )
}

export default App
