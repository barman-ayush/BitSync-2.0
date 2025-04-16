export type UserProps = {
  id: string;
  username: string;
  email: string;
  password: string;
  avatarUrl: string;
  bio: string | string;
  createdAt: any;
  updatedAt: any;
};

export interface RepositoryFormData {
  name: string;
  description: string;
  isPublic: boolean;
}