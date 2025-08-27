import React, { useCallback, useState } from "react";

type initialStateType = {
	input: string
}

export const useNodeInput = (initialState: initialStateType) => {

	const [inputValue, setInput] = useState(initialState.input)

	const onChangeInput = useCallback((evt: React.ChangeEvent<HTMLTextAreaElement>) => {
		setInput(evt.target.value);
	}, []);

	return {inputValue, onChangeInput}
};
