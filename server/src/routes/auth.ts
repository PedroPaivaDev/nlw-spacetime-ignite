import { FastifyInstance } from "fastify";
import axios from "axios";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register", async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    });
    const { code } = bodySchema.parse(request.body);
    const accessTokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        /* headers são meta-dados da requisição */
        headers: {
          /* o accept é o formato que eu quero que venha a resposta */
          Accept: "application/json",
        },
      }
    );
    const { access_token } = accessTokenResponse.data;
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    /* validar os dados recebidos de usuário dod gitHub */
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    });
    const userInfo = userSchema.parse(userResponse.data);

    /* verificar se o usuário já existe no banco de dados */
    let user = await prisma.user.findUnique({
      where: {
        githubId: userInfo.id,
      },
    });
    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      });
    }

    const token = app.jwt.sign(
      {
        /* informações do usuário que eu quero que estejam dentro do token. Não devo colocar informações sensíveis como senha, pois o token não é criptografado, ele é apenas assinado */
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id /* subject, que é a qual usuário pertence este token */,
        expiresIn: "30 days" /* o usuário ficará logado durante 30 dias */,
      }
    );

    return { token };
  });
}
