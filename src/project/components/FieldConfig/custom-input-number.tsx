import { ConfigProvider, InputNumber } from 'antd'
import { createStyles } from 'antd-style'
import React, { useState } from 'react'
import cx from 'classnames'

interface custIptType {
  label?: string
  precision?: number
  height?: number
  minValue?: number
  value?: number | null
  onChange?: (value: number | null) => void
}

const useStyle = createStyles({
  'custom-iptnumber-box': {
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
    cursor: 'no-drop!important'
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
 *  minValue：最小值
 *  value: 提供受控属性 value 或其它与 valuePropName 的值同名的属性
 *  onChange: 提供 onChange 事件或 trigger 的值同名的事件。
 * @returns
 */
const CustomInputNumber: React.FC<custIptType> = props => {
  const { styles } = useStyle()
  const [disabledStyle, setDisabledStyle] = useState(false)
  const curHeight = ((props.height ? props.height : 36) - 2) + 'px'
  // 阈值大小change事件
  const handleReduceNum = (type = 'reduce') => {
    const currentValue = props.value || 0
    const newValue = type === 'add' ? currentValue + 1 : currentValue - 1
    if (
      (props.minValue !== undefined && newValue >= props.minValue) ||
      (props.minValue === undefined && newValue >= 0)
    ) {
      props.onChange && props.onChange(newValue)
      if (newValue > 0) {
        setDisabledStyle(false)
      }
    }
    if (
      (props.minValue !== undefined && newValue <= props.minValue) ||
      (props.minValue === undefined && newValue <= 0)
    ) {
      setDisabledStyle(true)
    }
  }

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
            min={props.minValue || 0}
            {...props}
            controls={false}
            precision={props.precision || 0}
            placeholder="请输入"
            className={cx({
              [styles['custom-iptnumber-box']]: true,
              [styles['custom-iptnumber-container']]: disabledStyle
            })}
            addonBefore={
              <div
                className={cx(
                  { [styles['custom-disabled-pre']]: disabledStyle },
                  'w-[28px] cursor-pointer select-none'
                )}
                onClick={() => handleReduceNum()}
                style={{
                  height: curHeight,
                  lineHeight: curHeight
                }}
              >
                -
              </div>
            }
            addonAfter={
              <div
                className="w-[28px] cursor-pointer select-none"
                style={{
                  height: curHeight,
                  lineHeight: curHeight
                }}
                onClick={() => handleReduceNum('add')}
              >
                +
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
