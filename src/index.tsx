import * as React from "react"
import * as ReactDOM from "react-dom"
import { css } from "glamor"
import { loadState } from "./persistence"
import { GameMenu } from "./components/GameMenu"
import { GameInfo } from "./components/GameInfo"
import { padding } from "./state"
import { handleAppPause, handleAppResume, handleAppStart } from "./actions"

loadState()

css.global("html, body", {
	padding: 0,
	margin: 0,
	userSelect: "none",
	overflow: "hidden",
	WebkitTapHighlightColor: "rgba(0,0,0,0)",
	fontFamily: "-apple-system, system-ui",
})

//////////////////////////////////////////////////////////////////////////
// Start Menu.
//////////////////////////////////////////////////////////////////////////

const gameInfoClass = css({
	position: "absolute",
	bottom: 0,
	left: 0,
	right: 0,
	height: padding.bottom,
	pointerEvents: "none",
})

const gameInfoDiv = document.createElement("div")
gameInfoDiv.className = gameInfoClass.toString()
document.body.appendChild(gameInfoDiv)

ReactDOM.render(<GameInfo />, gameInfoDiv)

const gameMenuClass = css({
	position: "absolute",
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	pointerEvents: "none",
})

const gameMenuDiv = document.createElement("div")
gameMenuDiv.className = gameMenuClass.toString()
document.body.appendChild(gameMenuDiv)

ReactDOM.render(<GameMenu />, gameMenuDiv)

// Important for Android
document.addEventListener("pause", handleAppPause, false)
document.addEventListener("resume", handleAppResume, false)
document.addEventListener("deviceready", handleAppStart, false)
