import { io } from 'socket.io-client'
import { message } from 'antd'

// reconnecting 连接的次数
let socketAttemptsCount = 1

export default class customSocket {
  socket: any
  socketUrl: string
  query!: any
  confirm: any
  // loading: any

  constructor() {
    this.socketUrl = 'wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'
    this.query = {
      reconnectionAttempts: 4,
      // reconnectionDelay: Infinity,
      reconnectionDelayMax: Infinity,
      transports: ['websocket']
    }
    this.confirm = null
    this.socket = {}
  }

  initSocket(roomID: any) {
    this.openSocket()
    this.onConnect((...args: any[]) => {
      console.log('🚀 Socket connected')
      // this.joinRoom(roomID)
    })
    // 监听新的消息回调，第一次连接也会收到一条消息
    // this.onMessage('status', (res: any) => {
    //   const { err, msg, data } = res
    //   if (err === '1') {
    //     // 这里判断返回数据
    //   }

    //   this.actionCallback(data)
    //   console.log('🚀 Socket onMessage', data)
    // })
  }

  onConnect(callback: any = function (...args: any[]) { }) {
    // 成功
    this.socket.on('connect', (...args: []) => {
      callback(...args)
    })

    // 重试
    this.socket.on('reconnecting', (number: number) => {
      console.log(socketAttemptsCount, 'socketAttemptsCount')

      if (++socketAttemptsCount > 3) {
        number === 1 && this.closeSocket()
      }
    })

    // 尝试重连
    this.socket.on('reconnect_attempt', (number: any) => {
      console.log(number, '尝试重连')
      if (number !== this.query.reconnectionAttempts) return
      this.closeSocket()
    })
  }

  openSocket() {
    console.log('🍑openSocket')

    this.socket = io(this.socketUrl, {
      ...this.query
    })
    this.onConnect()
    console.log(this.socket, 'this.socket')
  }

  closeSocket() {
    message.error('连接已断开')
    this.disconnect()
    this.socket.close()
    console.log('😥 Socket connect failed')
  }

  disconnect() {
    console.log('🔕 Socket leave room')
    this.socket.emit('leave')
  }
}