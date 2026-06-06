"use client"
import { useStore } from '@/hooks/useStore';
import dynamic from 'next/dynamic'

// import HeroScene from './HeroScene';
const HeroScene = dynamic(() => import('./HeroScene'), {
    ssr: false,
});

export default function CannonGamePage() {

    const sceneKey = useStore(state => state.sceneKey);

    return (
        <HeroScene 
            key={sceneKey}
        />
    );
}