import React, { useCallback, useEffect, useState } from 'react'
import { Button, Form, Table } from 'antd'
import EditableCell from './EditableCell'
import { getDisplayCellValue } from '../FieldConfigProTable/EditableCell'
import { createStyles } from 'antd-style'
import { EditOutlined } from '@ant-design/icons'

const useStyle = createStyles(({ css }) => ({
  'custom-table-style': css`
    .ant-table-row .ant-table-cell{
      padding: 0 16px;
      height: 46px;
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
const timeOptions = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY年MM月DD日', 'YYYY-MM-DD HH-mm-ss', 'YYYY年MM月DD日 HH时mm分ss秒'].map(item => {
  return {
    value: item,
    label: item
  }
})

const EditableTable = () => {
  const { styles } = useStyle()
  const [form] = Form.useForm()
  const [data, setData] = useState<Array<DataSourceType>>()
  const [edit, setEdit] = useState(false)

  const getTableData = useCallback(() => {
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
        explain: '-'
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
        explain: '-'
      }, {
        id: (Date.now() + 5).toString(),
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
        id: (Date.now() + 6).toString(),
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
        id: (Date.now() + 7).toString(),
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
        id: (Date.now() + 8).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: '-'
      }, {
        id: (Date.now() + 9).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: ''
      },{
        id: (Date.now() + 11).toString(),
        originField: 'OrderID1',
        newField: '订单ID1',
        fieldType: 'Float32',
        displayValue: {
          displayFormat: '万',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: '-'
      }, {
        id: (Date.now() + 12).toString(),
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
        id: (Date.now() + 13).toString(),
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
        id: (Date.now() + 14).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: '-'
      }, {
        id: (Date.now() + 15).toString(),
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
        id: (Date.now() + 16).toString(),
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
        id: (Date.now() + 17).toString(),
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
        id: (Date.now() + 18).toString(),
        originField: 'OrderID4',
        newField: '订单ID4',
        fieldType: 'Datetime',
        displayValue: {
          displayFormat: 'YYYY',
          displayDigits: -1
        },
        fieldDec: 'test',
        explain: '-'
      }, {
        id: (Date.now() + 19).toString(),
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
    setData(defaultData?.map((item) => {
      return {
        ...item,
        key: item.id
      }
    }))
  }, [])
  useEffect(() => {
    getTableData()
  }, [getTableData])

  const columns = [
    {
      title: '原字段名',
      dataIndex: 'originField',
      width: '15%',
      render: (_: any, record: DataSourceType) => {
        return (
          <span>{record.originField}</span>
        )
      }
    },
    {
      title: '新字段名',
      dataIndex: 'newField',
      width: '15%',
      render: (_: any, record: DataSourceType) => {
        return edit ? (
          <EditableCell
            type='Input'
            value={record.newField}
            onChange={(val) => {
              console.log('newField', val)
              setData((data) => {
                return data?.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      newField: val
                    }
                  }
                  return item
                })
              })
            }}
          />
        ) : (
          <span>{record.newField}</span>
        )
      }
    },
    {
      title: '字段类型',
      dataIndex: 'fieldType',
      width: '15%',
      render: (_: any, record: DataSourceType) => {
        return edit ? (
          <EditableCell
            type='Select'
            value={record.fieldType}
            options={fieldOptions}
            onChange={(val) => {
              setData((data) => {
                return data?.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      fieldType: val,
                      displayValue: {
                        displayFormat: null,
                        displayDigits: -1
                      }
                    }
                  }
                  return item
                })
              })
            }}
          />
        ) : (
          <span>{fieldOptions.filter(item => item.value === record.fieldType)[0]?.label}</span>
        )
      }
    },
    {
      title: '显示格式',
      dataIndex: 'displayValue',
      width: '15%',
      render: (_: any, record: DataSourceType) => {
        const { displayFormat, displayDigits } = record?.displayValue || {
          displayDigits: -1,
          displayFormat: null
        }
        const curData: { [key: string]: {
          type: string
          data: any
          options?: { value: string; label: string; }[]
          row?: DataSourceType
        }} = {
          'Float32': {
            type: 'ModelSelect',
            data: getDisplayCellValue(displayFormat, displayDigits)
          },
          'String': {
            type: 'Number',
            data: record?.displayValue
          },
          'UInt8': {
            type: 'String',
            data: displayFormat
          },
          'Datetime': {
            type: 'DisplaySelect',
            data: displayFormat,
            options: timeOptions
          }
        }
        return edit ? (
          <EditableCell
            type={curData[record.fieldType].type}
            value={curData[record.fieldType].data}
            options={curData[record.fieldType]?.options}
            row={record}
            onChange={(val) => {
              console.log('displayValue',val)
              setData((data) => {
                return data?.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      displayValue: {
                        displayFormat: val.displayFormat,
                        displayDigits: val.displayDigits
                      }
                    }
                  }
                  return item
                })
              })
            }}
          />
        ) : (
          <span>{record.fieldType === 'String' ? displayDigits : curData[record.fieldType].data}</span>
        )
      }
    },
    {
      title: '字段描述',
      dataIndex: 'fieldDec',
      width: '15%',
      render: (_: any, record: DataSourceType) => {
        return edit ? (
          <EditableCell
            type='Input'
            value={record.fieldDec}
            onChange={(val) => {
              setData((data) => {
                return data?.map((item) => {
                  if (item.id === record.id) {
                    return {
                      ...item,
                      fieldDec: val
                    }
                  }
                  return item
                })
              })
            }}
          />
        ) : (
          <span>{record.fieldDec}</span>
        )
      }
    },
    {
      title: '注释(数据库带入)',
      dataIndex: 'explain',
      render: (_: any, record: DataSourceType) => {
        return (
          <span>{record.explain}</span>
        )
      }
    }
  ]
  const ShowBtn = () => {
    return edit ? (
      <div>
        <Button
          type="primary"
          className="h-[36px]"
          onClick={() => {
            console.log(data, 'tabledata')
            setEdit(false)
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
            setEdit(false)
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
          setEdit(true)
          console.log('编辑')
        }}
      >
        编辑
      </Button>
    )
  }
  return (
    <Form form={form} component={false}>
      <div className='float-right mb-[16px]'>
        <ShowBtn />
      </div>
      <Table
        className={styles['custom-table-style']}
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    </Form>
  )
}

export default EditableTable