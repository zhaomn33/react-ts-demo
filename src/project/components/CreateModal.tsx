import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, message, Divider, Image } from 'antd'
import { createStyles } from 'antd-style'
import { SearchOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
// import { useRouter } from '../helper/helper-router'
// import { type WithRouterProps, withRouter } from 'react-router-dom'

const useStyle = createStyles(({ css }) => ({
  'custom-modal': css`
    .ant-modal-content{
      width: fit-content;
      padding: 0;
      .ant-modal-header{
        margin: 0;
      }
      .ant-image{
        width: 86px;
        height: 86px;
        border: 1px dashed #aaa;
        margin-bottom: 6px;
      }
      .custom-border{
        border: 1px solid #DEE2EA;
      }
      .custom-col-flex{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center
      }
      .custom-item-container{
        display: flex;
        .custom-item{
          cursor: pointer;
          margin-right: 37px;
          &:last-of-type{
            margin-right: 0;
          }
          &:hover{
            background-color: #EAF2FD;
            border-color: #3a86ef;
            /* @apply bg-[#EAF2FD] !border-primary; */
          }
        }
      }
    }
  `
}))

const _ModalPage: React.FC = (props) => {
  const { styles } = useStyle()
  // const { router } = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  // const handleClickItem = (title:string) => {
  //   if (title === '本地文件上传') {
  //     console.log('点击进入上传页面')
  //   } else {
  //     console.log('点击进入数据库')
  //   }
  // }

  const itemsList = [
    {
      title: '本地文件上传',
      iconSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      href: '/'
    },
    {
      title: '数据库',
      iconSrc: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      href: '/'
    }
  ]

  return (
    <div>
      <Button
        type="primary"
        className="mb-[4px] w-[fit-content]"
        onClick={showModal}
      >
        新建数据表
      </Button>
      <Modal
        title={(
          <div>
            <div className="flex justify-between pt-[14px] px-[24px]">
              <span className=''>新建数据表</span>
              <CloseOutlined onClick={handleCancel} />
            </div>
            <Divider className='mt-[14px] mb-0' />
          </div>
        )}
        className={styles['custom-modal']}
        footer={null}
        closeIcon={false}
        open={isModalOpen}
      >
        <div className='py-[36px] px-[38px] custom-item-container'>
          {
            itemsList.map((item, index) => {
              return (
                <div
                  key={index}
                  className='w-[227px] h-[180px] rounded-[8px] custom-item custom-border custom-col-flex'
                  // hover:bg-[#EAF2FD] hover:!border-[#3a86ef]
                  // onClick={() => handleClickItem(item.title)}
                  // onClick={router.push(item.href)}
                >
                  <Image
                    src={item.iconSrc}
                    preview={false}
                  />
                  <span className='text-[16px] text-[#303133]'>{ item.title }</span>
                </div>
              )
            })
          }
        </div>
      </Modal>
    </div>
  )
}

// const ModalPage = withRouter(_ModalPage)

export default _ModalPage