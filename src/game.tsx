import * as _ from "lodash"
import {
	padding,
	height,
	width,
	Point,
	appState,
	gameState,
	Region,
	Segment,
	Ball,
	config,
	getUnlockLevel,
} from "./state"
import { saveState } from "./persistence"
import {
	inside,
	rot,
	dot,
	l2,
	diff,
	dir,
	add,
	mult,
	sign,
	intersection,
	area,
} from "./math"
import { nextLevel, handleGameover, burst, ding, buzz } from "./actions"
import * as styles from "./styles"

const HOLD_TIME = 500

const canvas = document.createElement("canvas")
document.body.appendChild(canvas)

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
if (!ctx) {
	throw new Error("Fuck")
}

const scale = window.devicePixelRatio
canvas.width = width * scale
canvas.height = height * scale
canvas.style.width = `${width}px`
canvas.style.height = `${height}px`
ctx.scale(scale, scale)

//////////////////////////////////////////////////////////////////////////
// Drawing Helpers
//////////////////////////////////////////////////////////////////////////

function clear() {
	ctx.clearRect(0, 0, width, height)
}

function circle(args: { x: number; y: number; r: number; fill: string }) {
	ctx.beginPath()
	ctx.arc(args.x, args.y, args.r, 0, 2 * Math.PI, false)
	ctx.fillStyle = args.fill
	ctx.fill()
}

function text(args: { string: string; x: number; y: number }) {
	ctx.font = "14px -apple-system, system-ui"
	ctx.fillText(args.string, args.x, args.y)
}

function line(args: { start: Point; end: Point; stroke: string }) {
	ctx.beginPath()
	ctx.moveTo(args.start.x, args.start.y)
	ctx.lineTo(args.end.x, args.end.y)
	ctx.strokeStyle = args.stroke
	ctx.stroke()
}

//////////////////////////////////////////////////////////////////////////
// Touch Interactions.
//////////////////////////////////////////////////////////////////////////

function down(point: Point) {
	const insideOpenRegion = gameState.regions.some(region => {
		return inside(point, region) && !isClosed(region)
	})
	if (!gameState.wall && insideOpenRegion) {
		gameState.mouse = {
			down: true,
			start: point,
			current: point,
		}
	} else {
		gameState.mouse = { down: false }
	}
}

function move(point: Point) {
	if (gameState.mouse.down && !gameState.wall) {
		gameState.mouse = {
			...gameState.mouse,
			current: point,
		}
	} else {
		gameState.mouse = { down: false }
	}
}

function up() {
	if (gameState.mouse.down && !gameState.wall) {
		if (!_.isEqual(gameState.mouse.start, gameState.mouse.current)) {
			gameState.wall = {
				origin: gameState.mouse.start,
				direction: dir(gameState.mouse.start, gameState.mouse.current),
				left: gameState.mouse.start,
				right: gameState.mouse.start,
			}
		}
		gameState.mouse = {
			down: false,
		}
	} else {
		gameState.mouse = { down: false }
	}
}

canvas.addEventListener("mousedown", event => {
	down({
		x: event.pageX - canvas.offsetLeft,
		y: event.pageY - canvas.offsetTop,
	})
})

canvas.addEventListener("mousemove", event => {
	move({
		x: event.pageX - canvas.offsetLeft,
		y: event.pageY - canvas.offsetTop,
	})
})

canvas.addEventListener("mouseup", event => {
	up()
})

canvas.addEventListener("touchstart", event => {
	down({
		x: event.touches[0].pageX - canvas.offsetLeft,
		y: event.touches[0].pageY - canvas.offsetTop,
	})
})

canvas.addEventListener("touchmove", event => {
	move({
		x: event.touches[0].pageX - canvas.offsetLeft,
		y: event.touches[0].pageY - canvas.offsetTop,
	})
})

canvas.addEventListener("touchend", event => {
	up()
})

// Now you never really need to save manually1
window.addEventListener("click", event => {
	saveState()
})

//////////////////////////////////////////////////////////////////////////
// Calculations.
//////////////////////////////////////////////////////////////////////////

function isClosed(region: Region) {
	for (const ball of gameState.balls) {
		if (inside(ball.position, region)) {
			return false
		}
	}
	return true
}

function hit(ball: Ball, wall: Segment) {
	const [left, right] = wall
	const direction = dir(left, right)
	// Orthoganol direction to the wall
	const orth = rot(direction, 90)
	// Vector to a point on the wall.
	const leftVec = diff(left, ball.position)
	// Orthoganol distance to the wall.
	const dist = dot(orth, leftVec)
	// Check if ball lays along the line.
	if (Math.abs(dist) < config.ballRadius) {
		// Check if the ball is within range of the wall.
		const wallSize = l2(diff(left, right))
		const leftDist = l2(diff(ball.position, left)) - config.ballRadius
		const rightDist = l2(diff(ball.position, right)) - config.ballRadius
		// If the distance to either end of the wall is greater than the wall size,
		// then the ball is outside of the part that's drawn.
		if (leftDist < wallSize && rightDist < wallSize) {
			return true
		}
	}
	return false
}

function bounce(ball: Ball, wall: Segment) {
	const [left, right] = wall

	// The direction of the wall. A unit vector from one end to the other.
	const direction = dir(left, right)
	// Orthoganol direction to the wall
	const orth = rot(direction, 90)
	// Vector to a point on the wall.
	const leftVec = diff(left, ball.position)
	// Orthoganol distance to the wall.
	const dist = dot(orth, leftVec)
	// Check if ball lays along the line.
	if (Math.abs(dist) < config.ballRadius) {
		// Check if the ball is within range of the wall.
		const wallSize = l2(diff(left, right))
		const leftDist = l2(diff(ball.position, left)) - config.ballRadius
		const rightDist = l2(diff(ball.position, right)) - config.ballRadius
		// If the distance to either end of the wall is greater than the wall size,
		// then the ball is outside of the part that's drawn.
		if (leftDist < wallSize && rightDist < wallSize) {
			// TODO: polish.
			// Reflex the ball in the direction of the velocity vector, not the orth.

			// Move the ball back to the point where its just touching the wall.
			ball.position = add(
				ball.position,
				mult(orth, sign(dist) * (Math.abs(dist) - config.ballRadius))
			)
			// Reflex the velocity based on the angle to the wall.
			// https://math.stackexchange.com/questions/13261/how-to-get-a-reflection-vector
			ball.velocity = diff(
				ball.velocity,
				mult(orth, 2 * dot(orth, ball.velocity))
			)

			// Make a noise based on the length of the surface
			ding(l2(diff(left, right)))
		}
	}
}

function getRegionSegments(region: Region) {
	const segments: Array<Segment> = []
	for (let i = 0; i < region.length; i++) {
		const left = region[i]
		const right = region[(i + 1) % region.length]
		segments.push([left, right])
	}
	return segments
}

//////////////////////////////////////////////////////////////////////////
// Update.
//////////////////////////////////////////////////////////////////////////

function update() {
	// Grow all incomplete walls

	if (gameState.wall) {
		const boostSpeed = appState.get().fasterWalls
			? Math.max(appState.get().level, getUnlockLevel("fasterWalls") || 0)
			: appState.get().level
		const wallSpeed = config.wallSpeed + boostSpeed

		// Grow the left and the right.
		gameState.wall.left = {
			x: gameState.wall.left.x - gameState.wall.direction.x * wallSpeed,
			y: gameState.wall.left.y - gameState.wall.direction.y * wallSpeed,
		}
		gameState.wall.right = {
			x: gameState.wall.right.x + gameState.wall.direction.x * wallSpeed,
			y: gameState.wall.right.y + gameState.wall.direction.y * wallSpeed,
		}

		// Check for intersections with regions.
		for (const region of gameState.regions) {
			if (inside(gameState.wall.origin, region)) {
				const segments = getRegionSegments(region)
				let leftIntersectSegment: Segment | undefined
				let leftIntersectPoint: Point | undefined
				let rightIntersectSegment: Segment | undefined
				let rightIntersectPoint: Point | undefined
				for (const segment of segments) {
					const rightIntersect = intersection(
						[gameState.wall.origin, gameState.wall.right],
						segment
					)
					if (rightIntersect.intersectionPoint && rightIntersect.overlap) {
						gameState.wall.right = rightIntersect.intersectionPoint
						rightIntersectPoint = rightIntersect.intersectionPoint
						rightIntersectSegment = segment
					}
					const leftIntersect = intersection(
						[gameState.wall.origin, gameState.wall.left],
						segment
					)
					if (leftIntersect.intersectionPoint && leftIntersect.overlap) {
						gameState.wall.left = leftIntersect.intersectionPoint
						leftIntersectPoint = leftIntersect.intersectionPoint
						leftIntersectSegment = segment
					}
				}

				if (
					leftIntersectSegment &&
					leftIntersectPoint &&
					rightIntersectSegment &&
					rightIntersectPoint
				) {
					// Split the region in two.
					const leftRegion: Array<Point> = [leftIntersectPoint]
					// Find the point at the end of the leftIntersectSegment.
					for (let i = 0; i < region.length; i++) {
						const point = region[i]
						if (_.isEqual(point, leftIntersectSegment[1])) {
							// Go around the region until you find the point at the
							// beginning of the rightIntersectSegment.
							while (true) {
								const nextPoint = region[i]
								leftRegion.push(nextPoint)
								if (_.isEqual(nextPoint, rightIntersectSegment[0])) {
									break
								}
								i = (i + 1) % region.length
							}
							// Complete the region.
							leftRegion.push(rightIntersectPoint)
							break
						}
					}

					// Split the region in two.
					const rightRegion: Array<Point> = [rightIntersectPoint]
					// Find the point at the end of the rightIntersectSegment.
					for (let i = 0; i < region.length; i++) {
						const point = region[i]
						if (_.isEqual(point, rightIntersectSegment[1])) {
							// Go around the region until you find the point at the
							// beginning of the leftIntersectSegment.
							while (true) {
								const nextPoint = region[i]
								rightRegion.push(nextPoint)
								if (_.isEqual(nextPoint, leftIntersectSegment[0])) {
									break
								}
								i = (i + 1) % region.length
							}
							// Complete the region.
							rightRegion.push(leftIntersectPoint)
							break
						}
					}

					// Remove this region.
					gameState.regions = gameState.regions.filter(r => r !== region)
					// Add its two subregions.
					gameState.regions.push(leftRegion)
					gameState.regions.push(rightRegion)
					// Clear the wall.
					buzz()
					gameState.wall = undefined
					break
				}
			}
		}
	}

	for (const ball of gameState.balls) {
		// Update position.
		ball.position.x += ball.velocity.x
		ball.position.y += ball.velocity.y

		// Bounce off any regions.
		for (const region of gameState.regions) {
			if (inside(ball.position, region)) {
				for (let i = 0; i < region.length; i++) {
					const left = region[i]
					const right = region[(i + 1) % region.length]
					bounce(ball, [left, right])
				}
			}
		}

		// Bounce off any walls.
		if (gameState.wall) {
			if (hit(ball, [gameState.wall.left, gameState.wall.right])) {
				gameState.hold = true
				burst()
				setTimeout(() => {
					appState.update(state => ({
						...state,
						lives: state.lives - 1,
					}))
					if (appState.get().lives <= 0) {
						handleGameover()
						gameState.hold = false
					} else {
						gameState.wall = undefined
						gameState.hold = false
						loop()
					}
				}, HOLD_TIME)
			}
		}
	}

	if (appState.get().mode === "normal") {
		let complete = 0
		for (const region of gameState.regions) {
			if (isClosed(region)) {
				complete += area(region)
			}
		}
		const percent = Math.round(complete / gameState.area * 100)
		if (appState.get().percent !== percent) {
			appState.update(state => ({ ...state, percent }))
		}

		if (percent > 75) {
			nextLevel()
		}
	} else {
		let isolated = 0
		for (const region of gameState.regions) {
			let count = 0
			for (const ball of gameState.balls) {
				if (inside(ball.position, region)) {
					count++
				}
			}
			if (count === 1) {
				isolated++
			}
		}

		if (appState.get().isolated !== isolated) {
			appState.update(state => ({ ...state, isolated }))
		}

		if (isolated === gameState.balls.length) {
			nextLevel()
		}
	}
}

//////////////////////////////////////////////////////////////////////////
// Draw
//////////////////////////////////////////////////////////////////////////

export function draw() {
	clear()

	for (const region of gameState.regions) {
		ctx.beginPath()
		const [first, ...rest] = region
		ctx.moveTo(first.x, first.y)
		for (const point of rest) {
			ctx.lineTo(point.x, point.y)
		}
		ctx.lineTo(first.x, first.y)
		if (isClosed(region)) {
			ctx.fillStyle = appState.get().regionColor
			ctx.fill()
		}
		ctx.strokeStyle = appState.get().regionColor
		ctx.stroke()
	}

	const { spriteBallURI } = appState.get()
	if (spriteBallURI) {
		const image = new Image()
		// image.onload = function() {
		//   ctx.drawImage(image, 0, 0);
		// };
		image.src = spriteBallURI
		for (const ball of gameState.balls) {
			ctx.drawImage(
				image,
				ball.position.x - config.ballRadius,
				ball.position.y - config.ballRadius,
				image.width / config.imageRes,
				image.height / config.imageRes
			)
		}
	} else {
		for (const ball of gameState.balls) {
			circle({
				x: ball.position.x + 0,
				y: ball.position.y + 0,
				r: config.ballRadius,
				fill: gameState.hold ? styles.red : appState.get().ballColor,
			})
		}
	}

	if (gameState.mouse.down) {
		const start = add(
			gameState.mouse.start,
			rot(diff(gameState.mouse.current, gameState.mouse.start), 180)
		)
		const end = gameState.mouse.current
		line({ start, end, stroke: appState.get().ballColor })
	}

	const wall = gameState.wall
	if (wall) {
		line({
			start: wall.left,
			end: wall.right,
			stroke: gameState.hold ? styles.red : appState.get().regionColor,
		})
	}
}

//////////////////////////////////////////////////////////////////////////
// Loop
//////////////////////////////////////////////////////////////////////////

interface Loop {
	(): void
	looping?: boolean
}

export const loop: Loop = () => {
	loop.looping = true

	update()
	if (!gameState.hold) {
		update()
	}
	draw()
	saveState()
	if (gameState.hold) {
		loop.looping = false
		return
	}
	if (appState.get().state === "play") {
		requestAnimationFrame(loop)
	} else if (appState.get().state === "start" && appState.get().level > 1) {
		requestAnimationFrame(loop)
	} else {
		loop.looping = false
	}
}
