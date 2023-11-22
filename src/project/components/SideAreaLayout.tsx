import React from 'react'
import SideNavBar from './SideNavBar'

/**
 * 左右布局 左sidebar 右侧内容 自定义默认 <router-view/> 布局 Layout
 */
const SideAreaLayout: React.FC = () => {

  return (
    <div className="shrink-below-content-size flex h-full">
      <SideNavBar
        renderContent={<>render</>}
        sideProps={{
          loading: false,
          menuList: [
            {
              name: '11',
              id: '0'
            },
            {
              name: '12',
              id: '1'
            },
            {
              name: '23',
              id: '2'
            }
          ],
          defaultSelectedKey: '0'
        }}
      />
    </div>
  )
}

export default SideAreaLayout