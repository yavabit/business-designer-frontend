const getInitials = (value: string) => {
	const [fistName, secondName] = value.split(' ')

	return `${fistName.charAt(0)}${secondName.charAt(0)}`
}

export default getInitials