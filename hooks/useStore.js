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

      darkMode: true,
      toggleDarkMode: () => set({ darkMode: !get().darkMode }),

      sidebar: true,
      toggleSidebar: () => set({ sidebar: !get().sidebar }),

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