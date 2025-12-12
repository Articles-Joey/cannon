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

      }

    }),
    {
      name: 'cannon-game-storage', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      onRehydrateStorage: () => (state) => {
        state.setHasHydrated(true)
      },
    },
  ),
)