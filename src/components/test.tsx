"use client"

import { trpc } from "@/trpc/client"

const Test = () => {
  const [data] = trpc.hello.useSuspenseQuery({
    text: "Surya"
  })
  return (
    <div>
      Page client says: {data.greeting}
    </div>
  )
}

export default Test