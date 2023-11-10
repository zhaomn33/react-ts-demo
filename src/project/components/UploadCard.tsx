import React, { useEffect, useRef, useState } from 'react'
import { createStyles } from 'antd-style'
import { message, Upload, Button, Image, Progress } from 'antd'
import { FileJpgOutlined, PullRequestOutlined, CloseCircleFilled } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'
import icon_csv from '../../assets/icon_csv.svg'
import icon_excel from '../../assets/icon_excel.svg'
import icon_upload_default from '../../assets/icon_upload_default.svg'
import './upload.scss'
import customSocket from '../data/socket.ts'
import { useWebSocket,useMap } from 'ahooks'
import SparkMD5 from 'spark-md5'
import axios from 'axios'
import type { UploadRequestOption } from 'rc-upload/lib/interface'
// import { useRouter } from '../helper/helper-router.ts'

const { Dragger } = Upload
const useStyle = createStyles(({ css }) => ({
  'custom-upload-dragger-container': css`
    .ant-upload-drag {
      width: 800px;
      height: 420px;
      border-width: 2px;
      margin-bottom: 16px;
      background-color: #fff;
      display: block;
      cursor: pointer;
      margin-top: 32px;
      &:hover {
        border: 2px dashed #3a86ef;
        background-color: #eaf2fd;
        .ant-image {
          .ant-image-img {
            filter: drop-shadow(#3a86ef 141px 0);
            transform: translateX(-141px);
          }
        }
      },
      .ant-image {
        overflow: hidden;
        margin-bottom: 16px;
        border: 1px dashed #aaa;
      },
      .ant-upload-btn {
        .ant-upload-drag-container {
          position: relative
        }
      }
    },
    .ant-upload-list-item-container {
      margin-bottom: 8px;
      background-color: #fff;
      border: 1px solid #EAEDF2;
      border-radius: 8px;
      &:hover {
        box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.08)
      }
    }
  }`
}))

const DemoPage: React.FC = (props) => {
  const { styles } = useStyle()
  const [messageApi, messageHolder] = message.useMessage()
  // const { params } = useRouter()
  // 最大文件 2GB
  // const maxFileSize = 1024 * 1024 * 1024 * 2
  // const [socketId, setSocketId] = useState('')
  const [isFilelist, setIsFilelist] = useState<Array<UploadFileInit>>([])
  // 不需要再次添加的文件列表id
  const ignoredFiles = useRef<Array<string>>([])
  // 文件列表中存在的文件md5数组
  const md5List = useRef<Array<string>>([])
  // 删除的文件uid列表
  const removedList = useRef<Set<string>>(new Set())
  // 可以上传的uid列表
  const upUidList = useRef<Array<string>>([])
  // 文件uid-任务序列号id
  interface fileMapID {
    [key: string]: string
  }
  const file_uid_taskId = useRef<fileMapID>({})
  // 文件uid-切片集合
  interface fileMapChunk {
    [key: string]: Array<Blob>
  }
  const file_uid_chunk = useRef<fileMapChunk>({})
  // 项目ID
  // const projectID = params.groupProjectId
  const projectID = 'xxxxxxxx'

  interface UploadFileInit extends UploadFile {
    file_id?: string
  }
  // const io = new customSocket()

  // TODO: socket - ahooks
  // const { connect, disconnect } = useWebSocket(io.socketUrl, {
  //   onError: (error) => {
  //     console.log(error,'error')

  //     message.error('连接失败')
  //   },
  //   onMessage: (message,instance) => {
  //     // console.log(message, 'message', instance)
  //     // let percents = 50
  //     const aa = [
  //       {
  //         fileName: '副本list.xlsx',
  //         percent: 30
  //       }, {
  //         fileName: '客户映射表模版.xlsx',
  //         percent: 60
  //       }
  //     ]
  //     setSocketmes(aa)
  //     aa.push({
  //       fileName: '信贷明细表_年初模版.xlsx',
  //       percent: 100
  //     })

  //     console.log(socketmes, '👍 socketmes', aa)

  //     // TODO: 获取到文件上传状态的数据

  //   }
  // })
  // console.log(connect,'connect')

  // TODO: socket链接
  // useEffect(() => {
  //   // 建立socket链接
  //   console.log('建立socket链接')
  //   const io = new customSocket()
  //   console.log(io,'---io');
  //   io.openSocket()

  //   // socket链接成功的回调
  //   io.socket.on('connect', (...args: []) => {
  //     console.log(io.socket, 'io.sooooo', args, 'args');
  //     setSocketId(io.socket?.id)
  //   })

  //   io.socket.on('progress', (...args: []) => {

  //   })

  //   // TODO: 此处可以写更新上传进度的回调

  //   io.socket.on('connect_error', (error) => {
  //     console.log(error, '🔕error');
  //     // 报错则关闭连接
  //     io.closeSocket()
  //   })

  //   return () => {
  //     io.closeSocket()
  //   };
  // }, []);

  // 初始化
  useEffect(() => {
    console.log('init')
    // TODO: 初始化表格状态
    const initFileList = async() => {
      const data = {
        upload_list: [{
          file_id: 'xxx111',
          file_name: 'xxxxxx',
          finish_slices: [0, 1, 2],
          slice_cnt: 3
        }]
      }
      const error = 0
      if (!error) {
        setIsFilelist(data?.upload_list?.map((item: any) => {
          return {
            ...item,
            name: item.file_name,
            percent: Math.floor((item.finish_slices.length / item.slice_cnt) * 100)
          }
        }))
      }
    }
    initFileList()
  }, [])

  interface DraggableUploadListItemFunProps {
    download?: () => void
    preview?: () => void
    remove?: () => void
  }
  interface DraggableUploadListItemProps extends DraggableUploadListItemFunProps{
    originNode?: React.ReactElement
    file: UploadFile
    fileList?: object[]
  }

  // const handelFormat = (percent:number|undefined, successPercent:number|undefined) => {
  //   console.log(percent,successPercent,'percent,successPercent')
  //   return <div></div>
  // }

  /**
   * @description: 文件切片
   * @param {UploadFile} file 文件
   * @param {Number} LENGTH 切割大小
   * @return {Array[Blob]}
  */
  const fileSlice = (file: RcFile, LENGTH = 1024 * 1024): Array<Blob> => {
    // console.log(file,'slice-file 🔪')
    const piece = LENGTH
    const totalSize = file.size ?? 0
    let start = 0 // 每次上传的开始字节
    let end = start + piece
    const chunks = [] // 切片集合

    while (start < totalSize) {
      // 根据长度截取每次需要上传的数据
      // File对象继承自Blob对象，因此包含slice方法
      const blob = file.slice(start, end)
      chunks.push(blob)
      start = end
      end = start + piece
    }
    return chunks
  }

  // 获取文件的md5
  const getMD5 = (file: RcFile) => {
    return new Promise(resolve => {
      const spark_md5 = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      fileReader.onloadend = function(e) {
        spark_md5.append(e.target?.result as ArrayBuffer)
        const _md5 = spark_md5.end()
        resolve(_md5)
      }
      fileReader.readAsArrayBuffer(file)
    })
  }

  // 上传文件列表样式
  const DraggableUploadListItem = ({ file }: DraggableUploadListItemProps) => {
    // console.log('🍑 生成列表item')
    return (
      <div className="w-[800px] h-[68px] px-[16px] flex justify-between items-center">
        <img
          src={file.name.includes('.csv') ? icon_csv : icon_excel}
          className="w-[44px] h-[44px] border-[1px] border-dashed border-[#aaa]"
        />
        <div className="w-[fill-available] mx-[13px]">
          <div className="flex justify-between">
            <span className="w-full text-[#3A86EF] text-[14px]">{file.name}</span>
            <span>{ file.percent + '%' }</span>
          </div>
          <Progress
            className="w-full m-0"
            percent={file.percent}
            // status={statusType[file.status] ?? 'exception'}
            showInfo={false}
          />
          {/* format={handelFormat} */}
        </div>
        <CloseCircleFilled
          style={{
            fontSize: '21px',
            color: '#C4C8D1'
          }}
          className="ml-[16px] cursor-pointer"
          onClick={() => {
            if (removedList.current.has(file.uid)) {
              return
            }
            handleRemove(file)
          }}
        />
      </div>
    )
  }
  // 删除某文件
  const handleRemove = async(file: UploadFileInit) => {
    // TODO: 删除文件的回调
    // const { data } = await axios.delete(`http://10.30.0.16/api/upload/upload?project_id=${ '507f1f77bcf86cd799439011' }`
    // , {
    // project_id: '507f1f77bcf86cd799439011',
    // file_id: file_uid_task.current[file.uid]
    // }
    // )
    // console.log(data,'delete')
    console.log('删除⛰️')
    const requestData = {
      project_id: projectID,
      file_id: file?.file_id ?? file_uid_taskId.current[file.uid as string]
    }
    // 获取整体文件的md5
    // TODO: 删除文件的回调
    // const { error } = await getFilterResponse(
    //   await SharedApi.cancerUpload(requestData)
    // )
    const error = 0
    if (!error) {
      removedList.current.add(file.uid)
      messageApi.success('取消成功')
      if (!file?.file_id) {
        const _md5 = await getMD5(file.originFileObj as RcFile) as string
        const inMd5List = md5List.current.indexOf(_md5 as string)
        if (inMd5List !== -1) {
          md5List.current.splice(inMd5List, 1)
        }
      }
      setIsFilelist(isFilelist.filter(fitem => (file?.file_id ? (file?.file_id !== fitem?.file_id) : (file.uid !== fitem.uid))).map((item: any) => {
        return {
          ...item,
          name: item.name ?? item.file_name,
          percent: item.percent ?? Math.floor((item.finish_slices?.length / item.slice_cnt) * 100)
        }
      }))
      file.uid && delete file_uid_taskId.current[file.uid] && delete file_uid_chunk.current[file.uid]
    }
  }
  // 文件上传钩子等
  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    // action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    accept: '.csv, .xlsx, .jpg, .jpeg', // 可上传的文件类型
    itemRender(originNode, file, fileList) {
      // console.log('渲染 🍎 上传列表', file.percent)
      return (
        <DraggableUploadListItem
          originNode={originNode}
          file={file}
          fileList={fileList}
        />
      )
    },
    onChange: async(info) => {
      // console.log('上传列表改变 🌹', isFilelist,'filelist', info.fileList)
      const { status } = info.file
      // console.log(status,'staus')
      // 增加判断逻辑-防止在阻止上传后仍然改变fileList，导致渲染上传列表
      if (!status) {
        return
      } else {
        // 文件列表改变后 state fileList
        if (ignoredFiles.current.length > 0) {
          // 过滤出已经上传过的文件
          setIsFilelist([...info.fileList.filter(file => !ignoredFiles.current.includes(file.uid))])
          // 设置完文件列表后-从需要忽略的列表中删除此文件id，以便下次上传
          const existedFile = info.fileList.findIndex(file => ignoredFiles.current.includes(file.uid))
          existedFile > -1 && ignoredFiles.current.splice(existedFile, 1)
          // existedFile > -1 && ignoredFiles.current.splice(existedFile, 1)
        } else {
          setIsFilelist([...info.fileList])
        }
      }
      if (status === 'done' && info.file.percent === 100) {
        // TODO: 切片合并
        const requestData = {
          project_id: projectID,
          file_id: file_uid_taskId.current[info.file.uid as string]
        }
        // const { error } = await SharedApi.mergeChunks(requestData)
        const error = 0
        if (!error) {
          messageApi.success(`${ info.file.name }文件上传成功`)
        } else {
          messageApi.error(`${ info.file.name }文件合并失败`)
        }
      }
    },
    beforeUpload: async(file, fileList) => {
      console.log('🔥 上传之前', file, fileList)
      // 文件大小超过2GB，请联系管理员后台上传
      // if (file.size! > maxFileSize) {
      //   !ignoredFiles.current.includes(file.uid) && ignoredFiles.current.push(file.uid)
      //   message.error(`${ file.name }文件大小超过2GB，请联系管理员后台上传`)
      //   return Promise.reject(false)
      // }

      // 获取整体文件的md5
      const _md5 = await getMD5(file as RcFile)
      // 判断文件是否已存在
      if (md5List.current.includes(_md5 as string)) {
        // 在忽略列表中添加已经存在的文件id
        !ignoredFiles.current.includes(file.uid) && ignoredFiles.current.push(file.uid)
        messageApi.error(`${ file.name }已经上传过，请勿重复上传`)
        return Promise.reject(false)
      } else {
        md5List.current.push(_md5 as string)
      }

      // 限制一次最多上传文件个数
      upUidList.current.push(file.uid)
      if (upUidList.current.length > 2) {
        !ignoredFiles.current.includes(file.uid) && ignoredFiles.current.push(file.uid)
        md5List.current.indexOf(_md5 as string) !== -1 &&
        md5List.current.splice(md5List.current.indexOf(_md5 as string), 1)
        console.log(ignoredFiles.current,'ignoredFiles.current')
        messageApi.warning('一次最多可上传1个文件')
        return
      }

      // 文件切片
      file_uid_chunk.current[file.uid] = fileSlice(file)
      console.log('切片完成chunks 🎁', file_uid_chunk.current[file.uid], '✅')

      // TODO: 需要获取切片ID
      const requestData = {
        project_id: projectID,
        file_md5: _md5,
        file_name: file.name,
        file_slice_cnt: file_uid_chunk.current[file.uid].length
      }
      const error = 0
      const data = {
        file_id: 'xxx'
      }
      if (!error) {
        file_uid_taskId.current[file.uid] = data.file_id as string
      } else {
        // 若失败，则添加到需忽略的的文件列表中，且从md5列表删除
        !ignoredFiles.current.includes(file.uid) && ignoredFiles.current.push(file.uid)
        const inMd5List = md5List.current.indexOf(_md5 as string)
        if (inMd5List !== -1) {
          md5List.current.splice(inMd5List, 1)
        }
        return Promise.reject(error)
      }
    },
    customRequest: async(info: UploadRequestOption) => {
      console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀  开始上传', info)
      const upFile = info.file as RcFile
      const controller = new AbortController()
      // 删除已在上传列表的文件uid
      if (upUidList.current.includes(upFile.uid)) {
        upUidList.current.splice(upUidList.current.indexOf(upFile.uid), 1)
      }

      // 一片一片上传
      for (let index = 0; index < file_uid_chunk.current[upFile.uid]?.length; index++) {
        const fileChunk = file_uid_chunk.current[upFile.uid][index]
        const formData = new FormData()
        formData.append('project_id', projectID)
        formData.append('file_id', file_uid_taskId.current[upFile.uid])
        formData.append('file', fileChunk)
        formData.append('number', index + '')

        // TODO: 根据后端传回的切片状态进行操作
        // const { error } = await getFilterResponse(
        //   await SharedApi.uploadChunks(formData)
        // )
        const error = 0
        if (error) {
          // 当一个文件的切片有一片失败的时候取消所有的请求
          controller.abort()
          break
        } else {
          // 进度条
          let curPercent = Math.floor((100 / file_uid_chunk.current[upFile.uid].length) * (index + 1))
          // console.log(curPercent, 'cur 🍳', index)
          // 上传成功后-修改进度条状态
          info.onProgress!({ percent: curPercent })
          if (file_uid_chunk.current[upFile.uid].length === index + 1) {
            curPercent = 100
            info.onSuccess!({})
          }
        }
      }
      // TODO: 将切片内容传入  all - 链式 全部完成后才进行后面
      // Promise.all(
      //   chunks.current.map(async(file, index) => {
      //     // console.log(file, 'promise-file');
      //     const formData = new FormData()
      //     formData.append('project_id', taskId.current)
      //     formData.append('file_id', taskId.current)
      //     formData.append('file', file)
      //     formData.append('number', index + '')

      //     // TODO: 根据后端传回的切片状态进行操作
      //     const res = {
      //       error: 0,
      //       data: formData
      //     }

      //     if (res.error) {
      //       // 当一个文件的切片有一片失败的时候取消所有的请求
      //       controller.abort()
      //       return Promise.reject(res)
      //     } else {
      //       const curPercent = Math.floor((100 / chunks.current.length) * (index + 1))
      //       // 进度条
      //       // console.log(curPercent, 'cur 🍳')
      //       info.onProgress({ percent: Math.floor((100 / chunks.current.length) * (index + 1)) })

      //       // 上传成功后-修改进度条状态
      //       return Promise.resolve(res)
      //     }
      //   })
      // ).then(async(values: any) => {
      //   // 所有请求返回结束
      //   console.log('values-所有请求返回结束 😯 ✅')
      //   info.onSuccess('成功')

      //   // console.log(info.file,'--info.file',info.file.percent);
      //   // TODO: 切片合并

      // }).catch((error: any) => {
      //   console.log(error, '有错误状态更新')
      //   // 失败的时候应该清0，报错
      // })
    }
  }

  return (
    <div className='w-full h-full overflow-auto'>
      <div className="w-[800px] mx-[auto]">
        <Dragger
          {...uploadProps}
          fileList={isFilelist}
          className={styles['custom-upload-dragger-container']}
        >
          <Button
            icon={<PullRequestOutlined />}
            className="absolute right-[16px] top-0 bg-[#fff]"
            onClick={(e) => {
            // 阻止默认上传事件
              e.stopPropagation()
              console.log('配置数据清洗规则')
            }}
          >
          配置数据清洗规则
          </Button>
          <Image
            className="h-[98px] w-[140px]"
            src={icon_upload_default}
            preview={false}
          />
          <p className="ant-upload-text !text-[14px]">
            <a className="text-[#2C72D7] hover:text-[#2C72D7] cursor-pointer">点击</a>
          或将文件拖至此处上传
          </p>
          <p className="ant-upload-hint absolute bottom-0 left-[50%] m-0 translate-x-[-50%] !text-[12px]">
          支持文件类型：<FileJpgOutlined /> CSV 文件 ｜ <FileJpgOutlined /> Excel 文件
          </p>
          {messageHolder}
        </Dragger>
      </div>
    </div>
  )
}

export default DemoPage
