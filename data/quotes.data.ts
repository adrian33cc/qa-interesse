import { EXPECTED_QUOTING_INSURERS, type InsurerDefinition } from './insurers.data';
import { VEHICLES, type VehicleData } from './vehicles.data';

/** Options of the "Selecciona una Cobertura" select on the results page. */
export type CoveragePackage = 'Amplia' | 'Amplia Plus' | 'Limitada' | 'Responsabilidad Civil';

/** Options of the "Selecciona la Forma de Pago" select on the results page. */
export type PaymentMethod = 'Contado' | 'Semestral' | 'Trimestral';

/** Input needed to request a quote end to end (shared by requirements 2 to 5). */
export interface QuoteScenario {
  /** Requirement id from the PDF, used in test titles and reports. */
  readonly id: string;
  readonly title: string;
  readonly vehicle: VehicleData;
  readonly postalCode: string;
  readonly coverage: CoveragePackage;
  readonly payment: PaymentMethod;
  /** Invoice value ("Valor Factura") for brand-new vehicles. */
  readonly invoiceValue?: number;
}

export interface InsurerStatusScenario extends QuoteScenario {
  /** Insurers that must always quote, in PDF order. */
  readonly expectedInsurers: readonly InsurerDefinition[];
}

/** Quote conditions every requirement of the technical test shares. */
export const DEFAULT_QUOTE_CONDITIONS = {
  postalCode: '10200',
  payment: 'Contado',
} as const satisfies Pick<QuoteScenario, 'postalCode' | 'payment'>;

/** Requirements 2 and 3: insurer response status (quoted / not quoted), one test per scenario. */
export const INSURER_STATUS_SCENARIOS: readonly InsurerStatusScenario[] = [
  {
    id: 'REQ-02',
    title: 'Nissan Versa 2023, Amplia, Contado',
    vehicle: VEHICLES.nissanVersa2023,
    ...DEFAULT_QUOTE_CONDITIONS,
    coverage: 'Amplia',
    expectedInsurers: EXPECTED_QUOTING_INSURERS,
  },
  {
    id: 'REQ-03',
    title: 'Mazda CX-30 2026 with invoice value 480,000, Amplia, Contado',
    vehicle: VEHICLES.mazdaCx30_2026,
    ...DEFAULT_QUOTE_CONDITIONS,
    coverage: 'Amplia',
    invoiceValue: 480_000,
    expectedInsurers: EXPECTED_QUOTING_INSURERS,
  },
];
