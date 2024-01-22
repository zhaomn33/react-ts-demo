import { Divider, Input, Select } from 'antd'
import React from 'react'
import CustomInputNumber from '../FieldConfigProTable/custom-input-number'
import { createStyles, cx } from 'antd-style'
import { CloseOutlined } from '@ant-design/icons'
import FormatDialog from '../FieldConfigProTable/formatDialog'
import modal from 'antd/es/modal'

const useStyle = createStyles(({ css }) => ({
  'custom-disable-select': css`
    .ant-select-selector{
      cursor: pointer !important;
      background-color: #fff !important;
      color: rgba(0, 0, 0, 0.88) !important;
      &:hover{
        border-color: #4096ff !important;
      }
      input{
        cursor: pointer !important;
        display: none !important;
      }
    }
  `,
  'custom-add-member-modal-style': css`
    .ant-modal-confirm-paragraph{
      row-gap: 0;
      max-width: 100%;
    }
  `
}))

interface Props {
  type: string
  value: any
  row?: any
  options?: {
    value: string
    label: string
  }[]
  onChange: (value: any) => void
}
const EditableCell: React.FC<Props> = ({ type, value, options,row, onChange }) => {
  const { styles } = useStyle()

  // 数值-显示格式弹框
  const handelFormat = (row: any) => {
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
        getDisplayValue={(val: any) => {
          onChange({
            displayFormat: val.scale || null,
            displayDigits: val.decimal
          })
        }}
      />
    })
  }
  // 根据类型返回不同的组件
  switch (type) {
    case 'Select':
      return (
        <Select
          className='w-full'
          defaultValue={value}
          options={options}
          onChange={val => {
            onChange(val)
          }}
        />
      )
    case 'DisplaySelect':
      return (
        <Select
          className='w-full'
          defaultValue={value}
          options={options}
          onChange={val => {
            onChange({
              displayFormat: val,
              displayDigits: -1
            })
          }}
        />
      )
    case 'ModelSelect':
      return (
        <Select
          className={cx([styles['custom-disable-select'],'w-full'])}
          disabled
          value={value}
          onClick={() => handelFormat(row)}
        />
      )
    case 'Input':
      return (
        <Input
          className='w-full'
          defaultValue={value}
          placeholder='请输入'
          onBlur={e => {
            onChange(e.target.value)
          }}
        />
      )
    case 'Number':
      return (
        <>
          <CustomInputNumber
            height={32}
            value={value.displayDigits}
            minvalue={-1}
            placeholder='字符数'
            status={(value.displayDigits || value.displayDigits === 0) ? '' : 'error'}
            onChange={(val) => {
              onChange({
                displayDigits: val,
                displayFormat: value.displayFormat
              })
            }}
          />
        </>
      )
    case 'String':
      return <div>{value}</div>
    default:
      return <div>{String(value)}</div>
  }
}

export default EditableCell
