import { useEffect, type FC } from 'react';
import style from './ConstructorHeader.module.scss';
import { Button, Flex, Select } from 'antd';
import { BsChevronLeft, BsFillPlayFill } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@hooks/useTheme';
import { useLazyGetTriggerTypesQuery } from '@store/api/processes/processesApi';

enum triggers {
    'never' = 'Никогда',
    'periodically' = 'Периодично'
}

export const ConstructorHeader: FC<{
    processName?: string;
    isAgent?: boolean;
}> = ({
    processName,
    isAgent = false,
}) => {
    const navigate = useNavigate();
    const { isDarkMode } = useTheme();

    const [getTriggers, triggersData] = useLazyGetTriggerTypesQuery();

    useEffect(() => {
        if (isAgent) {
            getTriggers()
        }
    }, [isAgent])
    
    return (
        <Flex
            justify="space-between"
            align="center"
            className={`${style["process-bar"]} ${
                isDarkMode ? style["bar-dark"] : ""
            }`}
        >
            <Flex align="center" gap={16}>
                <Button onClick={() => navigate(-1)}>
                    <BsChevronLeft />
                </Button>
                <p>{processName}</p>
            </Flex>
            {
                isAgent && (
                    <Flex gap={12} align='center'>
                        <Flex align='center' gap={8}>
                            <p>Запускать:</p>
                            <Select 
                                style={{width: '150px'}} 
                                options={triggersData.data?.data.map(t => ({
                                    value: t.id,
                                    label: triggers[t.name as keyof typeof triggers],
                                }))}
                                placeholder="Не выбрано"
                            />
                        </Flex>
                        <Button color="green" variant="solid" title='Запустить процесс'>
                            <BsFillPlayFill size={24} />
                        </Button>
                    </Flex>
                )
            }
        </Flex>
    )
}

