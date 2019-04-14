import * as React from "react"
import * as styles from "../styles"

interface MuteButtonProps {
	onClick: React.MouseEventHandler<HTMLDivElement>
}

export function MuteButton(props: MuteButtonProps) {
	return (
		<div onClick={props.onClick}>
			<svg
				viewBox="0 0 61 62"
				style={{
					height: 30 * styles.scale,
					width: 30 * styles.scale,
					margin: 10 * styles.scale,
				}}
			>
				<path d="M 5.9927e-08 16.8949L 5.9927e-08 45.1051L 12.7954 45.1051L 37.0194 62L 37.0194 2.08092e-07L 12.7954 16.8949L 5.9927e-08 16.8949ZM 15.4189 20.7914L 32.3066 9.00075L 32.3066 52.9992L 15.4189 41.2242C 15.1984 40.9797 14.9285 40.7839 14.6267 40.6496C 14.3249 40.5153 13.998 40.4456 13.6673 40.4449L 4.71285 40.4449L 4.71285 21.5706L 13.6673 21.5706C 13.9992 21.568 14.3268 21.4959 14.6287 21.3589C 14.9305 21.2219 15.1998 21.0232 15.4189 20.7758L 15.4189 20.7914Z" />
				<path
					style={{
						transform: "translate(39px, 20px)",
					}}
					d="M 17.7832 1.07019e-06L 10.5568 7.16943L 3.33042 1.07019e-06L 5.9927e-07 3.30417L 7.22637 10.4736L 5.9927e-07 17.643L 3.33042 20.9472L 10.5568 13.7778L 17.7832 20.9472L 21.1136 17.643L 13.8951 10.4736L 21.1136 3.30417L 17.7832 1.07019e-06Z"
				/>
			</svg>
		</div>
	)
}
