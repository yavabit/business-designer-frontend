import { Handle, NodeResizer, Position, type Node, type NodeProps } from "@xyflow/react";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useNodeInput } from "@hooks/useNodeInput";
import { useDispatch } from "react-redux";
import { updateNodeText } from "@store/processConstructor/processConstructorSlice";
import { memo, useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
import { useTheme } from "@hooks/useTheme";
import { LoadingOutlined } from '@ant-design/icons';
import styles from "./style.module.scss"
import { useAppSelector } from "@hooks/storeHooks";
import { Avatar, Spin } from "antd";

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
	overrideStyle?: React.CSSProperties;
	resizable?: boolean;
	icon?: React.ReactNode;
	editable?: boolean;
	loading?: boolean;
	inputType?: 'input' | 'text';
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
	overrideStyle,
	resizable = true,
	icon,
	editable = true,
	loading = false,
	inputType
}: NodeWrapperType) => {
	const { nodesCategory } = useAppSelector(state => state.nodes)
	const [isEditing, setIsEditing] = useState(false);

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

	const handleDoubleClick = () => {
		if (editable) {
			setIsEditing(true);
		}
	};

	const handleClick = () => {
		if (node.selected) {
			setIsEditing(true);
		}
	};

	const handleBlur = () => {
		setIsEditing(false);
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
			{loading && <div
				style={{
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: 'rgba(0, 0, 0, 0.4)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					zIndex: 10,
					borderRadius: 'inherit',
				}}
				>
				<Spin size="large" indicator={<LoadingOutlined spin />}/>
			</div>}
			
			{resizable && <NodeResizer isVisible={node.selected}/>}

			{<div className={styles["node-wrapper__title"]}>
				{icon && <Avatar icon={icon} shape="square" style={{marginRight: 5, height: 25}}/>}
				<NodeInput
					value={inputValue}
					type={inputType ?? "input"}
					editable={editable}
					onChange={handleChangeInput}
					isEditing={isEditing}
					onDoubleClick={handleDoubleClick}
					onClick={handleClick}
					onBlur={handleBlur}
					style={{ 
						color: data.style?.color ?? token.colorText,
						fontSize: data.style?.fontSize,
						...inputStyle 
					}}
				/>
			</div>
			}

			{children}

			{handleLeft && <Handle id="left" type="source" isConnectable position={Position.Left} style={{...handleStyle?.left}}/>}
			{handleRight && <Handle id="right" type="source" isConnectable position={Position.Right} style={{...handleStyle?.right}}/>}
			{handleTop && <Handle id="top" type="source" isConnectable position={Position.Top} style={{...handleStyle?.top}}/>}
			{handleBottom && <Handle id="bottom" type="source" isConnectable position={Position.Bottom} style={{...handleStyle?.bottom}}/>}
		</div>
	);
});