import { Auth, type AuthConfig, createActionURL, setEnvDefaults } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import type { Session } from "@auth/core/types";
import { enhance, type UniversalHandler, type UniversalMiddleware } from "@universal-middleware/core";
import {eq} from "drizzle-orm";
import { db } from "../database/drizzle/db";
import { usersTable } from "../database/drizzle/schema";
import bcrypt from "bcrypt";
// import { users, accounts, sessions, verificationTokens } from "../database/drizzle/schema/auth";

const authjsConfig = {
  basePath: "/api/auth",
  trustHost: true,
  secret: process.env.AUTH_SECRET,
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

        if(!username || !password) { return null; }

        const user = await db.query.usersTable.findFirst({
            where: eq(usersTable.username, username),
        });

        if(!user) { return null; }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if(!isPasswordValid) { return null; }

        return {
            id: String(user.id),
            name: user.username,
            email: user.email,
        }
      },
    }),
  ],

  callbacks: {
      async jwt({ token, user }) {
          if (user) token.sub = user.id;
          return token;
      },
      async session({ session, token }) {
          if (session.user && token.sub) session.user.id = token.sub;
          return session;
      },
  },
} satisfies Omit<AuthConfig, "raw">;

/**
 * Retrieve Auth.js session from Request
 */
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

/**
 * Add Auth.js session to context
 * @link {@see https://authjs.dev/getting-started/session-management/get-session}
 **/
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

/**
 * Auth.js route
 * @link {@see https://authjs.dev/getting-started/installation}
 **/
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
