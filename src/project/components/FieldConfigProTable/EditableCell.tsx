import React from 'react'
import { Select } from 'antd'
import { EditableFormInstance } from '@ant-design/pro-components'
import CustomInputNumber from './custom-input-number'

interface DisplayValue {
  displayFormat: any
  displayDigits: number
}
export type CellType = 'Float32' | 'String' | 'UInt8' | 'Datetime'
const timeOptions = ['YYYY', 'YYYY-MM', 'YYYY-MM-DD', 'YYYY年MM月DD日', 'YYYY-MM-DD HH-mm-ss', 'YYYY年MM月DD日 HH时mm分ss秒'].map(item => {
  return {
    value: item,
    label: item
  }
})
interface Props {
  value: DisplayValue
  type: CellType
  row?: any
  onChange?: (value: DisplayValue) => void
  handelFormat: (row: any) => void
  editableFormRef: React.MutableRefObject<EditableFormInstance | undefined>
}

export const getDisplayCellValue = (displayFormat: any, displayDigits: any) => {
  if (displayFormat || (displayDigits >= 0)) {
    const point = displayDigits > 0 ? '.' : ''
    const decimalNumber = Array(displayDigits > 0 ? (displayDigits + 1) : 0).join('0')
    const suffix = () => {
      if (displayFormat && displayFormat !== '百分比') {
        return displayFormat
      } else if (displayFormat === '百分比') {
        return '%'
      } else {
        return ''
      }
    }
    return '123' + point + decimalNumber + suffix()
  } else {
    return ''
  }
}

const EditableCell: React.FC<Props> = (props) => {
  const { value, type, row, editableFormRef, handelFormat } = props

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
          <div className={!(value.displayDigits || value.displayDigits === 0) ? 'block absolute left-[32px] bottom-[-22px] text-[#ff4d4f] z-10' : 'hidden'}>
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

export default EditableCell