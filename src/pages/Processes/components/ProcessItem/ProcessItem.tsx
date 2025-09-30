import { PrefetchButton } from "@components/PrefetchButton/PrefetchButton";
import { nodesCategoriesColor, nodesCategoriesNames } from "@data";
import { Avatar, Badge, Card, Image, Modal } from "antd";
import { memo } from "react";
import { useNavigate } from "react-router-dom";
import processCardBack from "../../../../shared/assets/img/process_card_back.svg";
import processCardBackLight from "../../../../shared/assets/img/process_card_back_light.svg";
import { useTheme } from "@hooks/useTheme";
import { BsFillTrashFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import type { RootState } from "@store/index";
import { useSelector } from "react-redux";
import stringToHslColor from "@shared/utils/stringToHslColor";
import getInitials from "@shared/utils/getInitials";

const { Meta } = Card;

type ProcessItemProps = {
    item: IProcess;
    isLoading: boolean;
    handleDelete?: (id: string) => Promise<void>;
    disabled?: boolean;
};


export const ProcessItem = memo(
    ({ item, isLoading, handleDelete, disabled = false }: ProcessItemProps) => {
        const navigate = useNavigate();
        const userId = useSelector((state: RootState) => state.user.id);

        const { isDarkMode } = useTheme();


        return (
            <Badge.Ribbon
                text={
                    nodesCategoriesNames[
                        item.category as keyof typeof nodesCategoriesNames
                    ] ?? "Категория"
                }
                color={
                    nodesCategoriesColor[
                        item.category as keyof typeof nodesCategoriesNames
                    ] ?? "#1668dc"
                }>
                <Card
                    key={item.id}
                    style={{ 
						overflow: "hidden", 
						width: 300, 
					}}
                    loading={isLoading}
                    cover={
                        <Image
                            alt="Изображение процесса"
                            height={300}
                            width={300}
                            src={import.meta.env.VITE_API_HOST + item.pict_url}
                            fallback={
                                isDarkMode
                                    ? processCardBack
                                    : processCardBackLight
                            }
                        />
                    }
                    actions={[
                        ...(userId === item.author_id ? [<div
                            onClick={(e) => {
                                e.stopPropagation();
                                if(handleDelete && !disabled)

                                    Modal.confirm({
                                        title: 'Удалить',
                                        content: 'Вы действительно хотите удалить процесс?',
                                        cancelText: 'Отменить',
                                        okText: 'Удалить',
                                        onOk: () => {
                                            handleDelete(item.id);
                                        },
                                        footer: (_, { OkBtn, CancelBtn }) => (
                                        <>
                                            <CancelBtn />
                                            <OkBtn />
                                        </>
                                        ),
                                });
                            }}>
								<BsFillTrashFill key="ellipsis" size={16}/>
                        </div>] : []),
                        <PrefetchButton
                            prefetchImport={() =>
                                import(
                                    "@pages/ProcessConstructor/ProcessConstructor"
                                ).then((m) => ({
                                    default: m.ProcessConstructor,
                                }))
                            }
                            onClick={() => {
                                if(handleDelete && !disabled)
                                    navigate(`/process/${item.id}`, {
                                        state: { metadata: item.project_id ?? "" },
                                    })
                                }
                            }>
                            <BsFillPencilFill key="edit" size={16} />
                        </PrefetchButton>,
                    ]}
                    hoverable>
                    <Meta
                        avatar={
                            <Avatar
                                style={{
                                    backgroundColor: stringToHslColor(item.author_name),
                                    color: "#fff",
                                }}>
                                {item.author_name && getInitials(item.author_name)}
                            </Avatar>
                        }
                        title={item.name}
                        description={
							<p
								title={item.desc}
								style={{
									width: '100%',
									whiteSpace: 'nowrap',
									textOverflow: 'ellipsis',
									overflow: 'hidden',
								}}
							>
								{item.desc}
							</p>
						}
                    />
                </Card>
            </Badge.Ribbon>
        );
    }
);
