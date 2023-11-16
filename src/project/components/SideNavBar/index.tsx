import React, { useEffect, useState, useCallback } from 'react'
import AsideSearch, { SearchProps } from './AsideSearch'
import { SideAreaLayout } from './side-area-layout'
import SideNavbar, { SideProps } from './side-navbar'

interface AsideNavLayoutProps {
  /**
   * 渲染右侧内容组件
   */
  renderContent: React.ReactNode
  sideProps: SideProps
  searchProps?: SearchProps
}

interface MenuProps {
  name: string
  id: string | number
}

/**
 * 左右布局 左侧: 上部为input框 + 添加按钮(可自定义) 右侧nav
 */
const AsideNavigation: React.FC<AsideNavLayoutProps> = (props) => {
  const [menuList, setMenuList] = useState<Array<MenuProps>>([])

  // 搜索
  const handleSearch = useCallback((val:string) => {
    // 筛选关键字
    if (!val) {
      setMenuList(props.sideProps.menuList)
    } else {
      const menuList = props.sideProps.menuList.filter((item) => item.name.indexOf(val) !== -1)
      setMenuList(menuList)
    }
  },[props.sideProps.menuList])

  useEffect(() => {
    setMenuList(props.sideProps.menuList ?? [])
  },[props.sideProps.menuList])

  return (
    <>
      <SideAreaLayout
        renderSide={
          <>
            <AsideSearch
              {...props.searchProps}
              onSearch={(val: string) => {
                handleSearch(val)
              }}
            />
            <SideNavbar
              {...props.sideProps}
              menuList={menuList}
            />
          </>
        }
      >
        {props.renderContent}
      </SideAreaLayout>
    </>
  )
}

export default AsideNavigation