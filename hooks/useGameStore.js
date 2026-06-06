// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameStore = create((set) => ({

    gameState: {},
    setGameState: (newValue) => {
        set((prev) => ({
            gameState: newValue
        }))
    },

}))