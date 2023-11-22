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
  defaultSelect: string
  decimalValue?: number
  row?: any
  destroy: ()=>void
  getShowType: (val:any, rowID: string)=>void
}
const FormatDialog: React.FC<Props> = (props) => {
  const { styles } = useStyle()
  const scaleOptions = [
    {
      label: '千数',
      value: '千数'
    },
    {
      label: '万数',
      value: '万数'
    },
    {
      label: '百万数',
      value: '百万数'
    }
  ]
  const onFinish = (values: any, row: any) => {
    console.log('Received values of form: ', values, 'row',row)
    props.getShowType(values, row.id)
    props.destroy()
  }
  return (
    <div className='px-[24px] py-[16px]'>
      <Form
        labelCol={{ span: 5 }}
        className={styles['custom-form-style']}
        initialValues={{
          scale: props.defaultSelect,
          decimal: props.decimalValue ?? 0
        }}
        onFinish={(val:any) => onFinish(val, props.row)}
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