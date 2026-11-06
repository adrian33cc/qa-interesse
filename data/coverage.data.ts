import { INSURERS, type InsurerDefinition } from './insurers.data';
import { DEFAULT_QUOTE_CONDITIONS, type QuoteScenario } from './quotes.data'
import { VEHICLES } from './vehicles.data';

/**
 * A control to activate in the "Añadir coberturas" panel, identified by its accessible name.
 * Labels are the ones the portal renders, which differ slightly from the PDF wording.
 */
export interface OptionalCoverage {
  readonly kind: 'checkbox' | 'radio';
  readonly label: string;
}

export interface OptionalCoverageScenario extends QuoteScenario {
  /** Insurer whose card gets the optional coverages. */
  readonly insurer: InsurerDefinition;
  readonly optionalCoverages: readonly OptionalCoverage[];
}
const VERSA_2024_AMPLIA_PLUS = {
  vehicle: VEHICLES.nissanVersa2024,
  ...DEFAULT_QUOTE_CONDITIONS,
  coverage: 'Amplia Plus',
} as const satisfies Omit<QuoteScenario, 'id' | 'title'>;

export const OPTIONAL_COVERAGE_SCENARIOS: readonly OptionalCoverageScenario[] = [
  {
    id: 'REQ-04',
    title: 'Qualitas: Robo parcial ($10,000) + Reparación en agencia',
    ...VERSA_2024_AMPLIA_PLUS,
    insurer: INSURERS.qualitas,
    optionalCoverages: [
      { kind: 'checkbox', label: 'Robo Parcial' },
      { kind: 'radio', label: 'Robo Parcial Suma Asegurada $10,000' },
      { kind: 'checkbox', label: 'Reparación en Agencia' },
    ],
  },
  {
    id: 'REQ-05',
    title: 'ANA: Robo parcial + Llantas y rines + Reparación en agencia',
    ...VERSA_2024_AMPLIA_PLUS,
    insurer: INSURERS.ana,
    optionalCoverages: [
      { kind: 'checkbox', label: 'Robo Parcial Suma Asegurada $30,000' },
      { kind: 'checkbox', label: 'Daños Materiales Llantas y Rines' },
      { kind: 'checkbox', label: 'Reparación en Agencia' },
    ],
  },
];
