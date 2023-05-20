import axios from 'axios'

export const api = axios.create({
  baseURL:
    'http://192.168.2.198:3333' /* se eu estiver no MAC IOS, funciona o localhost, mas no Android o localhost não é exergado para fora do Android, então vamos utilizar o endereço da máquina */,
})
