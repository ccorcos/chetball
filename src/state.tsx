import * as StartAudioContext from "startaudiocontext"
import * as Tone from "tone"
import * as _ from "lodash"
import { Value } from "reactive-magic"
import * as styles from "./styles"

//////////////////////////////////////////////////////////////////////////
// State.
//////////////////////////////////////////////////////////////////////////

export interface Point {
	x: number
	y: number
}

export interface MouseDownState {
	down: true
	start: Point
	current: Point
}

export interface MouseUpState {
	down: false
}

export interface WallState {
	// The directions from the mouse
	origin: Point
	direction: Point
	// The progress of the walls getting built.
	left: Point
	right: Point
}

export interface Ball {
	position: Point
	velocity: Point
}

export type Segment = [Point, Point]

// Clockwise list of points describing a convex region.
export type Region = Array<Point>

export type AchievementType =
	| "changeBallColor"
	| "changeRegionColor"
	| "fasterWalls"
	| "isolateMode"
	| "spriteBall"
	| "unlockSound"

export interface AppState {
	state: "start" | "pause" | "play" | "gameover"
	level: number
	lives: number

	// Normal Mode
	percent: number
	// Iso Mode
	isolated: number

	// achievements
	changeBallColor: boolean
	ballColor: string

	changeRegionColor: boolean
	regionColor: string

	fasterWalls: boolean

	isolateMode: boolean
	mode: "normal" | "isolate"

	noAds: boolean

	recentUnlock: Array<AchievementType>
	menuState: "main" | "instruction" | "purchase" | "achievements"

	highScore: number
	newHighScore: boolean

	askedForRating: boolean

	spriteBall: boolean
	spriteBallURI: string | undefined

	unlockSound: boolean
	mute: boolean
}

export interface GameState {
	regions: Array<Region>
	balls: Array<Ball>
	mouse: MouseUpState | MouseDownState
	wall: WallState | undefined
	area: number
	hold?: boolean
}

export const padding = {
	top: 20,
	bottom: 60 * styles.scale,
	left: 20,
	right: 20,
}

export const height = window.innerHeight - 10 // prevent weird scroll issue on iOS
export const width = window.innerWidth

export const edge = Math.max(width, height) // 1440

export const config = {
	initialBalls: 20,
	ballRadius: 10,
	wallSpeed: edge / 120 / 2, // 6
	maxSpeed: edge / 180 / 2,
	minSpeed: edge / 360 / 2 / 2,
	imageRes: 4,
}

export const initialRegion = [
	{ x: padding.left, y: padding.top },
	{ x: width - padding.right, y: padding.top },
	{ x: width - padding.right, y: height - padding.bottom },
	{ x: padding.left, y: height - padding.bottom },
]

export const initialAppState: AppState = {
	state: "start",
	level: 1,
	lives: 1,
	percent: 0,
	isolated: 0,

	changeBallColor: false,
	ballColor: "#000000",

	changeRegionColor: false,
	regionColor: "#000000",

	fasterWalls: false,

	isolateMode: false,
	mode: "normal",

	noAds: false,

	recentUnlock: [],
	menuState: "main",

	highScore: 1,
	newHighScore: false,

	askedForRating: false,

	spriteBall: false,
	spriteBallURI: undefined,

	unlockSound: false,
	mute: false,
}

export const appState = new Value<AppState>(_.cloneDeep(initialAppState))

export const initialGameState: GameState = {
	balls: [],
	mouse: { down: false },
	wall: undefined,
	regions: [],
	area: 0,
}

export const gameState: GameState = _.cloneDeep(initialGameState)

export const unlockLevels: { [key: number]: AchievementType | undefined } = {
	3: "changeBallColor" as "changeBallColor",
	5: "changeRegionColor" as "changeRegionColor",
	7: "unlockSound" as "unlockSound",
	9: "fasterWalls" as "fasterWalls",
	11: "isolateMode" as "isolateMode",
	13: "spriteBall" as "spriteBall",
}

export function getUnlockLevel(achievement: AchievementType) {
	for (const key in unlockLevels) {
		if (unlockLevels[key] === achievement) {
			return parseInt(key)
		}
	}
}
