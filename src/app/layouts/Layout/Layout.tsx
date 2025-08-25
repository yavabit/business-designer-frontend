import { type FC } from 'react'
import { Header } from '../Header/Header'
import { Outlet } from 'react-router-dom'
import styles from './Layout.module.scss'
import { Flex } from 'antd'
import { ProjectCreationModal } from '@components/ProjectCreationModal/ProjectCreationModal'
import { ProcessCreationModal } from '@components/ProcessCreationModal/ProcessCreationModal'
import { ProjectEditModal } from '@components/ProjectEditModal/ProjectEditModal'

export const Layout: FC = () => {
    return (
        <Flex vertical className={styles.layout}>
            <Header />
            <main className={styles['main-layout']}>
                <Outlet />
            </main>
            <ProjectCreationModal/>
            <ProcessCreationModal/>
            <ProjectEditModal />
        </Flex>
    )
}
