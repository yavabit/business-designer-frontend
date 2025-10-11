import useSocket from '@hooks/useSocket'
import { Flex } from 'antd';
import { useEffect, useRef, type FC } from 'react'

export const LogsModalContent: FC<{processId: string}> = ({processId}) => {
    const { emitGetAgentLogs, agentLogs } = useSocket();

    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [scrollRef.current])

    useEffect(() => {
        emitGetAgentLogs(processId);
    }, [])

    return (
        <Flex 
            ref={scrollRef}
            vertical 
            gap={10} 
            style={{
                padding: '20px', 
                background: '#000000', 
                borderRadius: '8px',
                color: '#d6d6d6ff',
                whiteSpace: 'pre-wrap',
                height: '500px',
                overflowY: 'auto'
            }}
        >
            {agentLogs.length ? agentLogs?.map(l => (
                <div 
                    key={l.id} 
                    style={{
                        fontWeight: 600, 
                        lineHeight: '24px'
                    }}
                >
                    {l.log_text}
                </div>
            )) : (
                <p 
                    style={{
                        fontWeight: 600, 
                        lineHeight: '24px'
                    }}
                >
                    Логи отсутствуют.
                </p>
            )}
            {}
        </Flex>
    )
}
