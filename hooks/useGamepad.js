import { useEffect, useRef } from 'react'
import { useControllerStore } from './useControllerStore'

const DEADZONE = 0.15

export function useGamepad() {
    const fireRef = useRef(false)
    const prevFireRef = useRef(false)

    useEffect(() => {
        let animFrame

        const poll = () => {
            const gamepads = navigator.getGamepads ? navigator.getGamepads() : []
            const gp = gamepads[0]

            if (gp) {
                // Update controller store for the UI preview
                useControllerStore.getState().setControllerState({
                    connected: true,
                    id: gp.id,
                    axes: [...gp.axes],
                    buttons: gp.buttons.map(b => ({
                        pressed: b.pressed,
                        value: b.value
                    }))
                })

                // Check fire: RT (index 7) or A button (index 0)
                const rtPressed = gp.buttons[7]?.pressed || gp.buttons[7]?.value > 0.5
                const aPressed = gp.buttons[0]?.pressed

                const isFirePressed = rtPressed || aPressed

                // Only fire on fresh press (edge detection)
                if (isFirePressed && !prevFireRef.current) {
                    fireRef.current = true
                } else {
                    fireRef.current = false
                }
                prevFireRef.current = isFirePressed
            } else {
                useControllerStore.getState().setControllerState({ connected: false })
            }

            animFrame = requestAnimationFrame(poll)
        }

        animFrame = requestAnimationFrame(poll)

        return () => cancelAnimationFrame(animFrame)
    }, [])

    return { fireRef }
}

/**
 * Returns the left stick axes with deadzone applied.
 * axes[0] = left/right, axes[1] = up/down
 */
export function getLeftStick() {
    const state = useControllerStore.getState().controllerState
    if (!state?.connected || !state?.axes) return [0, 0]

    let x = state.axes[0] || 0
    let y = state.axes[1] || 0

    if (Math.abs(x) < DEADZONE) x = 0
    if (Math.abs(y) < DEADZONE) y = 0

    return [x, y]
}
