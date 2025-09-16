import { Handle, NodeResizer, Position, type Node, type NodeProps } from "@xyflow/react";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";
import { useDispatch } from "react-redux";
import { updateNodeText } from "@store/processConstructor/processConstructorSlice";
import { memo, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { useTheme } from "@hooks/useTheme";

import styles from "./style.module.scss"
import { useAppSelector } from "@hooks/storeHooks";
import { Avatar } from "antd";

type HandlePositionType = {
	left?: number | string; 
	right?: number | string; 
	bottom?: number | string; 
	top?: number | string;
	transform?: string;
}

type NodeWrapperType = {
	node: NodeProps<Node<NodeCustomData>>;
	children?: React.ReactNode;
	handleLeft?: boolean;
	handleRight?: boolean;
	handleTop?: boolean;
	handleBottom?: boolean;
	style?: React.CSSProperties;
	handleStyle?: {
		left?: HandlePositionType;
		right?: HandlePositionType;
		top?: HandlePositionType;
		bottom?: HandlePositionType;
	};
	inputStyle?: React.CSSProperties;
	isNeedInput?: boolean;
	overrideStyle?: React.CSSProperties;
	title?: React.ReactNode;
	resizable?: boolean;
	icon?: React.ReactNode;
	editable?: boolean;
};

export const NodeWrapper = memo(({
	node,
	children,
	handleLeft = true,
	handleRight = true,
	handleTop = true,
	handleBottom = true,
	style,
	handleStyle,
	inputStyle,
	isNeedInput = true,
	overrideStyle,
	resizable = true,
	title,
	icon,
	editable = true
}: NodeWrapperType) => {
	const { nodesCategory } = useAppSelector(state => state.nodes)

	const { token } = useTheme()

	const dispatch = useDispatch()
	const { data } = node

	const { inputValue, onChangeInput, setInput } = useNodeInput({
		input: data.label as string,
	});

	useEffect(() => {
		setInput(data.label as string);
	}, [data.label, setInput]);

	const debouncedDispatch = useMemo(
		() => debounce((value: string) => {
			dispatch(updateNodeText({ id: node.id, text: value }));
		}, 300),
		[dispatch, node.id]
	);

	useEffect(() => () => debouncedDispatch.cancel(), [debouncedDispatch]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChangeInput(e);
		debouncedDispatch(e.target.value);
	};

	return (
		<div
			className={`react-flow__node-input nopan selectable draggable ${styles[nodesCategory ?? 'agent']}`}
			style={{
				width: '100%',
				height: '100%',
				...style,
				...(overrideStyle ?? data.style),
			}}
		>
			{resizable && <NodeResizer isVisible={node.selected}/>}

			{title && <div className={styles["node-wrapper__title"]}>
				{icon && <Avatar icon={icon} shape="square" style={{marginRight: 5, height: 25}}/>}
				<NodeInput
					value={inputValue}
					type="input"
					editable={editable}
					onChange={handleChangeInput}
					style={{ 
						color: data.style?.color ?? token.colorText,
						fontSize: data.style?.fontSize,
						...inputStyle 
					}}
				/>
			</div>
			}

			{isNeedInput && <NodeInput
				value={inputValue}
				onChange={handleChangeInput}
				editable={editable}
				style={{ 
					color: data.style?.color ?? token.colorText,
					fontSize: data.style?.fontSize,
					...inputStyle 
				}}
			/>}

			{children}

			{handleLeft && <Handle id="left" type="source" isConnectable position={Position.Left} style={{...handleStyle?.left}}/>}
			{handleRight && <Handle id="right" type="source" isConnectable position={Position.Right} style={{...handleStyle?.right}}/>}
			{handleTop && <Handle id="top" type="source" isConnectable position={Position.Top} style={{...handleStyle?.top}}/>}
			{handleBottom && <Handle id="bottom" type="source" isConnectable position={Position.Bottom} style={{...handleStyle?.bottom}}/>}
		</div>
	);
});
