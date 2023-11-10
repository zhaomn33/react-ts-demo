import { createContext, useContext } from 'react'
import { type WithRouterProps } from 'react-router'

export const RouterContext = createContext<WithRouterProps>(null!)

export const useRouter = () => useContext(RouterContext)