import { ConfigProvider, InputNumber } from 'antd'
import { createStyles } from 'antd-style'
import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'

interface custIptType {
  label?: string
  precision?: number
  height?: number
  minvalue?: number
  value?: number | null
  placeholder?: string
  status?: 'error' | 'warning' | ''
  onChange?: (value: number | null) => void
}

const useStyle = createStyles({
  'custom-iptnumber-box': {
    width: '100%',
    '.ant-input-number-group-addon': {
      padding: 0
    }
  },
  'custom-iptnumber-container': {
    '.ant-input-number-group-addon': {
      '&:first-child': {
        cursor: 'no-drop!important',
        backgroundColor: '#f5f5f5'
      }
    }
  },
  'custom-disabled-pre': {
    cursor: 'no-drop!important',
    backgroundColor: 'rgba(0, 0, 0, 0.01)'
  },
  'label-margin-left': {
    marginLeft: '8px'
  }
})

/**
 * 自定义数字输入框，默认min=0 （小于0时，左侧按钮禁用）
 * @param props
 *  label: 描述
 *  precision: 控制小数位数
 *  height: 高度
 *  minvalue：最小值默认0
 *  value: 提供受控属性 value 或其它与 valuePropName 的值同名的属性
 *  onChange: 提供 onChange 事件或 trigger 的值同名的事件。
 * @returns
 */
const CustomInputNumber: React.FC<custIptType> = props => {
  const { styles } = useStyle()
  const [disabledStyle, setDisabledStyle] = useState(false)
  const curHeight = ((props.height ? props.height : 36) - 2) + 'px'
  const newMinValue = props.minvalue || 0
  // 阈值大小change事件
  const handleReduceNum = (type = 'reduce') => {
    const currentValue = props.value || 0
    const newValue = type === 'add' ? currentValue + 1 : currentValue - 1
    if (
      (props.minvalue !== undefined && newValue >= props.minvalue) ||
      (props.minvalue === undefined && newValue >= 0)
    ) {
      props.onChange && props.onChange(newValue)
      if (newValue > newMinValue) {
        setDisabledStyle(false)
      }
    }
    if (
      (props.minvalue !== undefined && newValue <= props.minvalue) ||
      (props.minvalue === undefined && newValue <= 0)
    ) {
      setDisabledStyle(true)
    }
  }

  useEffect(() => {
    if (props.value! <= newMinValue) {
      setDisabledStyle(true)
    }
  }, [newMinValue, props.value])

  return (
    <>
      <div className="flex items-center">
        <ConfigProvider
          theme={{
            components: {
              InputNumber: {
                controlHeight: props.height ? props.height : 36
              }
            }
          }}
        >
          {/* precision: 0 不保留小数 */}
          <InputNumber
            min={props.minvalue || 0}
            {...props}
            controls={false}
            precision={props.precision || 0}
            placeholder={ props.placeholder || '请输入' }
            status={ props.status || '' }
            className={cx({
              [styles['custom-iptnumber-box']]: true,
              [styles['custom-iptnumber-container']]: disabledStyle
            })}
            addonBefore={
              <div
                className={cx(
                  { [styles['custom-disabled-pre']]: disabledStyle },
                  'w-[30px] cursor-pointer bg-white rounded-[6px_0_0_6px] select-none'
                )}
                onClick={() => handleReduceNum()}
                style={{
                  height: curHeight,
                  lineHeight: curHeight
                }}
              >
                <MinusOutlined className='text-[#606266]'/>
              </div>
            }
            addonAfter={
              <div
                className="w-[30px] cursor-pointer bg-white rounded-[0_6px_6px_0] select-none"
                style={{
                  height: curHeight,
                  lineHeight: curHeight
                }}
                onClick={() => handleReduceNum('add')}
              >
                <PlusOutlined className='text-[#606266]'/>
              </div>
            }
          />
          <span
            className={cx({
              [styles['label-margin-left']]: props.label
            })}
          >
            {props.label}
          </span>
        </ConfigProvider>
      </div>
    </>
  )
}

export default CustomInputNumber
