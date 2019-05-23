import { getEnumValues } from './enum'

export type EasingPoints = [number, number, number, number]
export type EasingCubicBezier = string

export enum EasingStatus {
  // Group
  EaseInOut = 1,
  InOutSine,
  InOutQuadratic,
  InOutCubic,
  FastOutSlowIn,
  InOutBack,
  // Group
  FastOutLinearIn,
  EaseIn,
  InSine,
  InQuadratic,
  InCubic,
  InBack,
  // Group
  EaseOut,
  OutSine,
  OutQuadratic,
  OutCubic,
  LinearOutSlowIn,
  OutBack
}

export const easingStatusGroups: EasingStatus[][] = [
  [
    EasingStatus.EaseInOut,
    EasingStatus.InOutSine,
    EasingStatus.InOutQuadratic,
    EasingStatus.InOutCubic,
    EasingStatus.FastOutSlowIn,
    EasingStatus.InOutBack
  ],
  [
    EasingStatus.FastOutLinearIn,
    EasingStatus.EaseIn,
    EasingStatus.InSine,
    EasingStatus.InCubic,
    EasingStatus.InBack
  ],
  [
    EasingStatus.EaseOut,
    EasingStatus.OutSine,
    EasingStatus.OutQuadratic,
    EasingStatus.OutCubic,
    EasingStatus.LinearOutSlowIn,
    EasingStatus.OutBack
  ]
]

export const easingsNames: { [key: number]: string } = {
  [EasingStatus.EaseInOut]: `ease-in-out`,
  [EasingStatus.InOutSine]: `In Out · Sine`,
  [EasingStatus.InOutQuadratic]: `In Out · Quadratic`,
  [EasingStatus.InOutCubic]: `In Out · Cubic`,
  [EasingStatus.FastOutSlowIn]: `Fast Out, Slow In`,
  [EasingStatus.InOutBack]: `In Out · Back`,
  [EasingStatus.FastOutLinearIn]: `Fast Out, Linear In`,
  [EasingStatus.EaseIn]: `ease-in`,
  [EasingStatus.InSine]: `In · Sine`,
  [EasingStatus.InQuadratic]: `In · Quadratic`,
  [EasingStatus.InCubic]: `In · Cubic`,
  [EasingStatus.InBack]: `In · Back`,
  [EasingStatus.EaseOut]: `ease-out`,
  [EasingStatus.OutSine]: `Out · Sine`,
  [EasingStatus.OutQuadratic]: `Out · Quadratic`,
  [EasingStatus.OutCubic]: `Out · Cubic`,
  [EasingStatus.LinearOutSlowIn]: `Linear Out, Slow In`,
  [EasingStatus.OutBack]: `Out · Back`
}

export const easingsPoints: { [key: number]: EasingPoints } = {
  [EasingStatus.EaseInOut]: [0.42, 0, 0.58, 1],
  [EasingStatus.InOutSine]: [0.445, 0.05, 0.55, 0.95],
  [EasingStatus.InOutQuadratic]: [0.455, 0.03, 0.515, 0.955],
  [EasingStatus.InOutCubic]: [0.645, 0.045, 0.355, 1],
  [EasingStatus.FastOutSlowIn]: [0.4, 0, 0.2, 1],
  [EasingStatus.InOutBack]: [0.68, -0.55, 0.265, 1.55],
  [EasingStatus.FastOutLinearIn]: [0.4, 0, 1, 1],
  [EasingStatus.EaseIn]: [0.42, 0, 1.0, 1.0],
  [EasingStatus.InSine]: [0.47, 0, 0.745, 0.715],
  [EasingStatus.InQuadratic]: [0.55, 0.085, 0.68, 0.53],
  [EasingStatus.InCubic]: [0.55, 0.055, 0.675, 0.19],
  [EasingStatus.InBack]: [0.6, -0.28, 0.735, 0.045],
  [EasingStatus.EaseOut]: [0, 0, 0.58, 1.0],
  [EasingStatus.OutSine]: [0.39, 0.575, 0.565, 1],
  [EasingStatus.OutQuadratic]: [0.25, 0.46, 0.45, 0.94],
  [EasingStatus.OutCubic]: [0.215, 0.61, 0.355, 1],
  [EasingStatus.LinearOutSlowIn]: [0, 0, 0.2, 1],
  [EasingStatus.OutBack]: [0.175, 0.885, 0.32, 1.275]
}

export const easingStatusValues = getEnumValues(EasingStatus)

export function getEasingCubicBezierPoints(key: EasingStatus): EasingPoints {
  return easingsPoints[key]
}

export function getCubicBezierString(key: EasingStatus): string {
  return easingsPoints[key].join(',')
}

export function toEasingCubicBezier(easingPoints: EasingPoints): string {
  return `cubic-bezier(${easingPoints.join(', ')})`
}

export function getEasingNameByEasingPoints(
  easingPoints: EasingPoints
): string | null {
  const entries = Object.entries(easingsPoints)
  const result = entries.find(entry => {
    const _easingsPoints = entry[1]
    return _easingsPoints.every(
      (_point, _index) => _point === easingPoints[_index]
    )
  })

  if (!result) {
    return null
  }

  const easingStatus: EasingStatus = +result[0]
  return easingsNames[easingStatus]
}
