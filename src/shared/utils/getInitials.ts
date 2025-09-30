const getInitials = (value: string) => {
	const [fistName, secondName] = value.split(' ')

	if(!secondName)
		return fistName.charAt(0)

	return `${fistName.charAt(0)}${secondName.charAt(0)}`
}

export default getInitials