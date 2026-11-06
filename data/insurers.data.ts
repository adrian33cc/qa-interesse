/**
 * Insurer catalog.
 * - `slug`: path segment of the per-insurer quote endpoint `POST /autocotiza/cotiza/{slug}`.
 * - `logoId`: id of the inline SVG `<g>` that identifies the insurer card on the results page
 *   (cards have no accessible name, the logo is the only stable identifier).
 */
export interface InsurerDefinition {
    readonly name: string;
    readonly slug: string;
    readonly logoId: string;
  }
  
  export const INSURERS = {
    qualitas: { name: 'Qualitas', slug: 'qualitas', logoId: 'qualitas' },
    momento: { name: 'Momento', slug: 'momento', logoId: 'momento' },
    ana: { name: 'ANA', slug: 'ana', logoId: 'anaseguros' },
    gnp: { name: 'GNP', slug: 'gnp', logoId: 'gnp' },
    // Chubb is integrated through its former ABA Seguros connector, hence the "aba" logo.
    chubb: { name: 'Chubb', slug: 'chubb', logoId: 'aba' },
    atlas: { name: 'Atlas', slug: 'atlas', logoId: 'atlas' },
    hdi: { name: 'HDI', slug: 'hdi', logoId: 'hdi' },
    axa: { name: 'Axa', slug: 'axa', logoId: 'axa' },
  } as const satisfies Record<string, InsurerDefinition>;
  
  export type InsurerKey = keyof typeof INSURERS;
  
  /** Insurers that "should quote" according to requirements 2 and 3 of the technical test (PDF order). */
  export const EXPECTED_QUOTING_INSURERS: readonly InsurerDefinition[] = [
    INSURERS.qualitas,
    INSURERS.momento,
    INSURERS.ana,
    INSURERS.gnp,
    INSURERS.chubb,
    INSURERS.atlas,
    INSURERS.hdi,
    INSURERS.axa,
  ];
  