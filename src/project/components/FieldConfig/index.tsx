import React, { useState } from 'react'
import { Button, Select, Form, Modal, Divider } from 'antd'
import { CloseOutlined, EditOutlined } from '@ant-design/icons'
import { createStyles, cx } from 'antd-style'
import { EditableProTable } from '@ant-design/pro-components'
import type { ProColumns } from '@ant-design/pro-components'
import CustomInputNumber from './custom-input-number'
import FormatDialog from './formatDialog'

const useStyle = createStyles(({ css }) => ({
  'custom-table-style': css`
    .ant-select.ant-select-disabled .ant-select-selector{
      cursor: pointer;
      background-color: #fff;
      color: rgba(0, 0, 0, 0.88);
      &:hover{
        border-color: #4096ff;
      }
    }
    .ant-input-suffix{
      display: none;
    }
  `,
  'custom-add-member-modal-style': css`
      .ant-modal-confirm-paragraph{
      row-gap: 0;
      max-width: 100%;
    }
  `
}))

const defaultData = [
  {
    id: (Date.now() + 1).toString(),
    originField: 'OrderID',
    newField: '订单ID',
    fieldType: 'string',
    showType: 2,
    fieldDec: 'test',
    explain: ''
  }, {
    id: (Date.now() + 2).toString(),
    originField: 'OrderID',
    newField: '订单ID',
    fieldType: 'number',
    showType: '百万数',
    fieldDec: 'test',
    explain: ''
  }, {
    id: (Date.now() + 3).toString(),
    originField: 'OrderID',
    newField: '订单ID',
    fieldType: 'boolean',
    showType: true,
    fieldDec: 'test',
    explain: ''
  }, {
    id: (Date.now() + 4).toString(),
    originField: 'OrderID',
    newField: '订单ID',
    fieldType: 'time',
    showType: 'YYYY-MM',
    fieldDec: 'test',
    explain: ''
  }
]

type DataSourceType = {
  id: string
  originField: string
  newField: string
  fieldType: string
  showType: any
  fieldDec: string
  explain: string
}

type CellType = 'number' | 'string' | 'time' | 'boolean'

const FieldConfig: React.FC = () => {
  const { styles } = useStyle()
  const [tableData, setTableData] = useState(defaultData)
  const [editStatus, setEditStatus] = useState<any>(true)
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map(item => item.id)
  )
  const [modal, contextHolder] = Modal.useModal()

  const getData = (val:any) => {
    console.log(val,'val')
  }
  const handelFormat = (row:any) => {
    console.log(row, 'row')
    const { destroy } = modal.confirm({
      className: styles['custom-add-member-modal-style'],
      title: (
        <div className='w-full'>
          <div className="flex justify-between">
            <span className=''>显示格式设置</span>
            <CloseOutlined onClick={() => {
              destroy()
            }} />
          </div>
          <Divider className='mt-[14px] mb-0' />
        </div>
      ),
      style: { padding: 0 },
      icon: null,
      footer: null,
      content: <FormatDialog defaultSelect={row.showType} destroy={() => destroy()} getData={(val:any) => getData(val)} />
    })
  }

  function EditableCell(cellType: CellType, value: string|number, row?:any) {
    const timeOptions = [
      { value: 'YYYY',
        label: 'YYYY' },
      { value: 'YYYY-MM',
        label: 'YYYY-MM' },
      { value: 'YYYY-MM-DD',
        label: 'YYYY-MM-DD' }
    ]
    switch (cellType) {
      case 'number':
        return <Select disabled onClick={() => handelFormat(row)}/>
      case 'string':
        return <CustomInputNumber height={32} />
      case 'time':
        return <Select options={timeOptions} />
      case 'boolean':
        return <div>{value}</div>
      default:
        throw Error('wrong type')
    }
  }

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '原字段名',
      dataIndex: 'originField',
      width: '15%',
      readonly: true
    },
    {
      title: '新字段名',
      dataIndex: 'newField',
      width: '15%',
      readonly: !editStatus
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      width: '15%',
      valueType: 'select',
      request: async() => [
        {
          value: 'number',
          label: '数值'
        },
        {
          value: 'string',
          label: '字符串'
        },
        {
          value: 'boolean',
          label: '布尔值'
        },
        {
          value: 'time',
          label: '时间'
        }
      ],
      readonly: !editStatus
    },
    {
      title: '显示格式',
      dataIndex: 'showType',
      width: '15%',
      renderFormItem: (_, { record }) => {
        // console.log(record,'record')
        return !editStatus ?
          <div>{record?.showType}</div>
          : EditableCell(record?.fieldType as CellType, record?.showType as string | number, record)
      }
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDec',
      readonly: !editStatus
    },
    {
      title: '注释(数据库带入)',
      dataIndex: 'explain',
      readonly: true
    }
  ]

  const showBtn = () => {
    return editStatus ? [
      <div>
        <Button
          type="primary"
          key="save"
          className="h-[36px]"
          onClick={() => setEditStatus(false)}
        >
          保存
        </Button>
        <Button
          type="default"
          className='h-[36px] ml-[16px]'
          onClick={() => setEditStatus(false)}
        >
          取消
        </Button>
      </div>
    ] : [
      <Button
        type="primary"
        className="w-[80px] h-[36px]"
        icon={<EditOutlined />}
        onClick={() => {
          setEditStatus(true)
          console.log('编辑')
        }}
      >
        编辑
      </Button>
    ]
  }
  return (
    <div className={cx(styles['custom-table-style'])}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        scroll={{ x: 960 }}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        toolBarRender={showBtn}
        columns={columns}
        value={tableData}
        editable={{
          type: 'multiple',
          editableKeys,
          onValuesChange: (record, recordList) => {
            setTableData(recordList)
          },
          onChange: setEditableRowKeys
        }}
      />
      {contextHolder}
    </div>
  )
}

export default FieldConfig