"use client"
import { createWithEqualityFn as create } from 'zustand/traditional'

export const useGameServer = create((set) => ({

    isHost: false,
    setIsHost: (newValue) => {
        set((prev) => ({
            isHost: newValue
        }))
    },

    peer: null,
    setPeer: (newValue) => {
        set((prev) => ({
            peer: newValue
        }))
    },

    gameState: {
        players: [],
        // tiles: [],
        projectiles: [],
    },
    setGameState: (newValue) => {
        set((state) => ({
            gameState: typeof newValue === 'function' ? newValue(state.gameState) : newValue
        }))
    },

    bannedIds: [],
    addBannedId: (id) => set((state) => ({ bannedIds: [...state.bannedIds, id] })),

    displayId: null,
    setDisplayId: (newValue) => {
        set((prev) => ({
            displayId: newValue
        }))
    },

    reset: () => set({
        isHost: false,
        peer: null,
        gameState: {
            players: [],
            tiles: [],
            projectiles: []
        },
        bannedIds: [],
        displayId: null
    })

}))