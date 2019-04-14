import * as React from "react"
import { MuteToggle } from "./MuteToggle"
import Component from "reactive-magic/component"
import { appState } from "../state"

export class MuteHeaderToggle extends Component {
	view() {
		if (!appState.get().unlockSound) {
			return null
		}
		return (
			<div style={{ position: "absolute", top: 0, left: 0 }}>
				<MuteToggle />
			</div>
		)
	}
}
