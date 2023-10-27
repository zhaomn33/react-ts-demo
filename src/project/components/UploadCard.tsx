import React, { useEffect, useRef, useState } from 'react'
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

const { Dragger } = Upload

const DemoPage = () => {
  // 最大文件 2GB
  const maxFileSize = 1024 * 1024 * 1024 * 2

  const [socketId, setSocketId] = useState('')
  const [isFilelist, setIsFilelist] = useState<Array<UploadFile>>([])

  const md5List = useRef<Array<string>>([])
  const chunks = useRef<Array<Blob>>([])
  const preventUp = useRef<boolean>(false)
  const taskId = useRef<string>('')
  const [map, { set, setAll, remove, reset, get }] = useMap<File | string, File | string>([])

  const io = new customSocket()
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
      // setIsFilelist([{
      //   'uid': 'rc-upload-1698130959216-3',
      //   'percent': 70,
      //   'lastModified': 1698115979439,
      //   'lastModifiedDate': new Date(),
      //   'name': '副本list.xlsx',
      //   'size': 10169,
      //   'type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      //   'originFileObj': {
      //     'uid': 'rc-upload-1698130959216-3',
      //     'percent': null
      //   },
      //   'status': 'uploading'
      // }])
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
  const fileSlice = (file: UploadFile, LENGTH = 1024): Array<Blob> => {
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

  const statusType = {
    'error': 'exception',
    'done': 'success',
    'uploading': 'active',
    'removed': 'normal'
  }
  // 上传文件列表样式
  const DraggableUploadListItem = ({ originNode, file, fileList }: DraggableUploadListItemProps) => {
    // console.log('🍑 生成列表item')
    return (
      <div className="w-[800px] h-[68px] px-[16px] flex justify-between items-center">
        <img
          src={file.name.includes('.csv') ? icon_csv : icon_excel}
          className="w-[44px] h-[44px] border-[1px] border-dashed border-[#aaa]"
        />
        <div className="w-[663px]">
          <div className="flex justify-between">
            <span className="w-full text-[#3A86EF] text-[14px]">{file.name}</span>
            <span>{ file.percent + '%' }</span>
          </div>
          <Progress
            className="w-full m-0"
            percent={file.percent}
            status={statusType[file.status] ?? 'exception'}
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
          onClick={() => handleRemove(file,fileList)}
        />
      </div>
    )
  }
  // 删除某文件
  const handleRemove = async(file: UploadFile, fileList) => {
    const controller = new AbortController()
    setIsFilelist(isFilelist.filter(item => item.uid !== file.uid))

    // 获取整体文件的md5
    const _md5 = await getMD5(file.originFileObj as RcFile)
    if (md5List.current.indexOf(_md5) !== -1) {
      md5List.current.splice(md5List.current.indexOf(_md5 as string), 1)
    }
    controller.abort()
    // TODO: 删除文件的回调
  }

  // 文件上传钩子等
  const props: UploadProps = {
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
    onChange(info) {
      console.log('上传列表改变 🌹', isFilelist,'filelist', info.fileList)
      const { status, uid } = info.file

      console.log(map,map.size, 'map-key-🌟', !md5List.current.includes(get(uid)))
      // if (map.length ) {
      //   console.log(map.values(), 'map-value-🌟')

      // }

      // 增加判断逻辑-防止在阻止上传后仍然改变fileList，导致渲染上传列表
      if (!status || (map.size > 0 && !md5List.current.includes(get(uid)))) {
        return
      } else {
        // 文件列表改变后 state fileList
        setIsFilelist([...info.fileList])
      }

      // if (status === 'uploading') {
      //   message.warning(`${ info.file.name } file loading`)
      // } else if (status === 'done') {
      //   message.success(`${ info.file.name } file uploaded successfully.`)
      // } else if (status === 'error') {
      //   message.error(`${ info.file.name } file upload failed.`)
      // }
    },
    beforeUpload: async(file, fileList) => {
      console.log('🔥 上传之前', file,fileList)
      // 获取整体文件的md5
      const _md5 = await getMD5(file as RcFile)
      console.log(_md5, file.name, 'before--')

      // 文件大小超过2GB，请联系管理员后台上传
      // if (file.size! > maxFileSize) {
      //   preventUp.current = true
      //   message.error(`${ file.name }文件大小超过2GB，请联系管理员后台上传`)
      //   fileList = fileList.filter(item => item.uid !== file.uid)
      //   // setIsFilelist([...isFilelist,...fileList])
      //   return Promise.reject(false)
      // } else {
      //   preventUp.current = false
      //   set(file, _md5 as string)
      // }

      // console.log(get('123'),map,'get--🌟')

      // 判断文件是否已存在
      if (md5List.current.includes(_md5 as string)) {
        // preventUp.current = true
        message.error(`${ file.name }已经上传过，请勿重复上传`)

        console.log(`${ file.name }已经上传过，请勿重复上传`)

        fileList = fileList.filter(item => item.uid !== file.uid)

        console.log(fileList, 'fileList')

        return Promise.resolve(false)
      } else {
        // preventUp.current = false
        md5List.current.push(_md5 as string)
        set(file.uid, _md5 as string)
      }

      // 文件切片
      chunks.current = fileSlice(file)
      // console.log('切片完成 ✅', chunks.current)
      console.log(chunks.current, '切片完成chunks 🎁')

      // TODO: 需要获取切片ID
      // axios.post('http://172.30.34.70:10086/api/upload/file', {
      //   'project_id': '123',
      //   'file_md5': _md5,
      //   'file_name': file.name,
      //   'file_slice_cnt': chunks.current.length
      // })
      taskId.current = '222333'

    },
    customRequest: async(info: UploadRequestOption) => {
      console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀  开始上传', info)
      const controller = new AbortController()
      for (let index = 0; index < chunks.current.length; index++) {
        const file = chunks.current[index]
        const formData = new FormData()
        formData.append('project_id', taskId.current)
        formData.append('file_id', taskId.current)
        formData.append('file', file)
        formData.append('number', index + '')

        await new Promise(resolve => {
          setTimeout(() => {
            resolve(null)
          }, 1000)
        })
        // TODO: 根据后端传回的切片状态进行操作
        const res = {
          error: 0,
          data: formData
        }

        if (res.error) {
          // 当一个文件的切片有一片失败的时候取消所有的请求
          controller.abort()
          break
        } else {
          // 进度条
          const curPercent = Math.floor((100 / chunks.current.length) * (index + 1))

          // console.log(curPercent, 'cur 🍳', index)
          info.onProgress!({ percent: curPercent })
          if (curPercent >= 100) {
            info.onSuccess!({})
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
  }

  return (
    <div className="w-[800px]">
      <Dragger
        {...props}
        fileList={isFilelist}
        className="block h-fit w-fit cursor-default"
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
      </Dragger>
    </div>
  )
}

export default DemoPage
