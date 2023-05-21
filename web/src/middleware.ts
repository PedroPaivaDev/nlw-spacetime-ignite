import { NextRequest, NextResponse } from 'next/server'

const signInURL = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    /* se não tiver token, ou seja, não estiver logado */
    return NextResponse.redirect(signInURL, {
      headers: {
        'Set-Cookie': `redirectTo=${request.url}; Path=/; HttpOnly; max-age=20;`,
      },
    }) /* vai redirecionar para a página de login */
  }
  /* se estiver logado, vai permitir "continuar (next)" */
  return NextResponse.next()
}

export const config = {
  matcher:
    '/memories/:path*' /* define em quais endereços da aplicação, eu quero disparar esse middleware, ou seja, os lugares que ele precisa estar logado, para conseguir acessar */,
}
