"use client"
// import { create } from 'zustand'
import { createWithEqualityFn as create } from 'zustand/traditional'
// import { nanoid } from 'nanoid'
import { degToRad } from 'three/src/math/MathUtils'
import generateRandomInteger from '@/util/generateRandomInteger'
import { useStore } from './useStore'

// const getLocalStorage = (key) => JSON.parse(window.localStorage.getItem(key))
// const setLocalStorage = (key, value) => window.localStorage.setItem(key, JSON.stringify(value))

export const useCannonStore = create((set) => ({

    cameraMode: '',
    setCameraMode: (newValue) => {
        set((prev) => ({
            cameraMode: newValue
        }))
    },

    // Mouse and Keyboard
    // Touch
    controlType: "Mouse and Keyboard",
    setControlType: (newValue) => {
        set((prev) => ({
            controlType: newValue
        }))
    },

    music: false,
    setMusic: (newValue) => {
        set((prev) => ({
            music: newValue
        }))
    },

    debug: false,
    setDebug: (newValue) => {
        set((prev) => ({
            debug: newValue
        }))
    },

    goalLocation: [0, 0, 0],
    setGoalLocation: (newValue) => {
        set((prev) => ({
            goalLocation: newValue
        }))
    },
    setRandomGoalLocation: () => {

        set((prev) => ({
            goalLocation: [
                generateRandomInteger(-10, 10),
                0,
                generateRandomInteger(-10, 10)
            ]
        }))
    },

    position: [0, 0, 43],
    setPosition: (newValue) => {
        set((prev) => ({
            position: newValue
        }))
    },

    changeCameraLocation: false,
    setChangeCameraLocation: (newValue) => {
        set((prev) => ({
            changeCameraLocation: newValue
        }))
    },

    playerRotation: [0, degToRad(180), 0],
    resetPlayerRotation: (newValue) => {
        set((prev) => ({
            playerRotation: [0, degToRad(180), 0],
        }))
    },
    setPlayerRotation: (newValue) => {
        set((prev) => ({
            playerRotation: newValue
        }))
    },

    cameraFollowsProjectile: true,
    setCameraFollowsProjectile: (newValue) => {
        set((prev) => ({
            cameraFollowsProjectile: newValue
        }))
    },

    projectiles: [],
    setProjectiles: (newValue) => {
        set((prev) => ({
            projectiles: newValue
        }))
    },
    addProjectile: (newProjectile) => {
        const audioSettings = useStore.getState().audioSettings
        if (audioSettings.enabled) {
            const audio = new Audio('/audio/Cannon Fire.ogg')
            audio.volume = audioSettings.soundEffectsVolume / 100
            try {
                audio.play()
            } catch (error) {
                console.error("Audio playback failed", error)
            }
        }
        set((prev) => ({
            projectiles: [...prev.projectiles, newProjectile]
        }))
    },
    removeProjectile: (id) => {
        set((prev) => ({
            projectiles: prev.projectiles.filter(p => p.id !== id)
        }))
    },

}))