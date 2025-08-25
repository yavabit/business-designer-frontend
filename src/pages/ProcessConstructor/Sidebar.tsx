import { useDnD } from "@hooks/useDnD";
import style from "./ProcessConstructor.module.scss";

const Sidebar = () => {
  const [, setType] = useDnD();

  const onDragStart = (
    event: React.DragEvent<HTMLElement>,
    nodeType: string
  ) => {
    if (!setType) return;

    setType(nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <aside style={{ marginTop: 100 }}>
      <div className={style.aside_description}>
        You can drag these nodes to the pane on the right.
      </div>
      <div
        className={[style.dndnode, style.dndnode__input].join(" ")}
        onDragStart={(event) => onDragStart(event, "input")}
        draggable
      >
        Input Node
      </div>
      <div
        className={style.dndnode}
        onDragStart={(event) => onDragStart(event, "default")}
        draggable
      >
        Default Node
      </div>
      <div
        className={[style.dndnode, style.dndnode__output].join(" ")}
        onDragStart={(event) => onDragStart(event, "output")}
        draggable
      >
        Output Node
      </div>
    </aside>
  );
};

export default Sidebar;
