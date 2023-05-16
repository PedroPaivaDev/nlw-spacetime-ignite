import Button from '@/components/Button'

export default function Home() {
  return (
    <div className="h-screen bg-zinc-950 p-6 text-zinc-50">
      <h1 className="text-4xl font-bold">Sua cápsula do tempo</h1>
      <Button title="Diego" />
      <Button title="Mayk" />
      <Button title="Rodrigo" />
      <Button title="Pedro" />
    </div>
  )
}
