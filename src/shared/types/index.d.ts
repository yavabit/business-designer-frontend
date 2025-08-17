interface IUser {
	id: string
	firstname?: string
	lastname?: string
	name: string
	email: string
	isAuth: boolean
}

interface IProject {
	id: string
	name: string
	pict_url?: string
	creation_user_id: string
	creation_user_name: string
	created_at: Date
	updated_at: Date
}

interface IProcess {
	id: string
	name: string
	desc: script
	project_id: string
	project_name: string
	scheme: string
	pict_url?: string
	creation_user_id: string
	creation_user_name: string
	created_at: Date
	updated_at: Date
}
