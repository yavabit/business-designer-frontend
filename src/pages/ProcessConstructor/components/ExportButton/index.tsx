import { getViewportForBounds, useReactFlow } from "@xyflow/react";
import { Button } from "antd";
import { toSvg } from "html-to-image";
import { AiOutlineSave } from "react-icons/ai";

const imageWidth = 3840;
const imageHeight = 2160;

const ExportButton = ({ fileName }: { fileName: string | undefined }) => {
  const { getNodes, getNodesBounds } = useReactFlow();

  const downloadImage = (dataUrl: string) => {
		const date = new Date().toLocaleString().replaceAll(':', '_').replaceAll('.', '_').replace(', ', '_')


    const a = document.createElement("a");

		fileName = fileName ?? 'Без названия'
    a.setAttribute("download", `${fileName}_${date}.svg`);
    a.setAttribute("href", dataUrl);
    a.click();
  };

  const handleClickExport = () => {
    const view: HTMLElement | null = document.querySelector(
      ".react-flow__viewport"
    );

    if (view == null) return;

    const nodesBounds = getNodesBounds(getNodes());
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      { left: 0.1, top: 0.1, right: 0.1, bottom: 0.1 }
    );

    toSvg(view, {
      backgroundColor: "#1a365d",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then(downloadImage);
  };

  return (
    <Button onClick={handleClickExport}>
      <AiOutlineSave />
    </Button>
  );
};

export default ExportButton;
