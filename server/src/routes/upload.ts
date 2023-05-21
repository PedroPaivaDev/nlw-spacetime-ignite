import { FastifyInstance } from "fastify";

import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream"; // permite eu aguardar uma string, o processo de upload finalizar. Então eu consigo verificar quando que um processo chegou até o final
import { promisify } from "node:util"; // transforma algumas funções mais antigas do NodeJs, que ainda não tinha suporte á promises, para promises

const pump = promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880 /* 5mb */,
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    /* o mimetype está presente em todo arquivo baixado, ele é uma categorização global de tipos de arquivos. Para saber se é vídeo ou iamgem, o mimetype precisa começar com image ou video */
    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    const fileId = randomUUID(); // para gerar um uuid aleatório, pois é bem provável que usuários façam upload de arquivos com o mesmo nome, então eu não vou usar o nome do arquivo para salvar no meu disco, pois um arquivo vai sobrescrever o outro
    const extension = extname(upload.filename); // retorna a estensão do arquivo

    const fileName = fileId.concat(extension); // vai concatenar o nome do arquivo com o uuid gerado
    const writeStream = createWriteStream(
      resolve(
        __dirname,
        "../../uploads/",
        fileName
      ) /* basicamente, quando vou determinar caminhos entre pastas aqui no meu arquivo, eu uso essa função pq ela vai arrumar: no windows a barra é para esquerda; no MAC a barra é para direita... então ela vai padronizar os caminhos para todos os sistemas entenderem. */
    ); // para escrever um arquivo em disco, aos poucos

    await pump(upload.file, writeStream); // conjunto de métodos para fazer algumas funções antigas do Node, entenderem promises

    const fullUrl = request.protocol.concat("://").concat(request.hostname); // faço isso ao invez de escrever o http:// diretamente, pois isso pode atrapalhar na hora de colocar o projeto em produção
    // o hostname é o domínio da aplicação (ex.: localhost:3000)
    const fileUrl = new URL(`/uploads/${fileName}`, fullUrl).toString(); // retorna a url do arquivo

    return { fileUrl };
  });
}
