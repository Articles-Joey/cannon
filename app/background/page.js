import { Suspense } from "react"
import GamePage from "./play"

export const metadata = {
    title: `Cannon Game Background`,
}

export default function Page() {
    return (
        <Suspense><GamePage /></Suspense>
    )
}