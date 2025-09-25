import { motion } from "framer-motion";
import "./SnakeLine.scss";
import type { TimelineItem } from "../../../shared/data/roadmap";
import { useTheme } from "@hooks/useTheme";

interface RoadmapProps {
	items: TimelineItem[];
	rowHeight?: number;
	rowWidth?: number;
	circleRadius?: number;
	turnRadius?: number;
}

export const SnakeLine = ({
	items,
	rowHeight = 120,
	rowWidth = 800,
	circleRadius = 8,
	turnRadius = 20,
}: RoadmapProps) => {

	const {isDarkMode} = useTheme()

	const strokeWidth = 4;
	const padding = circleRadius + strokeWidth;
	const cardsPerRow = 4;
	const stepX = (rowWidth - 2 * padding) / cardsPerRow;

	// Запас для дуг и stroke
	const extra = turnRadius + strokeWidth;

	// Позиции точек (кружков)
	const positions = items.map((_, i) => {
		const row = Math.floor(i / cardsPerRow);
		const col = i % cardsPerRow;
		const x =
			row % 2 === 0
				? extra + col * stepX + stepX * 0.3
				: rowWidth - extra - col * stepX - stepX * 0.3;
		const y = extra + row * rowHeight;
		return { x, y };
	});

	// Сегмент закругления угла (горизонталь + полукруг) между двумя точками
	const generateSegment = (
		prev: { x: number; y: number },
		curr: { x: number; y: number },
		row: number
	) => {
		if (prev.y !== curr.y) {
			const sweep = row % 2 === 0 ? 0 : 1;
			return `M${prev.x},${prev.y} L${curr.x},${prev.y} A${turnRadius} ${turnRadius} 0 0 ${sweep} ${curr.x},${curr.y}`;
		} else {
			return `M${prev.x},${prev.y} L${curr.x},${curr.y}`;
		}
	};

	// Сплошные/пунктирные сегменты
	const segments: { path: string; done: boolean | undefined }[] = [];
	for (let i = 1; i < positions.length; i++) {
		const prev = positions[i - 1];
		const curr = positions[i];
		const row = Math.floor(i / cardsPerRow);
		const done = items[i - 1].done && items[i].done;
		segments.push({ path: generateSegment(prev, curr, row), done });
	}

	// Размеры SVG
	const svgWidth = rowWidth + extra * 2;
	const svgHeight = positions[positions.length - 1].y + extra;

	return (
		<div
			className="serpentine-timeline-container"
			style={{ width: svgWidth, height: svgHeight }}
		>
			<svg
				width={svgWidth}
				height={svgHeight}
				viewBox={`0 0 ${svgWidth} ${svgHeight}`}
			>
				{segments.map((seg, i) => (
					<path
						key={i}
						d={seg.path}
						stroke="#1890ff"
						strokeWidth={strokeWidth}
						fill="transparent"
						strokeDasharray={seg.done ? undefined : "8 8"}
					/>
				))}

				{positions.map((pos, i) => (
					<circle
						key={i}
						cx={pos.x}
						cy={pos.y}
						r={circleRadius}
						fill={items[i].done ? "#1890ff" : "#fff"}
						stroke="#1890ff"
						strokeWidth={2}
					/>
				))}
			</svg>

			{items.map((item, i) => (
				<motion.div
					key={i}
					className={"timeline-item "+ (item.process ? " process" : "") + (isDarkMode ? " light" : "")}
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: i * 0.07 }}
					whileHover={{
						scale: 1.05,
						y: -5,
						rotate: 1,
						transition: { type: "spring", stiffness: 300, damping: 15 },
					}}
					style={{
						left: positions[i].x - 70,
						top: positions[i].y + circleRadius + 8,
					}}
				>
					<div className="timeline-item-date">{item.date}</div>
					<div className="timeline-item-content">
						<h4>{item.title}</h4>
						<p>{item.description}</p>
					</div>
				</motion.div>
			))}
		</div>
	);
};
