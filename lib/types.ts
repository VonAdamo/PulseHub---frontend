export type RegisterRequest = {
  username: string;
  displayName: string;
  password: string;
};

export type RegisterResponse = {
  userId: string;
  username: string;
  displayName: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  userId: string;
  username: string;
  displayName: string;
};

export type CurrentUser = {
  userId: string;
  username: string;
  displayName: string;
};

export type CreateMessageRequest = {
  channel: string;
  content: string;
};

export type Message = {
  id: string;
  senderId: string;
  username: string;
  displayName: string;
  channel: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type ApiErrorBody = {
  error?: string;
  status?: number;
};
