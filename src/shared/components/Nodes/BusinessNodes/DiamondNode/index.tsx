import { type NodeProps, type Node } from "@xyflow/react";
import { NodeWrapper } from "../../NodeWrapper";
import { NodeInput } from "@components/NodeInput/NodeInput";
import { useDispatch } from "react-redux";
import { useNodeInput } from "@hooks/useNodeInput";
import { memo, useEffect, useMemo } from "react";
import { updateNodeText } from "@store/processConstructor/processConstructorSlice";
import { debounce } from "lodash";
import { useTheme } from "@hooks/useTheme";
import { useAppSelector } from "@hooks/storeHooks";

const inputStyle: React.CSSProperties = {
	textAlign: "center",
};

export const DiamondNode = memo((props: NodeProps<Node<NodeCustomData>>) => {
	const { token } = useTheme()
	const { currentThemeName } = useAppSelector((state) => state.theme)

	const themeStylesDiamond = useMemo(() => {
		const baseStyles = {
			backgroundColor: "#1e1e1e",
			borderColor: "#3c3c3c"
		};

		if (currentThemeName === "light") {
			return {
				...baseStyles,
				backgroundColor: "transparent",
				borderColor: "black"
			};
		}

		return baseStyles;
	}, [currentThemeName]);
	
	const { data } = props
	const dispatch = useDispatch()

	const { inputValue, onChangeInput, setInput } = useNodeInput({
		input: data.label as string,
	});

	useEffect(() => {
		setInput(data.label as string);
	}, [data.label, setInput]);

	const debouncedDispatch = useMemo(
		() => debounce((value: string) => {
			dispatch(updateNodeText({ id: props.id, text: value }));
		}, 300),
		[dispatch, props.id]
	);

	useEffect(() => () => debouncedDispatch.cancel(), [debouncedDispatch]);

	const handleChangeInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		onChangeInput(e);
		debouncedDispatch(e.target.value);
	};

	return (
		<NodeWrapper
			node={props}
			inputStyle={inputStyle}
			overrideStyle={{
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
					background: themeStylesDiamond.backgroundColor,
					clipPath: "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					border: "1px solid #3c3c3c",
					...props.data.style
				}}
			>
				<svg
					width="100%"
					height="100%"
					viewBox="0 0 100 100"
					preserveAspectRatio="none"
					style={{
						position: "absolute",
						top: "0",
						left: "0",
						pointerEvents: "none",
						zIndex: 1
					}}
				>
					<polygon
						points="50,0 100,50 50,100 0,50"
						fill="none"
						stroke={props.data.style?.borderColor ?? themeStylesDiamond.borderColor}
						strokeWidth="1"
					/>
				</svg>

				<NodeInput
					value={inputValue}
					onChange={handleChangeInput}
					style={{
						color: data.style?.color ?? token.colorText,
						fontSize: data.style?.fontSize,
						paddingTop: 20,
						...inputStyle,
					}}
				/>
			</div>
		</NodeWrapper>
	);
});
