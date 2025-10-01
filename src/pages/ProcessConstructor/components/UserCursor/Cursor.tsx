import stringToHslColor from "@shared/utils/stringToHslColor";
import { useEffect, useState } from "react";

interface ICursorProps {
  x: number;
  y: number;
  label: string;
}

interface ICursorSvgProps {
  color: string;
  size: number;
}

function CursorSvg({ color, size }: ICursorSvgProps) {
  return (
    <svg width={size} height={size} viewBox={`0 0 16 16`} fill="none">
      <path
        fill={color}
        d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
      />
    </svg>
  );
}
const Cursor = ({ x, y, label }: ICursorProps) => {
  const userColor = stringToHslColor(label);
  const [isHidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);

    const clearId = setTimeout(() => {
      setHidden(true);
    }, 100000);

    return () => {
      clearTimeout(clearId);
    };
  }, [x, y]);

  return (
    <span
      style={{
        display: isHidden ? "none" : "",
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${x}px, ${y}px)`,
        transition: "transform 120ms linear",
        color: "black",
        zIndex: 1001,
      }}
    >
      <CursorSvg size={18} color={userColor} />
      <span
        style={{
          position: "relative",
          background: userColor,
          borderRadius: "20px",
          padding: "5px 10px",
          top: 11,
          right: 7,
          fontSize: 14,
        }}
      >
        {label}
      </span>
    </span>
  );
};

export default Cursor;
