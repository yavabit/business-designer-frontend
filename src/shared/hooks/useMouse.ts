import { useEffect, useState } from "react";

export const useMouse = () => {

	const [mousePos, setMousePos] = useState({
		x: 0,
		y: 0,
	});

  const mouseMove = (event: MouseEvent) => {
    setMousePos({
      x: event.clientX,
      y: event.clientY,
    });
  };

	useEffect(() => {
		document.addEventListener("mousemove", mouseMove);
		return () => document.removeEventListener("mousemove", mouseMove);
	}, []);

	return {
		mousePos
	}
}