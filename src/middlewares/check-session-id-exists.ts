import { FastifyReply, FastifyRequest } from 'fastify';

// eslint-disable-next-line consistent-return
export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  const { sessionId } = request.cookies;

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Unathorized',
    });
  }
}
