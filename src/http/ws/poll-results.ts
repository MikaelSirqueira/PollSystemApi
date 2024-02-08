import { FastifyInstance } from "fastify";
import { z } from "zod";
import { voting } from "../../utils/voting-pub-sub";
import { stringify } from "querystring";

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true}, (connection, request) => {
    // Inscrever apoenas nas mensagems publicadas no canal com Id da enquete
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })
  
    const { pollId } = getPollParams.parse(request.params)
    
    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message))
    })
    
  })
}