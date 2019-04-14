import Component from "reactive-magic/component"
import * as React from "react"
import { appState } from "../state"
import { InstructionsMenu } from "./InstructionsMenu"
import { PurchaseMenu } from "./PurchaseMenu"
import { AchievementsMenu } from "./AchievementsMenu"
import { StartMenu } from "./StartMenu"
import { PauseMenu } from "./PauseMenu"
import { GameOverMenu } from "./GameOverMenu"

export class GameMenu extends Component {
	view() {
		const {
			level,
			state,
			menuState,
			changeBallColor,
			changeRegionColor,
			fasterWalls,
			isolateMode,
		} = appState.get()

		if (menuState === "instruction") {
			return <InstructionsMenu />
		} else if (menuState === "purchase") {
			return <PurchaseMenu />
		} else if (menuState === "achievements") {
			return <AchievementsMenu />
		} else if (state === "start") {
			return <StartMenu />
		} else if (state === "pause") {
			return <PauseMenu />
		} else if (state === "gameover") {
			return <GameOverMenu />
		} else {
			return null
		}
	}
}
