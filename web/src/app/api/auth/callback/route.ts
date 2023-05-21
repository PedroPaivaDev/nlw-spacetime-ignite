import { api } from '@/lib/api'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  const redirectTo = request.cookies.get('redirectTo')?.value

  const registerResponse = await api.post('/register', {
    code,
  })
  const { token } = registerResponse.data

  /* desse modo, se tiver uma url no cookie "redirectTo", ele vai redirecionar para essa página anterior, ou senão, ele vai redirecionar o usuário para a página home ('/') da aplicação */
  const redirectURL = redirectTo ?? new URL('/', request.url)
  const cookieExpiresInSeconds = 60 * 60 * 24 * 30
  return NextResponse.redirect(redirectURL, {
    headers: {
      /* é dessa forma que eu crio um 'cookie', interpolando um nome + = + cookie */
      /* o Path é para definir onde esse cookie poderá ser unstable_createNodejsStream. Se eu colocar /, ele poderá ser usado em toda a aplicação e se eu colocar 'auth' por exemplo, ele só poderá ser utilizado na rota auth */
      /* o max-age é o tanto de tempo que o cookie vai durar em segundos. 2592000 é um mês */
      'Set-Cookie': `token=${token}; Path=/; max-age=${cookieExpiresInSeconds}`,
    },
  })
}
