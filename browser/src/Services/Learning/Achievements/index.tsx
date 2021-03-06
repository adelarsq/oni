/**
 * Achievements.ts
 *
 * Entry point for the 'achievements' feature
 */

import { Configuration } from "./../../Configuration"
import { OverlayManager } from "./../../Overlay"

import { AchievementNotificationRenderer } from "./AchievementNotificationRenderer"

import { AchievementsManager, IPersistedAchievementState } from "./AchievementsManager"

import { getStore, IStore } from "./../../../Store"

export * from "./AchievementsManager"

let _achievements: AchievementsManager = null

export const activate = (
    configuration: Configuration,
    // editorManager: EditorManager,
    // sidebarManager: SidebarManager,
    overlays: OverlayManager,
) => {
    const achievementsEnabled = configuration.getValue("experimental.achievements.enabled")

    if (!achievementsEnabled) {
        return
    }

    const store: IStore<IPersistedAchievementState> = getStore("oni-achievements", {
        goalCounts: {},
        achievedIds: [],
    })

    const manager = new AchievementsManager(store)
    const renderer = new AchievementNotificationRenderer(overlays)

    manager.onAchievementAccomplished.subscribe(achievement => {
        renderer.showAchievement({
            title: achievement.name,
            description: achievement.description,
        })
    })

    manager.registerAchievement({
        uniqueId: "oni.achievement.welcome",
        name: "Welcome to Oni!",
        description: "Launch Oni for the first time",
        goals: [
            {
                name: "Launch Oni",
                goalId: "oni.goal.launch",
                count: 1,
            },
        ],
    })

    manager.registerAchievement({
        uniqueId: "oni.achievement.dedication",
        name: "Dedication",
        description: "Launch Oni 25 times",
        goals: [
            {
                name: "Launch Oni",
                goalId: "oni.goal.launch",
                count: 25,
            },
        ],
    })

    manager.start()
    _achievements = manager
}

export const getInstance = (): AchievementsManager => {
    return _achievements
}
