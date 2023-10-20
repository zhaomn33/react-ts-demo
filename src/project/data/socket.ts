import { io } from 'socket.io-client'


export default class customSocket {
  socket: any
  socketUrl: string
  query!: any
  confirm: any
  // loading: any

  constructor() {
    this.socketUrl = 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
    this.query = {
      reconnectionAttempts: 4,
      // reconnectionDelay: Infinity,
      reconnectionDelayMax: Infinity,
      transports: ['websocket']
    }
    this.confirm = null
    this.socket = {}
  }

  openSocket() {
    console.log(this.socketUrl,'sockect url')
    this.socket = io(this.socketUrl, {
      ...this.query
    })
    console.log(this.socket, 'this.socket');
    
  }


}