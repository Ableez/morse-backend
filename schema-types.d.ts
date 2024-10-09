// Users table types
type User = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  email: string;
  profileImage?: string;
  bio?: string;
  role: "buyer" | "seller";
  walletAddress?: string;
};

// New user for insertions
type NewUser = Omit<User, "id" | "createdAt" | "updatedAt">;

// Contents table types
type Content = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  title: string;
  description?: string;
  price: number; // in wei
  duration?: number; // in seconds
  contentURI: string;
  coverImage?: string;
  contentType: string;
  isActive: boolean;
};

// New content for insertions
type NewContent = Omit<Content, "id" | "createdAt" | "updatedAt">;

// Content access table types
type ContentAccess = {
  id: string;
  contentId: string;
  userId: string;
  purchasedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
};

// New content access for insertions
type NewContentAccess = Omit<ContentAccess, "id" | "purchasedAt">;

// Relations between tables
type UserRelations = {
  createdContents: Content[];
  accessedContents: ContentAccess[];
};

type ContentRelations = {
  creator: User;
  accesses: ContentAccess[];
};

type ContentAccessRelations = {
  content: Content;
  user: User;
};
