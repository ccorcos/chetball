import * as _ from "lodash"
import {
	GameState,
	AppState,
	gameState,
	appState,
	Point,
	initialRegion,
	initialAppState,
	initialGameState,
} from "./state"
import { draw, loop } from "./game"
import { setLevel } from "./actions"

//////////////////////////////////////////////////////////////////////////
// Load State.
//////////////////////////////////////////////////////////////////////////

const result = localStorage.getItem("state")
export function loadState() {
	if (result) {
		// Load the previous state.
		const parsed = JSON.parse(result) as {
			gameState: GameState
			appState: AppState
		}
		_.assign(gameState, parsed.gameState)
		appState.set(parsed.appState)

		// Migrations
		const oldGameState = gameState as any
		let oldAppState = appState.get() as any

		// Migrate lives from GameState to AppState
		if ("lives" in oldGameState) {
			appState.update(state => ({ ...state, lives: oldGameState.lives }))
			delete oldGameState.lives
		}
		// Migrate percent to AppState
		if (!("percent" in oldAppState)) {
			appState.update(state => ({ ...state, percent: 0 }))
			oldAppState = appState.get()
		}

		gameState.hold = false

		// Migrate achievements
		if (!("changeBallColor" in oldAppState)) {
			appState.update(state => ({
				...state,
				changeBallColor: false,
				ballColor: "#000000",

				changeRegionColor: false,
				regionColor: "#000000",

				fasterWalls: false,
				isolateMode: false,

				mode: "normal",
				isolated: 0,

				noAds: false,
			}))
			oldAppState = appState.get()
		}

		if (!("recentUnlock" in oldAppState)) {
			appState.update(state => ({
				...state,
				recentUnlock: [],
				menuState: "main",
				highScore: 1,
				newHighScore: false,
				askedForRating: false,
				spriteBall: false,
				spriteBallURI: undefined,
				mute: false,
				unlockSound: false,
			}))
			oldAppState = appState.get()
		}

		// Check if the game region has changed, restart the level.
		let topLeft: Point | undefined
		let bottomRight: Point | undefined
		for (const region of parsed.gameState.regions) {
			for (const point of region) {
				if (!topLeft) {
					topLeft = point
				}
				if (!bottomRight) {
					bottomRight = point
				}
				if (topLeft.x > point.x) {
					topLeft = point
				}
				if (topLeft.y > point.y) {
					topLeft = point
				}
				if (bottomRight.x < point.x) {
					bottomRight = point
				}
				if (bottomRight.y < point.y) {
					bottomRight = point
				}
			}
		}
		if (
			!_.isEqual(initialRegion[0], topLeft) ||
			!_.isEqual(initialRegion[2], bottomRight)
		) {
			setLevel(appState.get().level)
		}

		if (appState.get().state === "pause") {
			// Draw the initial state so you know what you're resuming
			requestAnimationFrame(draw)
		}

		if (appState.get().state === "play") {
			requestAnimationFrame(loop)
		}
	} else {
		setLevel(1)
	}
}

export function reset() {
	appState.set(_.cloneDeep(initialAppState))
	_.assign(gameState, _.cloneDeep(initialGameState))
	setLevel(1)
}

window["reset"] = reset

export function saveStateNow() {
	localStorage.setItem(
		"state",
		JSON.stringify({ gameState, appState: appState.get() })
	)
}

export const saveState = _.throttle(saveStateNow, 1000)

window["gameState"] = gameState
window["appState"] = appState
