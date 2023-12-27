import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Select, Modal, Divider, Form, Input } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { createStyles, cx } from 'antd-style'
import { EditableProTable } from '@ant-design/pro-components'
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-components'
import CustomInputNumber from '../FieldConfig/custom-input-number'
import FormatDialog from '../FieldConfig/formatDialog'

const useStyle = createStyles(({ css }) => ({
  'custom-table-style': css`
    tr.ant-table-row:hover{
      cursor: pointer;
    }
    .ant-select.ant-select-disabled .ant-select-selector{
      cursor: pointer;
      background-color: #fff;
      color: rgba(0, 0, 0, 0.88);
      &:hover{
        border-color: #4096ff;
      }
      input{
        cursor: pointer;
        display: none;
      }
    }
    .ant-input-suffix{
      display: none;
    }
    .ant-input-number-group-wrapper{
      width: 100%;
    }
    .ant-form-item-margin-offset{
      display: none;
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

type CellType = 'Float32' | 'String' | 'UInt8' | 'Datetime'
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
const fieldValue: {
  [key: string]: string
} = {
  'Float32': '数值',
  'String': '字符串',
  'UInt8': '布尔值',
  'Datetime': '时间'
}

const EditableTable: React.FC = () => {
  const { styles } = useStyle()
  const [form] = Form.useForm()
  const editableFormRef = useRef<EditableFormInstance>()
  const [showloading, setShowloading] = useState(false)
  const [tableData, setTableData] = useState<Array<DataSourceType>>()
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()
  const [modal, contextHolder] = Modal.useModal()
  const [editableId, setEditableId] = useState(null)

  const getTableData = useCallback(() => {
    setShowloading(true)
    const defaultData: DataSourceType[] = [
      {
        id: (Date.now() + 1).toString(),
        originField: 'OrderID1',
        newField: '订单ID1',
        fieldType: 'Float32',
        displayValue: {
          displayFormat: '万',
          displayDigits: 3
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 2).toString(),
        originField: 'OrderID2',
        newField: '订单ID2',
        fieldType: 'String',
        displayValue: {
          displayFormat: null,
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 3).toString(),
        originField: 'OrderID3',
        newField: '订单ID3',
        fieldType: 'UInt8',
        displayValue: {
          displayFormat: null,
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 4).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 444).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 432).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 41).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: '',
        displayValue: {
          displayFormat: '',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 42).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 4332).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 11).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: '',
        displayValue: {
          displayFormat: '',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 22).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }, {
        id: (Date.now() + 33).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      }
    ]
    setTableData(defaultData)
    setEditableRowKeys(() => defaultData.map(item => item.id))
    setShowloading(false)
  }, [])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 显示格式数据
  const getDisplayValue = (val: any, rowID: string) => {
    console.log(val, 'getDisplayValue')
    editableFormRef.current?.setRowData?.(rowID, {
      displayValue: {
        displayDigits: val.decimal,
        displayFormat: val.scale
      }
    })
  }
  // 数值-显示格式弹框
  const handelFormat = (row: any) => {
    // console.log(row, 'row')
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
      content: <FormatDialog
        defaultFormat={row.displayValue.displayFormat}
        defaultDigits={row.displayValue.displayDigits}
        rowID={row.id}
        destroy={() => destroy()}
        getDisplayValue={(val: any, rowID: string) => getDisplayValue(val, rowID)}
      />
    })
  }
  const getDisplayCellValue = (displayFormat: any, displayDigits: any) => {
    if (displayFormat) {
      const point = displayDigits > 0 ? '.' : ''
      const decimalNumber = Array(displayDigits > 0 ? (displayDigits + 1) : 0).join('0')
      const suffix = displayFormat === '百分比' ? '%' : displayFormat
      return '123' + point + decimalNumber + suffix
    } else {
      return ''
    }
  }

  interface Value {
    displayFormat: any
    displayDigits: number
  }
  function EditableCell({ value, type, row, onChange }: {
    value: Value
    type: CellType
    row?: any
    onChange?: (value:Value) => void
  }) {
    const timeOptions = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY年MM月DD日', 'YYYY-MM-DD HH-mm-ss', 'YYYY年MM月DD日 HH时mm分ss秒'].map(item => {
      return {
        value: item,
        label: item
      }
    })
    switch (type) {
      case 'Float32':
        return <Select
          disabled
          onClick={() => handelFormat(row)}
          value={getDisplayCellValue(value.displayFormat,value.displayDigits)}
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
                editableFormRef.current?.setRowData?.(row.id, {
                  displayValue: {
                    displayDigits: val,
                    displayFormat: null
                  }
                })
              }}
            />
            <div className={(value.displayDigits || value.displayDigits === 0) ? 'hidden' : 'block absolute left-[32px] bottom-[-22px] text-[#ff4d4f] z-10'}>
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
            editableFormRef.current?.setRowData?.(row.id, {
              displayValue: {
                displayDigits: -1,
                displayFormat: val
              }
            })
          }}
        />
      case 'UInt8':
        return <div>{value.displayFormat}</div>
      default:
        return <div>{value.displayFormat}</div>
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
      formItemProps: {
        rules: [{
          required: true
        }]
      },
      renderFormItem: (_, { record }) => {
        return record?.id !== editableId ? <div>{record?.newField}</div>
          : <Input
            className='w-full'
            value={record.newField}
          />
      }
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      width: '15%',
      valueType: 'select',
      formItemProps: {
        rules: [{
          required: true,
          message: '请选择字段类型'
        }]
      },
      initialValue: 'Float32',
      renderFormItem: (_, { record, recordKey }) => {
        return record?.id !== editableId ? <div>{fieldValue[record?.fieldType as string]}</div>
          : <Select
            className='w-full'
            allowClear
            options={fieldOptions}
            onChange={
              () => {
                console.log('重置', recordKey, editableFormRef.current)
                // 每次选中重置参数
                editableFormRef.current?.setRowData?.(record.id, {
                  displayValue: {
                    displayDigits: -1,
                    displayFormat: null
                  }
                })
              }
            }
          />
      }
    },
    {
      title: '显示格式',
      dataIndex: 'displayValue',
      width: '15%',
      renderFormItem: (_, { record }) => {
        const { displayFormat, displayDigits } = record?.displayValue || {
          displayDigits: -1,
          displayFormat: null
        }
        const curData: { [key: string]: string|number; } = {
          'Float32': getDisplayCellValue(displayFormat, displayDigits),
          'String': displayDigits,
          'UInt8': displayFormat,
          'Datetime': displayFormat,
          undefined: displayFormat
        }
        return record?.id !== editableId ? <div>{curData[record?.fieldType as string]}</div>
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
      renderFormItem: (_, { record }) => {
        return record?.id !== editableId ? <div>{record?.fieldDec}</div>
          : <Input
            className='w-full'
            value={record.fieldDec}
          />
      }
    },
    {
      title: '注释(数据库带入)',
      dataIndex: 'explain',
      readonly: true
    }
  ]

  const onRowClick = (record:any) => {
    // 处理整行点击事件
    console.log('Row clicked:', record)
    setEditableId(record.id)
  }

  const showBtn = () => {
    // return editStatus ? [
    return [
      <div>
        <Button
          type="primary"
          key="save"
          className="h-[36px]"
          onClick={() => {
          // console.log(tableData, 'tabledata')
            console.log(editableFormRef.current?.getRowsData?.(), 'all--tableData')
            // TODO: 走保存数据的接口
            setEditableId(null)
          }}
        >
          保存
        </Button>
        <Button
          type="default"
          className='h-[36px] ml-[16px]'
          onClick={async() => {
          // 如果不重新获取数据，在‘编辑-修改-保存-编辑-不修改-取消’ 表格数据会变成保存前的数据
            // await getTableData()
            // 重置表格数据
            form.resetFields()
            setEditableId(null)
          }}
        >
          取消
        </Button>
      </div>
    ]
    // ] : [
    //   <Button
    //     type="primary"
    //     className="w-[80px] h-[36px]"
    //     icon={<EditOutlined />}
    //     onClick={() => {
    //       setEditStatus(true)
    //       console.log('编辑')
    //     }}
    //   >
    //     编辑
    //   </Button>
    // ]
  }
  return (
    <div className={cx(styles['custom-table-style'])}>
      <EditableProTable<DataSourceType>
        rowKey="id"
        scroll={{ x: 960 }}
        // 关闭默认的新建按钮
        recordCreatorProps={false}
        loading={showloading}
        editableFormRef={editableFormRef}
        toolBarRender={showBtn}
        columns={columns}
        value={tableData}
        controlled
        editable={{
          form,
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys
          // onValuesChange: (record, recordList) => {
          // console.log(record, recordList,'record, recordList')
          // setTableData(recordList)
          // }
        }}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record)
          }
        })}
      />
      {contextHolder}
    </div>
  )
}

export default EditableTable