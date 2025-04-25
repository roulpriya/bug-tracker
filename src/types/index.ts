export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  emailVerified: Date | null;
  organizationId: string | null;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  users?: User[];
  projects?: Project[];
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  organization?: Organization;
  issues?: Issue[];
  labels?: Label[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  projectId: string;
  project?: Project;
  issues?: Issue[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string | null;
  status: 'open' | 'in-progress' | 'resolved';
  projectId: string;
  project?: Project;
  authorId: string;
  author?: User;
  labels?: Label[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  issueId: string;
  issue?: Issue;
  authorId: string;
  author?: User;
  createdAt: Date;
  updatedAt: Date;
}
