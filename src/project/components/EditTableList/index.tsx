import { Button, Input, List, Select } from 'antd'
import React, { useState } from 'react'

interface TableRow{
  id: number
  name: string
  age: number|string
  address: string
  type: string
  options?: any
}
const EditTableList: React.FC = () => {
  const [tableList, setTableList] = useState<TableRow[]>([
    // {
    //   id: 1,
    //   name: '111111111',
    //   age: 11,
    //   address: '1111111111111111',
    //   type: 'input'
    // },
    {
      id: 1,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 2,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 3,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 4,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 5,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 6,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 7,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 8,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 9,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 10,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 11,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 12,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 13,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 14,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 15,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    },
    {
      id: 16,
      name: '111111111',
      age: 11,
      address: '1111111111111111',
      type: 'select',
      options: [{
        value: 1234,
        label: 1234
      }]
    }
  ])
  const [editable, setEditable] = useState<boolean>(true)
  interface Prop {
    row: TableRow
  }
  const RenderItemRow: React.FC<Prop> = ({ row }) => {
    console.log(row,'row')
    return editable ? (
      <div className='flex'>
        <div className='min-w-[200px] p-[10px]'>{row.id}</div>
        <Input
          className='w-full'
          placeholder='请输入'
          defaultValue={row.name}
          onBlur={(val) => {
            console.log('object',val)
            setTableList(
              tableList.map((item) => {
                if (item.id === row.id) {
                  return {
                    ...item,
                    name: val.target.value
                  }
                } else {
                  return item
                }
              })
            )
          }}
        />
        <Select
          className='w-full h-full'
          placeholder='请选择'
          defaultValue={row.age}
          options={row.options}
        />
        <Select
          className='w-full h-full'
          placeholder='请选择'
          defaultValue={row.age}
          options={row.options}
        />
        <Select
          className='w-full h-full'
          placeholder='请选择'
          defaultValue={row.age}
          options={row.options}
        />
        <div className='min-w-[200px] p-[10px]'>{row.address}</div>
      </div>
    ) : (
      <div className='flex border-1 border-solid border-[#ccc]'>
        <div className='min-w-[200px] p-[10px]'>{row.id}</div>
        <div className='min-w-[200px] p-[10px]'>{row.name}</div>
        <div className='min-w-[200px] p-[10px]'>{row.age}</div>
        <div className='min-w-[200px] p-[10px]'>{row.age}</div>
        <div className='min-w-[200px] p-[10px]'>{row.age}</div>
        <div className='min-w-[200px] p-[10px]'>{row.address}</div>
      </div>
    )
  }

  return (
    <div className='w-full'>
      <Button className='mr-4' type='primary' onClick={() => console.log(tableList,'table')}>确定</Button>
      <Button type='primary' onClick={() => setEditable(!editable)}>{!editable ? '编辑' : '取消'}</Button>
      <List
        itemLayout="horizontal"
        dataSource={tableList}
        renderItem={(item, index) => {
          return <List.Item key={index}>
            <RenderItemRow
              row={item}
            />
          </List.Item>
        }}
      />
    </div>
  )
}

export default EditTableList
