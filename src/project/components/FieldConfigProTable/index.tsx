import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Modal, Divider, Form } from 'antd'
import { CloseOutlined, EditOutlined } from '@ant-design/icons'
import { createStyles, cx } from 'antd-style'
import { EditableProTable } from '@ant-design/pro-components'
import type { EditableFormInstance, ProColumns } from '@ant-design/pro-components'
import FormatDialog from './formatDialog'
import EditableCell, { getDisplayCellValue, CellType } from './EditableCell'

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

const FieldConfigProTable: React.FC = () => {
  const { styles } = useStyle()
  const [form] = Form.useForm()
  const editableFormRef = useRef<EditableFormInstance>()
  const [showloading, setShowloading] = useState(false)
  const [tableData, setTableData] = useState<Array<DataSourceType>>()
  const [editStatus, setEditStatus] = useState<any>(true)
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>()
  const [modal, contextHolder] = Modal.useModal()

  const getTableData = useCallback(() => {
    setShowloading(true)
    // setTimeout(() => {
    const defaultData: DataSourceType[] = [
      {
        id: (Date.now() + 1).toString(),
        originField: 'OrderID1',
        newField: '订单ID1',
        fieldType: 'Float32',
        displayValue: {
          displayFormat: '万',
          displayDigits: -1
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
      }
    ]
    // editStatus === false && editableFormRef.current?.setRowData?.(index, {
    //   newField: item.new_name,
    //   fieldType: item.data_type,
    //   displayValue: {
    //     displayFormat: item.display_format,
    //     displayDigits: item.display_digits
    //   },
    //   fieldDec: item.description
    // })
    setTableData(defaultData)
    setEditableRowKeys(() => defaultData.map(item => item.id))
    setShowloading(false)
    // }, 200)
  }, [])

  useEffect(() => {
    getTableData()
  }, [getTableData])

  // 显示格式数据
  const getDisplayValue = (val: any, rowID: string) => {
    console.log(val, '00val00')
    editableFormRef.current?.setRowData?.(rowID, {
      displayValue: {
        displayDigits: val.decimal,
        displayFormat: val.scale
      }
    })

    // TODO: 获取弹框数据后，修改表格内数据
    // const newData = tableData?.map((row: DataSourceType) => {
    //   if (row.id === rowID) {
    //     return {
    //       ...row,
    //       displayValue: {
    //         displayFormat: val.scale,
    //         displayDigits: val.decimal
    //       }
    //     }
    //   } else {
    //     return row
    //   }
    // })
    // // console.log(newData,'newData')
    // setTableData(newData)
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
      readonly: !editStatus,
      formItemProps: {
        rules: [{
          required: true
        }]
      }
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      width: '15%',
      valueType: 'select',
      formItemProps: {
        rules: [{
          required: true
        }]
      },
      request: async() => fieldOptions,
      fieldProps: (_, { rowIndex }) => {
        return {
          onSelect: () => {
            console.log('重置',rowIndex, editableFormRef.current)
            // 每次选中重置参数
            editableFormRef.current?.setRowData?.(rowIndex, {
              displayValue: {
                displayDigits: -1,
                displayFormat: null
              }
            })
          }
        }
      },
      readonly: !editStatus
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
        return !editStatus ? <div>{curData[record?.fieldType as string]}</div>
          : <EditableCell
            type={record?.fieldType as CellType}
            value={{
              displayFormat: record?.displayValue.displayFormat,
              displayDigits: record?.displayValue.displayDigits as number
            }}
            row={record}
            editableFormRef={editableFormRef}
            handelFormat={handelFormat}
          />
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
          onClick={() => {
            // console.log(tableData, 'tabledata')
            console.log(editableFormRef.current?.getRowsData?.(), 'all--')
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
            form.resetFields()
            setEditStatus(false)
          }}
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
        loading={showloading}
        editableFormRef={editableFormRef}
        toolBarRender={showBtn}
        columns={columns}
        value={tableData}
        controlled
        // onChange={setTableData}
        editable={{
          form,
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys
          // onValuesChange: (record, recordList) => {
          //   // console.log(recordList,'recordList')
          //   console.log(record, 'record')
          //   // setTableData(recordList)
          // }
        }}
      />
      {contextHolder}
    </div>
  )
}

export default FieldConfigProTable