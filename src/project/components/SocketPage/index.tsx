import React, { useEffect } from 'react'
import { Button } from 'antd'
import { io } from 'socket.io-client'

const socketUrl = 'http://10.30.0.16/ecom'
const socket = io(socketUrl, {
  transports: ['websocket'],
  reconnectionDelayMax: 2000,
  reconnectionAttempts: 3,
  autoConnect: false
})

const SocketPage = () => {

  useEffect(() => {
    // 处理从服务器接收的消息
    const socketFun = (...args: any) => {
      // 获取到信息并处理
      console.log(args, 'args')
    }
    socket.on('upload', socketFun)

    return () => {
      // 在组件卸载时断开 WebSocket 连接
      socket.disconnect()
      socket.off('upload', socketFun)
    }
  }, [])

  const handleConnect = () => {
    console.log('join')
    // socket.connect() // 和 open() 效果一样
    socket.open() // 连接 websocket
    socket.emit(
      'join',
      {
        'project_id': '6577be3a9a33244f62741721',
        'token': '02bb5056-9025-11ee-aa5d-02420c0b0406',
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
