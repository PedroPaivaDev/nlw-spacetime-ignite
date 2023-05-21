import React from 'react'
import Image from 'next/image'

import { getUser } from '@/lib/auth'

const Profile = () => {
  const { name, avatarUrl } = getUser()
  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt=""
        className="h-10 w-10 rounded-full"
        /* neste caso, como a imagem é externa (não está dentro da aplicação), o Next pede que eu insira um width e heigth. Não são as dimensões de exibição, mas sim a de carregamento da iamgem */
        /* mas mesmo assim, vai dar erro, pq o Next não carrega qualquer imagem de um endereço. Eu preciso configurar isso no next.config */
      />
      <p className="max-w-[140px] text-sm leading-snug">
        {name}
        <a
          href="/api/auth/logout"
          className="block text-red-400 hover:text-red-300"
        >
          Quero Sair
        </a>
      </p>
    </div>
  )
}

export default Profile
