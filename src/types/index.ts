export interface IUser {
  _id: string;
  fullName: string;
  username?: string;
  email: string;
  profilePic?: string;
  hasChosenUsername?: boolean;
  contacts?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  isOptimistic?: boolean;
}

export interface AuthState {
  authUser: IUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  onlineUsers: string[];
  checkAuth: () => Promise<void>;
  signup: (data: { fullName: string; username: string; email: string; password: string }) => Promise<void>;
  login: (data: { emailOrUsername: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  setUsername: (username: string) => Promise<boolean>;
  updateProfile: (data: { profilePic?: string; username?: string }) => Promise<void>;
  connectPusher: () => void;
  disconnectPusher: () => void;
}

export interface ChatState {
  allContacts: IUser[];
  chats: IUser[];
  messages: IMessage[];
  activeTab: "chats" | "contacts";
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (selectedUser: IUser | null) => void;
  getAllContacts: () => Promise<void>;
  addContact: (username: string) => Promise<boolean>;
  removeContact: (userId: string) => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text?: string; image?: string }) => Promise<void>;
  subscribeToMessages: () => void;
  unsubscribeFromMessages: () => void;
}
