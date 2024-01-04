import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Input, Select, Table, TableProps } from 'antd'
import CustomInputNumber from '../FieldConfigProTable/custom-input-number'
import { createStyles, cx } from 'antd-style'
import { EditOutlined } from '@ant-design/icons'

const useStyle = createStyles(({ css }) => ({
  'custom-table-style': css`
    .ant-select.ant-select-disabled .ant-select-selector{
      cursor: pointer;
      background-color: #fff;
      color: rgba(0, 0, 0, 0.88);
      &:hover{
        border-color: #4096ff;
      }
      input{
        cursor: pointer;
        /* display: none; */
      }
    }
    .ant-input-suffix{
      /* display: none; */
    }
    .ant-input-number-group-wrapper{
      width: 100%;
    }
    .ant-form-item-margin-offset{
      /* display: none; */
    }
    .ant-select-clear{
      /* display: none; */
    }
  `,
  'custom-add-member-modal-style': css`
    .ant-modal-confirm-paragraph{
      row-gap: 0;
      max-width: 100%;
    }
  `
}))

type CellType = 'Float32' | 'String' | 'UInt8' | 'Datetime'

type DataSourceType = {
  id: string
  originField: string
  newField: string
  fieldType: string
  displayValue: {
    displayFormat: any
    displayDigits: number
  }
  fieldDec: string
  explain: string
}

interface EditTableProps extends TableProps<DataSourceType> {
  readonly?: boolean
}
const fieldOptions = [
  {
    value: 'Float32',
    label: '数值'
  },
  {
    value: 'String',
    label: '字符串'
  },
  {
    value: 'UInt8',
    label: '布尔值'
  },
  {
    value: 'Datetime',
    label: '时间'
  }
]

// 数值-显示格式弹框
const handelFormat = (row: any) => {
  // console.log(row, 'row')
  // const { destroy } = modal.confirm({
  //   className: styles['custom-add-member-modal-style'],
  //   title: (
  //     <div className='w-full'>
  //       <div className="flex justify-between">
  //         <span className=''>显示格式设置</span>
  //         <CloseOutlined onClick={() => {
  //           destroy()
  //         }} />
  //       </div>
  //       <Divider className='mt-[14px] mb-0' />
  //     </div>
  //   ),
  //   style: { padding: 0 },
  //   icon: null,
  //   footer: null,
  //   content: <FormatDialog
  //     defaultFormat={row.displayValue.displayFormat}
  //     defaultDigits={row.displayValue.displayDigits}
  //     rowID={row.id}
  //     destroy={() => destroy()}
  //     getDisplayValue={(val: any, rowID: string) => getDisplayValue(val, rowID)}
  //   />
  // })
}

const VirtualTable: React.FC = () => {
  const { styles } = useStyle()
  const [editStatus, setEditStatus] = useState<any>(true)

  const tblRef: Parameters<typeof Table>[0]['ref'] = React.useRef(null)
  const [tableData, setTableData] = useState<Array<DataSourceType>>()

  const getTableData = useCallback(() => {
    const defaultData: DataSourceType[] = new Array(100).fill(null).map((_, index) => (
      {
        id: (Date.now() + index).toString(),
        originField: 'OrderID1' + index,
        newField: '订单ID1',
        fieldType: Math.random() > 0.5 ? (Math.random() > 0.5 ? 'Float32' : 'UInt8') : 'string',
        displayValue: {
          displayFormat: '万',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }
    ))
    setTableData(defaultData)
  }, [])
  useEffect(() => {
    getTableData()
  }, [getTableData])

  const Columns: EditTableProps['columns'] = [
    {
      title: '原字段名',
      dataIndex: 'originField',
      width: '15%'
    },
    {
      title: '新字段名',
      dataIndex: 'newField',
      width: '15%'
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      width: '15%',
      render: (_, record) => {
        return !editStatus ? <div>{record?.fieldType}</div>
          : <Select
            className='w-full'
            defaultValue={record?.fieldType}
            onChange={(val: string) => {
              record.fieldType = val
            }}
            disabled={!editStatus}
            options={fieldOptions}
          ></Select>
      }
    },
    {
      title: '显示格式',
      dataIndex: 'displayValue',
      width: '15%',
      render: (_, record) => {
        console.log(record.fieldType,'record')
        const curData = record?.fieldType === 'String' ? record?.displayValue.displayDigits : record?.displayValue.displayFormat
        return !editStatus ? <div>{curData}</div>
          : <EditableCell
            type={record?.fieldType as CellType}
            value={{
              displayFormat: record?.displayValue.displayFormat,
              displayDigits: record?.displayValue.displayDigits as number
            }}
            row={record} />
      }
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDec',
      render: (_, record) => {
        return !editStatus ? <div>{record?.fieldDec}</div>
          : <Input
            className='w-full'
            defaultValue={record?.fieldDec}
            onChange={(e) => {
              record.fieldDec = e.target.value
            }}
            disabled={!editStatus}
          />
      }
    },
    {
      title: '注释(数据库带入)',
      dataIndex: 'explain'
    }
  ]

  interface Value {
    displayFormat: any
    displayDigits: number
  }
  function EditableCell({ value, type, row }: {
    value: Value
    type: CellType
    row?: any
    onChange?: (value:Value) => void
  }) {
    // console.log(value,type,'EditableCell')
    const timeOptions = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY年MM月DD日', 'YYYY-MM-DD HH-mm-ss', 'YYYY年MM月DD日 HH时mm分ss秒'].map(item => {
      return {
        value: item,
        label: item
      }
    })
    switch (type) {
      case 'Float32':
        return <Select
          className='w-full'
          disabled
          onClick={() => handelFormat(row)}
          value={value.displayFormat}
        />
      case 'String':
        return (
          <>
            <CustomInputNumber
              height={32}
              value={value.displayDigits}
              minvalue={-1}
              placeholder='字符数'
              status={(value.displayDigits || value.displayDigits === 0) ? '' : 'error'}
              onChange={(val) => {
                console.log(val,'String-val')
                // onChange!({
                //   ...value,
                //   displayDigits: val as number
                // })
                // editableFormRef.current?.setRowData?.(row.id, {
                //   displayValue: {
                //     displayDigits: val,
                //     displayFormat: null
                //   }
                // })
              }}
            />
            <div className={(value.displayDigits || value.displayDigits === 0) ? 'block absolute left-[32px] bottom-[-22px] text-[#ff4d4f] z-10' : 'hidden'}>
              {'字符数必填'}
            </div>
          </>
        )
      case 'Datetime':
        return <Select
          options={timeOptions}
          value={value.displayFormat}
          defaultValue={timeOptions[0]}
          allowClear
          onChange={(val) => {
            // editableFormRef.current?.setRowData?.(row.id, {
            //   displayValue: {
            //     displayDigits: -1,
            //     displayFormat: val
            //   }
            // })
          }}
        />
      case 'UInt8':
        return <div>{value.displayFormat}</div>
      default:
        return <div>{value.displayFormat}</div>
    }
  }

  return (
    <div className={cx(styles['custom-table-style'])}>
      {
        editStatus ? (
          <div>
            <Button
              type="primary"
              key="save"
              className="h-[36px]"
              onClick={() => {
                console.log(tableData, 'tabledata')
                // console.log(editableFormRef.current?.getRowsData?.(), 'all--')
                // TODO: 走保存数据的接口
                setEditStatus(false)
              }}
            >
              保存
            </Button>
            <Button
              type="default"
              className='h-[36px] ml-[16px]'
              onClick={async() => {
                // 如果不重新获取数据，在‘编辑-修改-保存-编辑-不修改-取消’ 表格数据会变成保存前的数据
                await getTableData()
                // 重置表格数据
                // form.resetFields()
                setEditStatus(false)
              }}
            >
              取消
            </Button>
          </div>
        ) : (
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
        )
      }
      <Table
        ref={tblRef}
        bordered={false}
        virtual
        columns={Columns}
        scroll={{ x: 960,
          y: 1000 }}
        rowKey="id"
        dataSource={tableData}
        pagination={false}
      />
    </div>
  )
}
export default VirtualTable