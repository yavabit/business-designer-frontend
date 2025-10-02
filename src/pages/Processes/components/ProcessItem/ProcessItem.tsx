import { PrefetchButton } from "@components/PrefetchButton/PrefetchButton";
import { nodesCategoriesColor, nodesCategoriesNames } from "@data";
import { Badge, Card, Image } from "antd";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import processCardBack from "../../../../shared/assets/img/process_card_back.svg";
import processCardBackLight from "../../../../shared/assets/img/process_card_back_light.svg";
import { useTheme } from "@hooks/useTheme";
import { BsFillTrashFill } from "react-icons/bs";
import { BsFillPencilFill } from "react-icons/bs";
import type { RootState } from "@store/index";
import { useSelector } from "react-redux";
import UserAvatar from "@components/UserAvatar/UserAvatar";
import { DeleteObjectModal } from "@components/DeleteObjectModal/DeleteObjectModal";

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

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

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
        }
      >
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
              fallback={isDarkMode ? processCardBack : processCardBackLight}
            />
          }
          actions={[
            ...(userId === item.author_id
              ? [
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (handleDelete && !disabled)
                        setIsDeleteModalOpen(true)
                    }}
                  >
                    <BsFillTrashFill key="ellipsis" size={16} />
                  </div>,
                ]
              : []),
            <PrefetchButton
              prefetchImport={() =>
                import("@pages/ProcessConstructor/ProcessConstructor").then(
                  (m) => ({
                    default: m.ProcessConstructor,
                  })
                )
              }
              onClick={() => {
                if (handleDelete && !disabled)
                  navigate(`/process/${item.id}`, {
                    state: { metadata: item.project_id ?? "" },
                  });
              }}
            >
              <BsFillPencilFill key="edit" size={16} />
            </PrefetchButton>,
          ]}
          hoverable
        >
          <Meta
            avatar={<UserAvatar label={item.author_name} />}
            title={item.name}
            description={
              <p
                title={item.desc}
                style={{
                  width: "100%",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {item.desc}
              </p>
            }
          />
          <DeleteObjectModal 
            isOpen={isDeleteModalOpen}
            title={`Удалить процесс "${item.name}"?`}
            content={`Вы действительно хотите удалить процесс "${item.name}"?`}
            onOk={() => {
              if (handleDelete) {
                handleDelete(item.id)
              }
            }}
            onCancel={() => setIsDeleteModalOpen(false)}
          />
        </Card>
      </Badge.Ribbon>
    );
  }
);
