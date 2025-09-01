import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addEdge, applyEdgeChanges, applyNodeChanges, type Edge, type Node, type SnapGrid, type Viewport } from "@xyflow/react";

interface IConstructorState {
	nodes: Node<NodeCustomData>[]
	edges: Edge[]
	snapGrid: SnapGrid
	defaultViewport: Viewport
	selectedNode: Node<NodeCustomData> | null
}

const nodeId1 = crypto.randomUUID()
const nodeId2 = crypto.randomUUID()
const nodeId1_nodeId2 = `${nodeId1}-${nodeId2}`

const initialState: IConstructorState = {
	nodes: [
		{
			id: nodeId1,
			position: { x: 0, y: 0 },
			type: "input",
			data: {
				label: "Node 1", text: "Hello", test: 1,
				style: {
					padding: "20px",
					borderColor: "red",
				},
			},
		},
		{
			id: nodeId2,
			type: "process",
			position: { x: 0, y: 100 },
			data: {
				label: "Node 2",
				value: "Текст",
				style: {
					padding: "20px",
					borderColor: "5px solid red",
				},
			},
		}],
	edges: [{ id: nodeId1_nodeId2, source: nodeId1, target: nodeId2 }],
	snapGrid: [20, 20],
	defaultViewport: { x: 0, y: 0, zoom: 1.5 },
	selectedNode: null
}

const processConstructorSlice = createSlice({
	name: "constructorProcess",
	initialState,
	reducers: {
		addNode: (state, { payload }: PayloadAction<Node>) => {
			const newNode: Node = {
				...payload,
				id: crypto.randomUUID()
			};
			state.nodes = [...state.nodes, newNode];
		},
		updateNodeProperties: (state, action: PayloadAction<{
			id: string;
			propertyKey: string;
			propertyValue: string;
		}>) => {
			const { id, propertyKey, propertyValue } = action.payload;

			state.nodes = state.nodes.map((node) => {
				if (node.id === id) {
					node.data = {
						...node.data,
						style: {
							...node.data.style,
							[propertyKey]: propertyValue
						}
					};
				}
				return node;
			});
		},
		updateNodeText: (state, action) => {
			state.nodes = state.nodes.map((node) => {
				if (node.id === action.payload.id) {
					node.data = { ...node.data, label: action.payload.text };
				}
				return node;
			});
		},
		updateNodeColor: (state, action) => {
			state.nodes = state.nodes.map((node) => {
				if (node.id === action.payload.id) {
					const style = node.data.style
					node.data = {
						...node.data, style: Object.assign({
							style,
							color: action.payload.color
						})
					};
				}
				return node;
			});
		},

		onNodesChange: (state, action) => {
			console.log('onNodesChange', action)
			state.nodes = applyNodeChanges(action.payload, state.nodes);
		},
		onEdgesChange: (state, action) => {
			state.edges = applyEdgeChanges(action.payload, state.edges);
		},
		onConnect: (state, action) => {
			state.edges = addEdge(action.payload, state.edges);
		},
		setSelectedNode: (state, { payload }) => {
			state.selectedNode = payload;
		},

	}
})


export const processConstructorReducer = processConstructorSlice.reducer;
export const { 
	onNodesChange, 
	onEdgesChange, 
	onConnect, 
	addNode, 
	updateNodeProperties, 
	setSelectedNode, 
	updateNodeColor 
} = processConstructorSlice.actions;