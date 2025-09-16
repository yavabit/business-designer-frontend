import { type Node, type NodeProps } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { CiStopwatch } from "react-icons/ci";
import { InputNumber, Select } from 'antd';
import { memo, useState } from "react";

const RangePickerStyles = {
	width: '100%',
	marginTop: 10
}

const timeOptions = [
	{
		value: 'seconds', label: 'секунд'
	},
	{
		value: 'minutes', label: 'минут'
	},
	{
		value: 'hours', label: 'часов'
	},
	{
		value: 'days', label: 'дней'
	},
]

export const WaitNode = memo((props: NodeProps<Node<NodeCustomData>>) => {
	const [openSelect, setOpenSelect] = useState(false)

	const selectAfter = (
		<Select 
			defaultValue="minutes" 
			style={{ width: 80 }} 
			options={timeOptions}
			onClick={(e) => {
				e.stopPropagation()
				setOpenSelect(!openSelect)
			}}
			open={openSelect}
		/>
	);

	return <NodeWrapper 
		node={props}
		isNeedInput={false}
		title={'Ожидание'}
		handleBottom={false}
		handleTop={false}
		icon={<CiStopwatch />}
	>
		<div style={{...RangePickerStyles}}>
			<InputNumber 
				size="small"
				addonAfter={selectAfter}
				formatter={(value) => {
					const num = parseInt(value?.toString().replace(/\D/g, '') || '0', 10);
					return isNaN(num) ? '0' : num.toString();
				}}
				parser={(value) => {
					const num = parseInt(value?.replace(/\D/g, '') || '0', 10);
					return isNaN(num) ? 0 : num;
				}}
				onClick={(e) => e.stopPropagation()}
				controls={false}
			/>
		</div>
	</NodeWrapper>
});
