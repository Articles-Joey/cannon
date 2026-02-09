import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export const useStore = create()(
  persist(
    (set, get) => ({

      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state
        });
      },

      darkMode: null,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      sidebar: true,
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

      showMenu: false,
      setShowMenu: (state) => set({ showMenu: state }),

      nickname: '',
      setNickname: (nickname) => set({ nickname }),
      setRandomNickname: () => {

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

        set({ nickname: randomNames[Math.floor(Math.random() * randomNames.length)] })

      },

      showSettingsModal: false,
      setShowSettingsModal: (state) => set({ showSettingsModal: state }),

      showInfoModal: false,
      setShowInfoModal: (state) => set({ showInfoModal: state }),

      showCreditsModal: false,
      setShowCreditsModal: (state) => set({ showCreditsModal: state }),

      // 1, 2, 3
      aimSensitivity: 1,
      setAimSensitivity: (sensitivity) => set({ aimSensitivity: sensitivity }),
      increaseAimSensitivity: () => set({ aimSensitivity: Math.min(get().aimSensitivity + 1, 3) }),
      decreaseAimSensitivity: () => set({ aimSensitivity: Math.max(get().aimSensitivity - 1, 1) }),

      touchControlsEnabled: false,
      setTouchControlsEnabled: (state) => set({ touchControlsEnabled: state }),
      toggleTouchControlsEnabled: () => set({ touchControlsEnabled: !get().touchControlsEnabled }),

      toontownMode: false,
      setToontownMode: (state) => set({ toontownMode: state }),
      toggleToontownMode: () => set({ toontownMode: !get().toontownMode }),

      graphicsQuality: 1,
      setGraphicsQuality: (quality) => set({ graphicsQuality: quality }),

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
            'showSettingsModal',
            'showInfoModal',
            'showCreditsModal'
          ].includes(key)),
        ),
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)