import React, { useEffect, useState } from 'react'
import { Divider, Button, Input } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'
import { useDebounceFn } from 'ahooks'

export interface SearchProps {
  onSearch?: (value:any) => void
  showBtn?: boolean
  onCreate?: () => void
  searchRight?: React.ReactNode
}

const AsideSearch: React.FC<SearchProps> = ({
  onSearch,
  ...restProps
}) => {
  // 默认有添加按钮
  const [addbtn, setAddbtn] = useState<boolean>(true)

  useEffect(() => {
    setAddbtn(restProps.showBtn ?? addbtn)
  }, [addbtn, restProps.showBtn])

  // input防抖
  const { run: runSearch } = useDebounceFn(
    (val: string) => {
      console.log(val,'value')
      onSearch?.(val)
    },
    { wait: 300 }
  )

  return (
    <>
      <div className="px-[16px] py-[12px] flex">
        <Input
          className='w-full h-[36px]'
          prefix={<SearchOutlined />}
          placeholder="请输入关键字"
          onChange={(e) => {
            runSearch(e.target.value)
          }}
        />
        {
          // 若传入自定义右侧内容，则不显示此按钮
          !restProps.searchRight ?
            <Button
              className={addbtn ? 'w-[88px] h-[36px] ml-[8px]' : 'hidden'}
              type="primary"
              icon={<PlusOutlined />}
              onClick={restProps.onCreate}
            >
              添加
            </Button>
            : restProps.searchRight
        }
      </div>
      <Divider className="mt-0 !mb-[12px]" />
    </>
  )
}

export default AsideSearch