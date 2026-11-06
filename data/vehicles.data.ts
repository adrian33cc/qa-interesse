export interface VehicleData {
  readonly searchTerm: string;
  readonly version?: string;
}

export const VEHICLES = {
  nissanVersa2023: { searchTerm: "NISSAN 2023 VERSA" },
  nissanVersa2024: { searchTerm: "NISSAN 2024 VERSA" },
  mazdaCx30_2026: { searchTerm: "MAZDA 2026 CX-30" },
} as const satisfies Record<string, VehicleData>;
