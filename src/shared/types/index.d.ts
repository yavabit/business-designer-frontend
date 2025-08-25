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
