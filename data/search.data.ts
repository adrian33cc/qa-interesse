export interface SearchVehicleData {
    readonly id: string;
    readonly vehicleTerm: string;
    readonly expectedVehicleOptions: readonly string[];
}


export const searchVehicleData: readonly SearchVehicleData[] = [
    {
        id: 'REQ-01',
        vehicleTerm: 'CHEVROLET 2022 AVEO',
        expectedVehicleOptions: [
          'CT CHEVROLET 2022 AVEO LS A/K 4P L4 1.5L ABS BA AC STD 5 OCUP',
          'CT CHEVROLET 2022 AVEO LS B 4P L4 1.5L ABS BA AC AUT 5 OCUP',
          'CT CHEVROLET 2022 AVEO LT G/M 4P L4 1.5L ABS BA AC R15 STD 5 OCUP',
        ],
      },
];