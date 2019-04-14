import * as React from "react"
import * as ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { Menu } from "./Menu"
import { GameMode } from "./GameModeSection"
import * as styles from "../styles"

import * as instruction1 from "file-loader!../instruction1.png"
import * as instruction2 from "file-loader!../instruction2.png"

import { appState } from "../state"
import { routeToMain } from "../actions"

import { BackButton } from "./BackButton"

const Fragment = React.Fragment

export class InstructionsMenu extends Component {
	didMount() {
		const elm = document.getElementById("menu") as any
		if (elm) {
			const style = elm.getAttribute("style")
			const tmpStyle = style.replace("overflow-y: auto", "overflow-y: none")
			elm.style = tmpStyle
			setTimeout(() => {
				elm.style = style
			}, 10)
		}
	}

	view() {
		let modeInstruction: React.ReactNode
		if (appState.get().isolateMode) {
			modeInstruction = (
				<Fragment>
					<p>
						In area mode, when 75% of the map are empty regions, you'll go to
						the next level.
					</p>
					<p>
						In isloation mode, when 75% of the map are empty regions, you'll go
						to the next level.
					</p>
				</Fragment>
			)
		} else {
			modeInstruction = (
				<p>
					When 75% of the map are empty regions, you'll go to the next level.
				</p>
			)
		}

		return (
			<Menu marginTop={`10vh`}>
				<BackButton />
				<div style={{ padding: 30 }}>
					<p>
						Touch inside a white region. Drag in a direction to aim a wall.{" "}
					</p>
					<p style={{ textAlign: "center" }}>
						<img src={instruction1} style={{ maxWidth: "50%" }} />
					</p>
					<p>When you let go, the wall will begin drawing.</p>
					<p>If a ball hits the wall while its drawing, you'll lose a life.</p>
					<p style={{ textAlign: "center" }}>
						<img src={instruction2} style={{ maxWidth: "50%" }} />
					</p>
					{modeInstruction}
				</div>
			</Menu>
		)
	}
}
