interface IUser {
  id: number;
  firstname?: string;
  lastname?: string;
  name: string;
  email: string;
  pict_url?: string | null;
  isAuth: boolean;
}

interface IProject {
  id: number;
  name: string;
  pict_url?: string | null;
  author_id: number;
  author_name: string;
  created_at: Date;
  updated_at: Date;
}

interface IProcess {
  id: number;
  name: string;
  desc: Script;
  project_id: number;
  project_name: string;
  content: string;
  pict_url?: string | null;
  author_id: number;
  author_name: string;
  created_at: Date;
  updated_at: Date;
}

interface INodeItem {
  id: string;
  code: string;
  name: string;
  icon?: JSX.Element;
  description?: string;
	component?: JSX.Element
	defaultData?: object
}