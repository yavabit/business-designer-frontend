import { PiRectangle, PiRectangleDashed } from "react-icons/pi";
import { CgShapeRhombus } from "react-icons/cg";
import { MdOutlineCircle } from "react-icons/md";
import ExampleNode from "@components/Nodes/ExampleNode";

export const nodeList: INodeItem[] = [
	{
		id: "1",
		code: "process",
		name: "Процесс",
		description: "Стандартный бизнес-процесс",
		icon: <PiRectangle />,
		component: ExampleNode,
		defaultData: {
			label: 'Node 1'
		}
	},
	{
		id: "2",
		code: "condition",
		name: "Условие",
		description: "Ветвление в зависимости от условия",
		icon: <CgShapeRhombus />,
		defaultData: {
			label: 'Node 2'
		}
	},
	{
		id: "3",
		code: "circle",
		name: "Начало/конец",
		description: "Начало или окончание всего процесса или подпроцесса",
		icon: <MdOutlineCircle />,
		defaultData: {
			label: 'Node 3'
		}
	},
	{
		id: "4",
		code: "middle-process",
		name: "Промежуточный процесс",
		description: "Необязательный или промежуточный процесс",
		icon: <PiRectangleDashed />,
		defaultData: {
			label: 'Node 4'
		}
	},
];
