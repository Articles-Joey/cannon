"use client"

import dynamic from "next/dynamic"

import { useStore } from "@/hooks/useStore"
import { useAudioStore } from "@/hooks/useAudioStore"
import { useSocketStore } from "@/hooks/useSocketStore"
import useTouchControlsStore from "@/hooks/useTouchControlsStore"

const InfoModal = dynamic(
    () => import('@/components/UI/InfoModal'),
    { ssr: false }
)

// const SettingsModal = dynamic(
//     () => import('@/components/UI/SettingsModal'),
//     { ssr: false }
// )
const SettingsModal = dynamic(
    () => import('@articles-media/articles-dev-box/SettingsModal'),
    { ssr: false }
)

const CreditsModal = dynamic(
    () => import('@articles-media/articles-dev-box/CreditsModal'),
    { ssr: false }
)

export default function ClientModals() {

    const showInfoModal = useStore((state) => state.showInfoModal)
    const setShowInfoModal = useStore((state) => state.setShowInfoModal)

    const showSettingsModal = useStore((state) => state.showSettingsModal)
    const setShowSettingsModal = useStore((state) => state.setShowSettingsModal)

    const showCreditsModal = useStore((state) => state.showCreditsModal)
    const setShowCreditsModal = useStore((state) => state.setShowCreditsModal)

    return (
        <>

            {/* {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                />
            } */}

            {showSettingsModal &&
                <SettingsModal
                    show={showSettingsModal}
                    setShow={setShowSettingsModal}
                    store={useStore}
                    useTouchControlsStore={useTouchControlsStore}
                    useAudioStore={useAudioStore}
                    useSocketStore={useSocketStore}
                    config={{
                        tabs: {
                            'Graphics': {
                                darkMode: true,
                                landingAnimation: true
                            },
                            'Audio': {
                                sliders: [
                                    {
                                        key: "gameVolume",
                                        label: "Game Volume"
                                    },
                                    {
                                        key: "musicVolume",
                                        label: "Music Volume"
                                    }
                                ]
                            },
                            'Controls': {
                                defaultKeyBindings: {
                                    // moveUp: "W",
                                    // moveDown: "S",
                                    // moveLeft: "A",
                                    // moveRight: "D",
                                }
                            },
                            'Multiplayer': {
                                visible: false,
                            },
                            'Other': {
                                toontownMode: true,
                            }
                        }
                    }}
                />
            }

            {showInfoModal &&
                <InfoModal
                    show={showInfoModal}
                    setShow={setShowInfoModal}
                />
            }

            {showCreditsModal &&
                <CreditsModal
                    show={showCreditsModal}
                    setShow={setShowCreditsModal}
                    owner="Articles-Joey"
                    repo="cannon"
                />
            }

        </>
    )
}