import { Provider } from 'react-redux'
import { store } from '@store/index'
import type { ReactNode } from 'react'

export const ReduxProvider = ({ children }: {children: ReactNode}) => <Provider store={store}>{children}</Provider>
