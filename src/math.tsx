import * as _ from "lodash"
import { Point, Segment, Region } from "./state"

//////////////////////////////////////////////////////////////////////////
// Vector Math.
//////////////////////////////////////////////////////////////////////////

export function diff(p1: Point, p2: Point) {
	return { x: p1.x - p2.x, y: p1.y - p2.y }
}

export function add(p1: Point, p2: Point) {
	return { x: p1.x + p2.x, y: p1.y + p2.y }
}

export function mult(p1: Point, x: number) {
	return { x: p1.x * x, y: p1.y * x }
}

export function l2(p: Point) {
	return Math.sqrt(p.x * p.x + p.y * p.y)
}

export function norm(p: Point) {
	const d = l2(p)
	return { x: p.x / d, y: p.y / d }
}

export function dir(p1: Point, p2: Point) {
	return norm(diff(p1, p2))
}

export function dot(p1: Point, p2: Point) {
	return p1.x * p2.x + p1.y * p2.y
}

export function cross(p1: Point, p2: Point) {
	return p1.x * p2.y - p1.y * p2.x
}

interface IntersectionResult {
	intersectionPoint: Point | undefined
	overlap: boolean
}

export function intersection(
	line1: Segment,
	line2: Segment
): IntersectionResult {
	// https://stackoverflow.com/a/565282/1191551
	// p + t r = q + u s
	// u = (q − p) × r / (r × s)
	// t = (q − p) × s / (r × s)

	// p
	const l1Origin = line1[0]
	// r
	const l1Vector = diff(line1[1], line1[0])
	// q
	const l2Origin = line2[0]
	// s
	const l2Vector = diff(line2[1], line2[0])

	const denomenator = cross(l1Vector, l2Vector)
	if (denomenator === 0) {
		// Lines are parallel
		return { intersectionPoint: undefined, overlap: false }
	}

	const l1VectorScale = cross(diff(l2Origin, l1Origin), l2Vector) / denomenator
	const l2VectorScale = cross(diff(l2Origin, l1Origin), l1Vector) / denomenator
	const intersectionPoint = add(l1Origin, mult(l1Vector, l1VectorScale))
	// The decimal is to account for floating point approximation.
	const overlap =
		l1VectorScale >= -0.00000001 &&
		l1VectorScale <= 1.00000001 &&
		l2VectorScale >= -0.00000001 &&
		l2VectorScale <= 1.00000001
	return { intersectionPoint, overlap }
}

export function rot(p1: Point, deg: number) {
	const a = Math.PI * deg / 180
	return {
		x: p1.x * Math.cos(a) - p1.y * Math.sin(a),
		y: p1.x * Math.sin(a) + p1.y * Math.cos(a),
	}
}

export function sign(n: number) {
	return n / Math.abs(n)
}

export function inside(point: Point, region: Region) {
	const segments = getRegionSegments(region)
	for (let [left, right] of segments) {
		const direction = dir(left, right)
		const orth = rot(direction, 90)
		const leftVec = diff(left, point)
		const orthDist = dot(orth, leftVec)
		if (orthDist < 0) {
			return false
		}
	}
	return true
}

export function area(region: Region) {
	// Use the determinant!
	// http://www.mathwords.com/a/area_convex_polygon.htm
	// ((x1*y2 + x2*y3 + ... + xn*y1) - (y1*x2 + y2*x3 + ... + yn*x1)) / 2
	const xs = region.map(p => p.x)
	const ys = region.map(p => p.y)

	let left = 0
	for (let i = 0; i < xs.length; i++) {
		left += xs[i] * ys[(i + 1) % ys.length]
	}

	let right = 0
	for (let i = 0; i < ys.length; i++) {
		right += ys[i] * xs[(i + 1) % xs.length]
	}

	return (left - right) / 2
}

export function getRegionSegments(region: Region) {
	const segments: Array<Segment> = []
	for (let i = 0; i < region.length; i++) {
		const left = region[i]
		const right = region[(i + 1) % region.length]
		segments.push([left, right])
	}
	return segments
}
