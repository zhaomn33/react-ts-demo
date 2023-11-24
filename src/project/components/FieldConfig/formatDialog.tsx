import React from 'react'
import { Button, Form, Select } from 'antd'
import { createStyles } from 'antd-style'
import CustomInputNumber from './custom-input-number'

const useStyle = createStyles(({ css }) => ({
  'custom-form-style': css`
    .ant-input-number-group-wrapper{
      width: 100%;
    }
  `
}))

interface Props {
  defaultFormat: string
  defaultDigits?: number
  rowID?: any
  destroy: ()=>void
  getDisplayValue: (val:any, rowID: string)=>void
}
const FormatDialog: React.FC<Props> = (props) => {
  const { styles } = useStyle()
  const scaleOptions = [
    {
      label: '千',
      value: '千'
    },
    {
      label: '万',
      value: '万'
    },
    {
      label: '百分比',
      value: '百分比'
    }
  ]
  const onFinish = (values: any, rowID: string) => {
    console.log('Received values of form: ', values)
    props.getDisplayValue(values, rowID)
    props.destroy()
  }
  return (
    <div className='px-[24px] py-[16px]'>
      <Form
        labelCol={{ span: 5 }}
        className={styles['custom-form-style']}
        initialValues={{
          scale: props.defaultFormat,
          decimal: props.defaultDigits
        }}
        onFinish={(val:any) => onFinish(val, props.rowID)}
      >
        <Form.Item label="比例" name="scale">
          <Select options={scaleOptions} />
        </Form.Item>
        <Form.Item label="小数位数" name="decimal">
          <CustomInputNumber height={32} />
        </Form.Item>
        <Form.Item className='float-right'>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
          <Button
            type="default"
            className='ml-[14px]'
            onClick={() => props.destroy()}
          >
            取消
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}
// forceRender
export default FormatDialog