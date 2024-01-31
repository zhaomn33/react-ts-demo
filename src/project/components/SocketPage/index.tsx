import React, { useCallback, useEffect } from 'react'
import { Button } from 'antd'
import { io } from 'socket.io-client'

const socketUrl = 'http://172.20.111.67/ecom'
const socket = io(socketUrl, {
  transports: ['websocket'],
  reconnectionDelayMax: 2000,
  reconnectionAttempts: 3,
  autoConnect: false
})

const SocketPage = () => {

  // 处理从服务器接收的消息
  const socketFun = useCallback((...args: any) => {
    // 获取到信息并处理
    console.log(args, 'args')
  }, [])

  useEffect(() => {
    // socket.on('upload', socketFun)

    return () => {
      // 在组件卸载时断开 WebSocket 连接
      socket.disconnect()
      socket.off('upload', socketFun)
    }
  }, [socketFun])

  // 控制台-网络-WS-查看socket信息
  const handleConnect = () => {
    console.log('join')
    // socket.connect() // 和 open() 效果一样
    // 连接 websocket
    socket.open()
    // 处理从服务器接收的消息
    socket.on('upload', socketFun)
    // 加入 websocket 房间
    socket.emit(
      'join',
      {
        'project_id': '6588f345c8456e5171b50580',
        'token': '9a26f932-bf45-11ee-9166-02420c0b0506',
        'event_type': 'upload'
      }
    )
  }

  return (
    <>
      <Button type='primary' onClick={handleConnect}>连接</Button>
    </>
  )
}

export default SocketPage
