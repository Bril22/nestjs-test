import '@fastify/secure-session';

declare module 'fastify' {
  interface FastifyRequest {
    csrfToken: () => string | undefined;
    csrfProtection: () => void;
    user: {
      id: number;
    };
  }
  interface FastifyReply {
    csrfProtection: () => void;
  }
}

declare module '@fastify/secure-session' {
  interface SessionData {
    user?: { id: string };
  }
}
