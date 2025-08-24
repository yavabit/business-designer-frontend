import { PiRectangle, PiRectangleDashed } from "react-icons/pi";
import { CgShapeRhombus } from "react-icons/cg";
import { MdOutlineCircle } from "react-icons/md";

export const nodeList: INodeItem[] = [
	{
		id: "1",
		code: "process",
		name: "Процесс",
		description: "Стандартный бизнес-процесс",
		icon: <PiRectangle />,
	},
	{
		id: "2",
		code: "condition",
		name: "Условие",
		description: "Ветвление в зависимости от условия",
		icon: <CgShapeRhombus />,
	},
	{
		id: "3",
		code: "circle",
		name: "Начало/конец",
		description: "Начало или окончание всего процесса или подпроцесса",
		icon: <MdOutlineCircle />,
	},
	{
		id: "4",
		code: "middle-process",
		name: "Промежуточный процесс",
		description: "Необязательный или промежуточный процесс",
		icon: <PiRectangleDashed />,
	},
];
