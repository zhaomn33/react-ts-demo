import React from 'react'

interface ContainerProps {
  left: React.ReactNode
  right: React.ReactNode
}

const _SideAreaLayout: React.FC<ContainerProps> = (props) => {
  return (
    <div className="shrink-below-content-size flex h-full">
      <div className="border-solid border-0 border-r overflow-y-auto border-r-[#eeecec] bg-white">{props.left}</div>
      <div className="flex-1 min-w-0 h-full overflow-y-auto">{props.right}</div>
    </div>
  )
}

interface SideAreaLayoutProps {
  /**
   * 渲染侧边栏组件
   */
  renderSide: React.ReactNode
}

/**
 * 左右布局 左sidebar 右侧内容 自定义默认 <router-view/> 布局 Layout
 */
export const SideAreaLayout: React.FC<SideAreaLayoutProps> = (props) => {

  return (
    <_SideAreaLayout
      left={props.renderSide}
      right={props.children}
    />
  )
}

