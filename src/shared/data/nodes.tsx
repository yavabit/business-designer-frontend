import { PiRectangle, PiRectangleDashed } from "react-icons/pi";
import { CgShapeRhombus } from "react-icons/cg";
import { MdOutlineCircle } from "react-icons/md";
import ProcessNode from "@components/Nodes/ProcessNode";
import { DiamondNode } from "@components/Nodes/DiamonNode";
import { CircleNode } from "@components/Nodes/CircleNode";
import SubProcessNode from "@components/Nodes/SubProcessNode";

export const nodeList: INodeItem[] = [
	{
		id: "1",
		code: "process",
		name: "Процесс",
		description: "Стандартный бизнес-процесс",
		icon: <PiRectangle />,
		component: ProcessNode,
		defaultData: {
			label: 'Процесс'
		}
	},
	{
		id: "2",
		code: "condition",
		name: "Условие",
		description: "Ветвление в зависимости от условия",
		icon: <CgShapeRhombus />,
		component: DiamondNode,
		defaultData: {
			label: 'Условие'
		}
	},
	{
		id: "3",
		code: "circle",
		name: "Начало/конец",
		description: "Начало или окончание всего процесса или подпроцесса",
		icon: <MdOutlineCircle />,
		component: CircleNode,
		defaultData: {
			label: 'Начало/конец'
		}
	},
	{
		id: "4",
		code: "middle-process",
		name: "Промежуточный процесс",
		description: "Необязательный или промежуточный процесс",
		icon: <PiRectangleDashed />,
		component: SubProcessNode,
		defaultData: {
			label: 'Промежуточный процесс'
		}
	},
];
