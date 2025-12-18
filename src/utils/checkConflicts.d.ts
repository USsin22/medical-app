export declare function hasConflict(
  appointments: Array<{ id: number | string; date: string; heure: string }>,
  date: string,
  time: string,
  excludeId?: number | string
): boolean

export declare function availableSlots(
  appointments: Array<{ id: number | string; date: string; heure: string }>,
  date: string,
  slots: string[],
  excludeId?: number | string
): string[]
