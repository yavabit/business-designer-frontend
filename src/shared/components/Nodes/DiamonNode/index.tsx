import { type NodeProps, type Node } from "@xyflow/react";
import { NodeWrapper } from "../NodeWrapper";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useDispatch } from "react-redux";
import { useNodeInput } from "@hooks/useNodeInput";
import { useEffect } from "react";
import { updateNodeText } from "@store/processConstructor/processConstructorSlice";

const inputStyle: React.CSSProperties = {
	textAlign: "center",
};

export const DiamondNode = (props: NodeProps<Node<NodeCustomData>>) => {
	const { data } = props
	const dispatch = useDispatch()

	const { inputValue, onChangeInput, setInput } = useNodeInput({
		input: data.label as string,
	});

	useEffect(() => {
		setInput(data.label as string);
	}, [data.label, setInput]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value;
		onChangeInput(e);
		dispatch(updateNodeText({ 
			id: props.id,
			text: newValue 
		}));
	};

	return (
		<NodeWrapper
			node={props}
			inputStyle={inputStyle}
			style={{
				background: "transparent",
				border: "none",
				padding: "0px",
			}}
			isNeedInput={false}
		>
			<div
				style={{
					width: "100%",
					height: "100%",
					background: "#1e1e1e",
					clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: "1px solid #3c3c3c",
				}}
			>
				<NodeInput
					value={inputValue}
					onChange={handleChangeInput}
					style={{
						color: data.style?.color ?? "white",
						fontSize: data.style?.fontSize,
						paddingTop: 20,
						...inputStyle,
					}}
				/>
			</div>
		</NodeWrapper>
	);
};
