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
			label: 'Запрос'
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
			label: 'Письмо'
		}
	},
	{
		id: "3",
		code: "circle",
		name: "Старт/стоп",
		description: "Точка старта или окончания всего процесса",
		icon: <MdOutlineCircle />,
		component: DiamondNode,
		defaultData: {
			label: 'Старт/стоп'
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
			label: 'Ожидание'
		}
	},
];
