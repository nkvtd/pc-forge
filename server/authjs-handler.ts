import { Auth, type AuthConfig, createActionURL, setEnvDefaults } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import type { Session } from "@auth/core/types";
import { enhance, type UniversalHandler, type UniversalMiddleware } from "@universal-middleware/core";
import {eq, or} from "drizzle-orm";
import { db } from "../database/drizzle/db";
import {adminsTable, usersTable} from "../database/drizzle/schema";
import bcrypt from "bcrypt";
import { AuthDrizzleAdapter } from "./drizzle/auth-adapter";

const authjsConfig = {
  basePath: "/api/auth",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  adapter: AuthDrizzleAdapter(),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = typeof credentials?.username === "string" ? credentials.username : null;
        const password = typeof credentials?.password === "string" ? credentials.password : null;

        if(!username || !password || typeof username !== 'string' || typeof password !== 'string') { return null; }

        const user = await db.query.usersTable.findFirst({
            where: or(
                eq(usersTable.username, username),
                eq(usersTable.email, username)
            ),
          });

        if(!user) return null;

        let isPasswordValid = false;

        if (user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2a$')) {
            isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        } else {
            isPasswordValid = password === user.passwordHash;
        }

        if(!isPasswordValid) return null;

          const admin = await db.query.adminsTable.findFirst({
              where: eq(adminsTable.userId, user.id),
          });

        return {
            id: String(user.id),
            username: user.username,
            email: user.email,
            isAdmin: !!admin
        }
      },
    }),
  ],

  callbacks: {
      async jwt({ token, user }) {
          if (user) {
              token.sub = user.id;

              const customUser = user as any;
              token.username = customUser.username;
              token.email = customUser.email;
              token.isAdmin = customUser.isAdmin;
          }
          return token;
      },
      async session({ session, token }) {
          if (session.user) {
              session.user.id = token.sub!;
              session.user.name = token.username as string;

              const customToken = token as any;
              session.user.email = customToken.email;
              session.user.isAdmin = customToken.isAdmin;
          }
          return session;
      },
  },
} satisfies Omit<AuthConfig, "raw">;

export async function getSession(req: Request, config: Omit<AuthConfig, "raw">): Promise<Session | null> {
  setEnvDefaults(process.env, config);
  const requestURL = new URL(req.url);
  const url = createActionURL("session", requestURL.protocol, req.headers, process.env, config);

  const response = await Auth(new Request(url, { headers: { cookie: req.headers.get("cookie") ?? "" } }), config);

  const { status = 200 } = response;

  const data = await response.json();

  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data as Session;
  throw new Error(typeof data === "object" && "message" in data ? (data.message as string) : undefined);
}

export const authjsSessionMiddleware: UniversalMiddleware = enhance(
  async (request, context) => {
    try {
      return {
        ...context,
        session: await getSession(request, authjsConfig),
      };
    } catch (error) {
      console.debug("authjsSessionMiddleware:", error);
      return {
        ...context,
        session: null,
      };
    }
  },
  {
    name: "pc-forge:authjs-middleware",
    immutable: false,
  },
);

export const authjsHandler = enhance(
  async (request) => {
    return Auth(request, authjsConfig);
  },
  {
    name: "pc-forge:authjs-handler",
    path: "/api/auth/**",
    method: ["GET", "POST"],
    immutable: false,
  },
) satisfies UniversalHandler;
