interface IUser {
  id: string;
  firstname?: string;
  lastname?: string;
  name: string;
  email: string;
  pict_url?: string | null;
  isAuth: boolean;
}

interface IProject {
  id: string;
  name: string;
  pict_url?: string | null;
  author_id: string;
  author_name?: string;
  created_at: string;
  updated_at: string;
}

interface IProcess {
  id: string;
  name: string;
  desc: string;
  project_id: string;
  project_name: string;
  content: string;
  pict_url?: string | null;
  author_id: string;
  author_name: string;
  created_at: string;
  updated_at: string;
}

interface INodeItem {
  id: string;
  code: string;
  name: string;
  icon?: JSX.Element;
  description?: string;
	component?: JSX.Element
	defaultData: Record<string, unknown>
}

interface IGetAllParams {
  limit?: number;
  page?: number;
  field?: string;
  order?: string;
  search?: string;
}

interface IPagination {
  page?: number,
  limit?: number,
  total?: number,
  total_pages?: number,
  prev?: string | null,
  next?: string | null
}