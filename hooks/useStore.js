import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import typicalZustandStoreExcludes from '@articles-media/articles-dev-box/typicalZustandStoreExcludes';
import typicalZustandStoreStateSlice from '@articles-media/articles-dev-box/typicalZustandStoreStateSlice';

const generateRandomNickname = () => {

  const randomNames = [
    'BoomMaster',
    'IronBall',
    'PowderKeg',
    'FuseLighter',
    'CannonKing',
    'BlastRadius',
    'HeavyMetal',
    'SharpShooter',
    'RecoilRider',
    'SiegeBreaker',
  ]

  return randomNames[Math.floor(Math.random() * randomNames.length)]

}

export const useStore = create()(
  persist(
    (set, get) => ({

      ...typicalZustandStoreStateSlice(set, get, generateRandomNickname),

      // 1, 2, 3
      aimSensitivity: 1,
      setAimSensitivity: (sensitivity) => set({ aimSensitivity: sensitivity }),
      increaseAimSensitivity: () => set({ aimSensitivity: Math.min(get().aimSensitivity + 1, 3) }),
      decreaseAimSensitivity: () => set({ aimSensitivity: Math.max(get().aimSensitivity - 1, 1) }),

      touchControlsEnabled: false,
      setTouchControlsEnabled: (state) => set({ touchControlsEnabled: state }),
      toggleTouchControlsEnabled: () => set({ touchControlsEnabled: !get().touchControlsEnabled }),

      audioSettings: {
        enabled: true,
        backgroundMusicVolume: 50,
        soundEffectsVolume: 50,
      },
      setAudioSettings: (settings) => set({ audioSettings: { ...get().audioSettings, ...settings } }),
      toggleAudioEnabled: () => set({ audioSettings: { ...get().audioSettings, enabled: !get().audioSettings.enabled } }),

    }),
    {
      name: 'cannon-game-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => ![
            // Exclude list of keys to not persist
            ...typicalZustandStoreExcludes,
          ].includes(key))
        ),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)