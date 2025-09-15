import { MdOutlineCircle } from "react-icons/md";
import { DiamondNode } from "@components/Nodes/DiamondNode";
import { RequestNode } from "@components/Nodes/AgentNodes/RequestNode";
import { EmailNode } from "@components/Nodes/AgentNodes/EmailNode";
import { WaitNode } from "@components/Nodes/AgentNodes/WaitNode";
import { MdHttp } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { CiStopwatch } from "react-icons/ci";

export const agentNodesList: INodeItem[] = [
	{
		id: "1",
		code: "request",
		name: "Запрос",
		description: "Позволяет отправлять HTTP-запросы для запроса данных из любого приложения или службы с помощью REST API",
		icon: <MdHttp />,
		component: RequestNode,
		defaultData: {
			label: 'Процесс'
		}
	},
	{
		id: "2",
		code: "condition",
		name: "Отправка email",
		description: "Отправляет email на указанный адрес",
		icon: <MdEmail />,
		component: EmailNode,
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
		component: DiamondNode,
		defaultData: {
			label: 'Начало/конец'
		}
	},
	{
		id: "4",
		code: "middle-process",
		name: "Ожидание",
		description: "Приостанавливает выполнение рабочего процесса",
		icon: <CiStopwatch />,
		component: WaitNode,
		defaultData: {
			label: 'Промежуточный процесс'
		}
	},
];
