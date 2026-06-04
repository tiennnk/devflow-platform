import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  userId: number;
}

export interface AuthResponse {
  access_token: string;
}

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auth
export const login = (usernameOrEmail: string, password: string) => api.post<AuthResponse>('/auth/login', { usernameOrEmail, password });

export const register = (username: string, email: string, password: string) => api.post<AuthResponse>('/auth/register', { username, email, password });

// tasks
export const getTasks = () => api.get<Task[]>('/tasks');

export const createTask = (title: string, status?: TaskStatus) => api.post<Task>('/tasks', { title, ...(status && { status }) });

export const updateTask = (id: number, data: { title?: string; status?: TaskStatus }) => api.patch<Task>(`/tasks/${id}`, data);

export const deleteTask = (id: number) => api.delete(`/tasks/${id}`);
