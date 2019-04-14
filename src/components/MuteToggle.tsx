import * as React from "react"
import Component from "reactive-magic/component"
import { appState } from "../state"

import { MuteButton } from "./MuteButton"
import { UnmuteButton } from "./UnmuteButton"

import { setUnmuted, setMuted } from "../actions"

export class MuteToggle extends Component {
	view() {
		return appState.get().mute ? (
			<MuteButton onClick={setUnmuted} />
		) : (
			<UnmuteButton onClick={setMuted} />
		)
	}
}
