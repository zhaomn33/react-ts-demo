import React from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'

import {
  Button as AntdButton,
  Space,
  Menu,
  Empty,
  Popconfirm,
  Spin
} from 'antd'

import { createStyles } from 'antd-style'

export interface SideProps {
  /**
   * Loading 加载
   */
  loading: boolean
  /**
   * 菜单项列表数据
   */
  menuList: Array<{ name: string; id: string | number; }>
  /**
   * 默认选中菜单项的 key 即 id
   */
  defaultSelectedKey: string
  /**
   * 是否显示右侧控制按钮组
   */
  showMenuActions?: boolean
  /**
   * 是否显示右侧编辑按钮
   */
  showEditAction?: boolean
  /**
   * 自主渲染菜单项 Label
   */
  renderLabel?: (menuItem: any) => React.ReactNode
  /**
   * 自主渲染菜单项 Label 前缀
   */
  renderLabelPrefix?: (menuItem: any) => React.ReactNode
  /**
   * 选中菜单时的回调
   */
  onSelect?: (menuItem: any) => void
  /**
   * 点击右侧编辑按钮的回调
   */
  onEdit?: (menuItem: any) => void
  /**
   * 点击右侧删除按钮的回调
   */
  onDelete?: (menuItem: any) => void
  [key: string]: any
}

const SideNavbar: React.FC<SideProps> = ({
  showMenuActions = true,
  showEditAction = true,
  ...props
}) => {

  const useStyles = createStyles({
    '.side-navbar-menu-box': {
      '.ant-spin-nested-loading': {
        height: '100%',
        '.ant-spin-container': {
          height: '100%'
        }
      },
      '.ant-menu-root': {
        borderInlineEnd: 'none !important'
      },
      '.ant-menu-item': {
        outline: 'none !important'
      }
    }
  })
  const { styles, cx } = useStyles()

  return (
    <div
      className={
        cx(
          styles['.side-navbar-menu-box'],
          'flex flex-col h-full w-full'
        )
      }
    >
      <Spin
        spinning={props.loading}
      >
        {
          !props.menuList.length ?
            <Empty
              // style={{
              //   display: props.menuList.length ? 'none' : 'block'
              // }}
              description="暂无数据"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className="p-[32px] m-0"
            />
            :
            <Menu
            // style={{ width: '100%', borderInlineEnd: 'none' }}
              // style={{
              //   display: !props.menuList.length ? 'none' : 'block'
              // }}
              rootClassName="w-full h-full"
              mode="vertical"
              selectedKeys={[props.defaultSelectedKey]}
              defaultSelectedKeys={[props.defaultSelectedKey]}
              onClick={(menuItem) => {
                props?.onSelect?.(menuItem)
              }}
              items={
                props.menuList.map(
                  menuItem => ({
                    className: 'group/item !mx-[10px] !w-auto',
                    label: (
                      props.renderLabel
                        ?
                        props.renderLabel(menuItem)
                        :
                        <div className="flex justify-between items-center">
                          {/* 左侧 label */}
                          <span className="flex items-center min-w-0 flex-1">
                            {
                              props.renderLabelPrefix &&
                            <span className="flex items-center pr-[9px]">
                              {props.renderLabelPrefix(menuItem)}
                            </span>
                            }
                            <span
                              title={menuItem.name}
                              className="flex-1 min-w-0 text-ellipsis overflow-hidden"
                            >{menuItem.name}</span>
                          </span>
                          {/* 右侧按钮组 */}
                          {
                            showMenuActions &&
                          <Space.Compact
                            className="invisible group-hover/item:visible"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                            }}
                          >
                            {/* 编辑按钮 */}
                            {
                              showEditAction &&
                              <AntdButton
                                type="dashed"
                                icon={<EditOutlined />}
                                onClick={
                                  () => {
                                    props?.onEdit?.(menuItem)
                                  }
                                }
                              />
                            }

                            {/* 删除按钮 */}
                            <Popconfirm
                              title="提示"
                              description={`确认删除"${ menuItem.name }"?`}
                              okText="删除"
                              cancelText="我再想想"
                              onConfirm={async() => {
                                props?.onDelete?.(menuItem)
                              }}
                              okButtonProps={{ danger: true }}
                            >
                              <AntdButton
                                type="dashed"
                                className="group-active/item:visible"
                                icon={<DeleteOutlined />}
                              />
                            </Popconfirm>

                          </Space.Compact>
                          }
                        </div>
                    ),
                    key: String(menuItem.id)
                  })
                )
              }
            />
        }
      </Spin>
    </div>
  )
}

export default SideNavbar