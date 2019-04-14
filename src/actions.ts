import * as StartAudioContext from "startaudiocontext"
import * as Tone from "tone"
import * as React from "react"
import * as ReactDOM from "react-dom"
import * as _ from "lodash"
import { css } from "glamor"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
const Fragment = React.Fragment
import { StartMenu } from "./components/StartMenu"
import { PauseMenu } from "./components/PauseMenu"
import { PurchaseMenu } from "./components/PurchaseMenu"
import { AchievementsMenu } from "./components/AchievementsMenu"
import { InstructionsMenu } from "./components/InstructionsMenu"
import {
	Point,
	height,
	width,
	padding,
	config,
	appState,
	gameState,
	AppState,
	AchievementType,
	unlockLevels,
	getUnlockLevel,
	initialRegion,
	initialAppState,
	initialGameState,
	edge,
} from "./state"
import { area } from "./math"
import { saveStateNow } from "./persistence"
import { draw, loop } from "./game"

//////////////////////////////////////////////////////////////////////////
// Actions.
//////////////////////////////////////////////////////////////////////////

export function routeToMain() {
	appState.update(state => ({ ...state, menuState: "main" }))
}

export function routeToPurchase() {
	track("routeToPurchase")
	appState.update(state => ({ ...state, menuState: "purchase" }))
}

export function routeToAchievements() {
	track("routeToAchievements")
	appState.update(state => ({ ...state, menuState: "achievements" }))
}

export function routeToInstructions() {
	track("routeToInstructions")
	appState.update(state => ({ ...state, menuState: "instruction" }))
}

export function setMuted() {
	track("setMuted")
	appState.update(state => ({ ...state, mute: true }))
}

export function setUnmuted() {
	track("setUnmuted")
	appState.update(state => ({ ...state, mute: false }))
}

export function setGameMode(mode: AppState["mode"]) {
	appState.update(state => ({ ...state, mode }))
	track(`setMode`)
}

export function unlock(achievement: AchievementType) {
	if (!appState.get()[achievement]) {
		appState.update(state => ({
			...state,
			recentUnlock: [...state.recentUnlock, achievement],
		}))
	}
}

export async function handleUnlock(achievement: AchievementType) {
	track("clickUnlock")
	await showIncentivizedAd()
	appState.update(state => ({
		...state,
		[achievement]: true,
		recentUnlock: state.recentUnlock.filter(x => x !== achievement),
	}))
}

export function resetNewHighScore() {
	appState.update(state => ({
		...state,
		newHighScore: false,
	}))
}

export async function nextLevel() {
	setLevel(appState.get().level + 1)
	appState.update(state => ({ ...state, lives: state.lives + 1 }))
	const level = appState.get().level
	const achievement = unlockLevels[level]
	if (achievement) {
		unlock(achievement)
	}

	// Score accounts for negative lives
	const score = level
	if (score > appState.get().highScore) {
		appState.update(state => ({
			...state,
			newHighScore: true,
			highScore: score,
		}))
		track(`newHighScore`)
	}

	if (level === 5 && !appState.get().askedForRating) {
		askForRating()
	}

	track(`nextLevel`)
}

window["nextLevel"] = nextLevel

export function setLevel(level: number) {
	appState.update(state => ({
		...state,
		state: "start",
		level: level,
		percent: 0,
	}))
	gameState.mouse = { down: false }
	gameState.wall = undefined
	gameState.regions = [initialRegion]
	gameState.area = area(initialRegion)
	gameState.hold = false

	const nBalls = level + 1
	const minSpeed = Math.max(config.maxSpeed - level * 2, config.minSpeed)
	const maxSpeed = Math.min(level * 4, config.maxSpeed)
	const delta = maxSpeed - minSpeed
	gameState.balls = Array(nBalls)
		.fill(0)
		.map(() => {
			const vx = (Math.random() - 0.5) * 2
			const vy = (Math.random() - 0.5) * 2

			return {
				position: {
					x:
						Math.random() *
							(width - padding.left - padding.right - 2 * config.ballRadius) +
						padding.left +
						config.ballRadius,
					y:
						Math.random() *
							(height - padding.top - padding.bottom - 2 * config.ballRadius) +
						padding.top +
						config.ballRadius,
				},
				velocity: {
					x: vx > 0 ? vx * delta + minSpeed : vx * delta - minSpeed,
					y: vy > 0 ? vy * delta + minSpeed : vy * delta - minSpeed,
				},
			}
		})
	draw()
}

export function handlePlay() {
	resetNewHighScore()
	appState.update(state => ({ ...state, state: "play" }))
	if (!loop.looping) {
		requestAnimationFrame(loop)
	}
}

export function handleGameover() {
	appState.update(state => ({ ...state, state: "gameover" }))
	track("gameOver")
}

export function handleAppPause() {
	track("closeApp")
	handlePause()
}

export function handleAppResume() {
	track("resumeApp")
}

export function handleAppStart() {
	track("startApp")
}

export function handlePause() {
	appState.update(state => ({ ...state, state: "pause" }))
	track("pause")
}

export function handleRestart() {
	if (appState.get().level >= 2) {
		showInterstitialAd()
	}
	setLevel(1)
	appState.update(state => ({
		...state,
		lives: 1,
	}))
	track("restart")
}

window["handleRestart"] = handleRestart

export function handleToggleMute() {
	appState.update(state => ({
		...state,
		mute: !state.mute,
	}))

	if (!appState.get().mute) {
		ding(edge / 2)
	}
}

export async function handleContinue() {
	await showIncentivizedAd()
	gameState.wall = undefined
	gameState.hold = false
	appState.update(state => ({
		...state,
		lives: state.lives + 2,
	}))
	handlePlay()
	track("continue")
}

export function randomColor() {
	const r = Math.round(Math.random() * 255)
	const g = Math.round(Math.random() * 255)
	const b = Math.round(Math.random() * 255)
	return `rgb(${r}, ${g}, ${b})`
}

export async function handleChangeBallColor(color: string) {
	appState.update(state => ({
		...state,
		changeBallColor: true,
		spriteBallURI: undefined,
	}))
	await showIncentivizedAd()
	appState.update(state => ({ ...state, ballColor: color }))
	draw()
	track("changeBallColor")
}

export async function handleChangeRegionColor(color: string) {
	appState.update(state => ({
		...state,
		changeRegionColor: true,
	}))
	await showIncentivizedAd()
	appState.update(state => ({ ...state, regionColor: color }))
	draw()
	track("changeRegionColor")
}

export async function handleSaveSpriteBall(dataUrl: string) {
	appState.update(state => ({
		...state,
		spriteBallURI: dataUrl,
	}))
	draw()
	await showIncentivizedAd()
	track("saveSpriteBallURI")
}

// https://stackoverflow.com/questions/23945494/use-html5-to-resize-an-image-before-upload

export function processSprite(file: File) {
	let result: string | undefined

	// Ensure it's an image
	if (file.type.match(/image.*/)) {
		console.log("An image has been loaded")

		// Load the image
		const reader = new FileReader()
		reader.onload = function(readerEvent) {
			const image = new Image()

			image.onload = function(imageEvent) {
				// Resize the image
				const tmpCanvas = document.createElement("canvas")
				const size = config.ballRadius * 2 * config.imageRes
				tmpCanvas.width = size
				tmpCanvas.height = size
				const tmpContext = tmpCanvas.getContext("2d")
				if (tmpContext) {
					tmpContext.beginPath()
					tmpContext.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI, false)
					tmpContext.clip()

					if (image.width > image.height) {
						tmpContext.drawImage(
							image,
							0,
							0,
							size * image.width / image.height,
							size
						)
					} else {
						tmpContext.drawImage(
							image,
							0,
							0,
							size,
							size * image.height / image.width
						)
					}
					var dataUrl = tmpCanvas.toDataURL("image/png")
					result = dataUrl
				}
			}
			const target = readerEvent.target as any
			image.src = target.result
		}
		reader.readAsDataURL(file)
	}

	return result
}

//////////////////////////////////////////////////////////////////////////
// Advertising.
//////////////////////////////////////////////////////////////////////////

document.addEventListener(
	"deviceready",
	function() {
		_initAds()
	},
	false
)

function _initAds() {
	if (window["HeyzapAds"]) {
		return window["HeyzapAds"]
			.start("68d71ea08a97d74211dd60d16536d6a5")
			.catch(console.error)
	}
}

const initAds = _.once(_initAds)

export async function showInterstitialAd() {
	if (appState.get().noAds) {
		track("noShowInterstitialAd")
		return
	}
	const HeyzapAds = window["HeyzapAds"]
	if (HeyzapAds) {
		await initAds()

		let handleFinished: any
		const promise = new Promise(resolve => {
			handleFinished = resolve
		})

		HeyzapAds.InterstitialAd.addEventListener(
			HeyzapAds.InterstitialAd.Events.HIDE,
			handleFinished
		)
		HeyzapAds.InterstitialAd.addEventListener(
			HeyzapAds.InterstitialAd.Events.SHOW_FAILED,
			handleFinished
		)
		HeyzapAds.InterstitialAd.addEventListener(
			HeyzapAds.InterstitialAd.Events.FETCH_FAILED,
			handleFinished
		)
		try {
			track("showInterstitialAd")
			await HeyzapAds.InterstitialAd.show()
		} catch (error) {
			console.error(error)
		}
		await handleFinished
	}
}

window["showInterstitialAd"] = showInterstitialAd

export async function showIncentivizedAd() {
	if (appState.get().noAds) {
		track("noShowIncentivizedAd")
		return
	}
	const HeyzapAds = window["HeyzapAds"]
	if (HeyzapAds) {
		await initAds()

		let handleFinished: any
		const promise = new Promise(resolve => {
			handleFinished = resolve
		})

		HeyzapAds.IncentivizedAd.addEventListener(
			HeyzapAds.IncentivizedAd.Events.HIDE,
			handleFinished
		)
		HeyzapAds.IncentivizedAd.addEventListener(
			HeyzapAds.IncentivizedAd.Events.SHOW_FAILED,
			handleFinished
		)
		HeyzapAds.IncentivizedAd.addEventListener(
			HeyzapAds.IncentivizedAd.Events.FETCH_FAILED,
			handleFinished
		)
		try {
			track("showIncentivizedAd")
			await HeyzapAds.IncentivizedAd.show()
		} catch (error) {
			console.error(error)
		}
		await handleFinished
	}
}

window["showIncentivizedAd"] = showIncentivizedAd

export async function showVideoAd() {
	if (appState.get().noAds) {
		track("noShowVideoAd")
		return
	}
	const HeyzapAds = window["HeyzapAds"]
	if (HeyzapAds) {
		await initAds()

		let handleFinished: any
		const promise = new Promise(resolve => {
			handleFinished = resolve
		})

		HeyzapAds.VideoAd.addEventListener(
			HeyzapAds.VideoAd.Events.HIDE,
			handleFinished
		)
		HeyzapAds.VideoAd.addEventListener(
			HeyzapAds.VideoAd.Events.SHOW_FAILED,
			handleFinished
		)
		HeyzapAds.VideoAd.addEventListener(
			HeyzapAds.VideoAd.Events.FETCH_FAILED,
			handleFinished
		)
		try {
			track("showVideoAd")
			await HeyzapAds.VideoAd.show()
		} catch (error) {
			console.error(error)
		}
		await handleFinished
	}
}

window["showVideoAd"] = showVideoAd

//////////////////////////////////////////////////////////////////////////
// In App Purchase.
//////////////////////////////////////////////////////////////////////////

const productId = "chetball.noads"

export async function handlePurchaseNoAds() {
	const inAppPurchase = window["inAppPurchase"]
	if (inAppPurchase) {
		try {
			await initProducts()
			await inAppPurchase.buy(productId)
			track("purchaseNoAds")
			appState.update(state => ({
				...state,
				noAds: true,
			}))
			saveStateNow()
		} catch (error) {
			console.error(error)
		}
	}
}

export async function initProducts() {
	const inAppPurchase = window["inAppPurchase"]
	if (inAppPurchase) {
		try {
			await inAppPurchase.getProducts([productId])
		} catch (error) {
			console.error(error)
		}
	}
}

export async function handleRestorePurchases() {
	const inAppPurchase = window["inAppPurchase"]
	if (inAppPurchase) {
		try {
			const purchases = await inAppPurchase.restorePurchases()
			for (const purchase of purchases) {
				if (purchase.productId === productId) {
					track("restoreNoAds")
					appState.update(state => ({
						...state,
						noAds: true,
					}))
				}
			}
		} catch (error) {
			console.error(error)
		}
	}
}

//////////////////////////////////////////////////////////////////////////
// App Rating
//////////////////////////////////////////////////////////////////////////

export function askForRating() {
	const appRate = window["AppRate"] as any
	if (!appRate) {
		return
	}

	appRate.preferences.storeAppURL = {
		ios: "1350257118",
		android: "market://details?id=chetball.id",
		windows: "",
		blackberry: "",
		windows8: "",
	}

	if (appState.get().askedForRating) {
		return
	} else {
		appState.update(state => ({
			...state,
			askedForRating: true,
		}))
	}
	appRate.promptForRating()
	track("askForRating")
}

//////////////////////////////////////////////////////////////////////////
// Vibrate
//////////////////////////////////////////////////////////////////////////

export function buzz() {
	const device = window["device"] as any
	if (device) {
		if (device.platform === "Android") {
			if (navigator.vibrate) {
				navigator.vibrate(50)
			}
		} else {
			const engine = window["TapticEngine"] as any
			if (engine) {
				engine.unofficial.weakBoom()
			}
		}
	}
}

export function burst() {
	const device = window["device"] as any
	if (device) {
		if (device.platform === "Android") {
			if (navigator.vibrate) {
				navigator.vibrate([50, 20, 50, 20, 50])
			}
		} else {
			const engine = window["TapticEngine"] as any
			if (engine) {
				engine.unofficial.burst()
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////
// Sound
//////////////////////////////////////////////////////////////////////////

StartAudioContext(Tone.context, "body")

const freeverb = new Tone.Freeverb({
	roomSize: 0.5,
	dampening: 300,
}).toMaster()

var filter = new Tone.AutoFilter({
	frequency: 2,
	depth: 0.6,
}).connect(freeverb)

var synth = new Tone.PolySynth(20, Tone.Synth).connect(filter)

// lydian
const cMajorOctave = ["C", "E", "G", "B"]
const cMajorScale: Array<string> = []
for (let octave = 4; octave < 7; octave++) {
	for (const note of cMajorOctave) {
		cMajorScale.push(note + octave.toString())
	}
}

export function ding(length: number) {
	if (appState.get().mute || !appState.get().unlockSound) {
		return
	}
	const index = Math.floor(length / edge * cMajorScale.length)
	synth.triggerAttackRelease(cMajorScale[cMajorScale.length - 1 - index], 0.1)
}

export function track(event: string) {
	const amplitude = window["amplitude"]
	if (amplitude) {
		const device = window["device"] as any
		if (device) {
			const data = {
				device_platform: device.platform,
				device_model: device.model,
				device_uuid: device.uuid,
				...appState.get(),
			}
			amplitude.getInstance().logEvent(event, data)
		}
	}
}
