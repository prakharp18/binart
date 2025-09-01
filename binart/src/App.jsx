import { useState } from "react"
import IntroAxolot from "./components/intro/intro-axolot"
import MainPage from "./components/canvas/MainPage"

export default function Page() {
  const [showIntro, setShowIntro] = useState(true)

  const handleIntroComplete = () => {
    setShowIntro(false)
  }

  if (showIntro) {
    return (
      <main className="min-h-dvh bg-black text-white">
        <IntroAxolot onComplete={handleIntroComplete} />
      </main>
    )
  }

  return <MainPage />
}
