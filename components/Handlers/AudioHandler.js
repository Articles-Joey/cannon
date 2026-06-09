"use client";

import { useEffect, useRef } from "react";
// import { useStore } from "@/hooks/useStore";
import { usePathname } from "next/navigation";
import { useAudioStore } from "@/hooks/useAudioStore";

export default function AudioHandler() {

    const pathname = usePathname();
    const audioSettings = useAudioStore((state) => state?.audioSettings);
    const musicRef = useRef(null);

    // Initialize Audio instance once
    useEffect(() => {
        if (typeof window !== 'undefined' && !musicRef.current) {
            musicRef.current = new Audio("/audio/Cannon Game.mp3");
            // Use built-in looping for seamless loop
            musicRef.current.loop = true;
            // Set initial volume if available
            const initialSettings = useAudioStore.getState().audioSettings;
            if (initialSettings?.music_volume) {
                musicRef.current.volume = initialSettings.music_volume / 100;
            }
        }

        // Cleanup on unmount
        return () => {
            if (musicRef.current) {
                musicRef.current.pause();
                musicRef.current = null;
            }
        };
    }, []);

    // Handle Volume Changes Independently
    useEffect(() => {
        if (musicRef.current && audioSettings) {
             const volume = audioSettings.music_volume !== undefined 
                ? audioSettings.music_volume 
                : 50;
             musicRef.current.volume = volume / 100;
        }
    }, [audioSettings?.music_volume]);

    // Handle Play/Pause State
    useEffect(() => {
        const music = musicRef.current;
        if (!music) return;

        // Don't play on home page
        if (pathname === "/") {
            music.pause();
            return;
        }

        if (audioSettings?.enabled) {
            // If supposed to be playing but isn't
            if (music.paused) {
                music.currentTime = 0; // Restart from beginning when enabling or entering game
                const playPromise = music.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        // Auto-play was prevented or interrupted
                    });
                }
            }
        } else {
            // Disabled
            music.pause();
        }
    }, [audioSettings?.enabled, pathname]);

    return null;

}