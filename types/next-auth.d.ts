import { Role, UserStatus, UserProfile } from "@prisma/client";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      status: UserStatus;
      profile?: UserProfile | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: Role;
    status: UserStatus;
    profile?: UserProfile | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role: Role;
    status: UserStatus;
    profile?: UserProfile | null;
  }
}