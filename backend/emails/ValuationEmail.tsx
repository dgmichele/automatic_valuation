import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from '@react-email/components';

// ---- Tipi ----
export interface ValuationEmailProps {
  first_name: string;
  address: string;
  property_type: string;
  min_value: number;
  max_value: number;
  avg_value: number;
}

// ---- Helpers ----

/**
 * Formatta un numero come valuta in italiano (es. 88400 → "€ 88.400")
 */
const formatEuro = (val: number): string =>
  `€ ${val.toLocaleString('it-IT')}`;

// ---- Componente ----

export const ValuationEmail = ({
  first_name = 'Cliente',
  address = 'Via Palestro 3, Ivrea',
  property_type = 'Appartamento',
  min_value = 100000,
  max_value = 150000,
  avg_value = 125000,
}: ValuationEmailProps) => {
  return (
    <Html lang="it" dir="ltr">
      <Head />
      <Preview>
        Scopri il valore stimato del tuo immobile in via {address}!
      </Preview>

      <Body style={styles.main}>
        <Container style={styles.wrapper}>

          {/* ── HEADER con logo ── */}
          <Section style={styles.header}>
            <Img
              src="https://bichimmobiliare.it/wp-content/uploads/2025/11/logo-mail-trasparente.png"
              alt="Bich Immobiliare"
              width="160"
              style={styles.logo}
            />
          </Section>
          <Hr style={{ borderColor: '#f0d6da', borderWidth: '1px', margin: '0' }} />

          {/* ── HERO ── */}
          <Section style={styles.hero}>
            <Text style={styles.heroEyebrow}>Valutazione Immobiliare</Text>
            <Heading as="h1" style={styles.heroTitle}>
              Ciao {first_name}, la tua valutazione è pronta!
            </Heading>
            <Text style={styles.heroAddress}>📍 {address}</Text>
          </Section>

          {/* ── CARD VALUTAZIONE ── */}
          <Section style={styles.cardOuter}>
            <Section style={styles.card}>
              <Text style={styles.cardEyebrow}>Valore stimato</Text>
              <Text style={styles.avgValue}>{formatEuro(avg_value)}</Text>

              <Hr style={styles.cardDivider} />

              {/* Min e Max su due colonne */}
              <Row>
                <Column style={styles.minMaxCol}>
                  <Text style={styles.minMaxLabel}>Valore minimo</Text>
                  <Text style={styles.minMaxValue}>{formatEuro(min_value)}</Text>
                </Column>
                <Column style={styles.minMaxColDivider} />
                <Column style={styles.minMaxCol}>
                  <Text style={styles.minMaxLabel}>Valore massimo</Text>
                  <Text style={styles.minMaxValue}>{formatEuro(max_value)}</Text>
                </Column>
              </Row>

              <Text style={styles.cardNote}>
                *Stima puramente indicativa basata sui dati OMI, pertanto potrebbe non corrispondere al reale valore di mercato. Una corretta valutazione potrà essere effettuata a seguito di sopralluogo dell’immobile ed ad un’analisi di mercato.
              </Text>
            </Section>
          </Section>

          {/* ── CTA ── */}
          <Section style={styles.ctaSection}>
            <Heading as="h2" style={styles.ctaTitle}>
              Vuoi approfondire la valutazione?
            </Heading>
            <Text style={styles.ctaBody}>
              Siamo a tua disposizione per approfondire la valutazione e rispondere a tutte le tue domande.
            </Text>
            <Button style={styles.ctaButton} href="tel:+39012545148">
              Chiamaci
            </Button>
          </Section>

          <Hr style={styles.footerDivider} />

          {/* ── FOOTER ── */}
          <Section style={styles.footer}>
            <Img
              src="https://bichimmobiliare.it/wp-content/uploads/2025/11/logo-mail-trasparente.png"
              alt="Bich Immobiliare"
              width="100"
              style={styles.footerLogo}
            />
            <Text style={styles.footerInfo}>
              <strong>Bich Immobiliare</strong>
              <br />
              Via Jervis 64 - 10015 Ivrea (TO)
              <br />
              <Link href="tel:+390125641234" style={styles.footerLink}>
                0125 45148
              </Link>
              {' · '}
              <Link href="https://bichimmobiliare.it" style={styles.footerLink}>
                bichimmobiliare.it
              </Link>
            </Text>
            <Text style={styles.footerDisclaimer}>
              Questa valutazione è puramente indicativa e basata sui valori OMI dell'Agenzia delle Entrate.
              Non costituisce perizia, proposta contrattuale o consulenza professionale.
              Hai ricevuto questa email perché hai richiesto una valutazione tramite il nostro strumento online.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default ValuationEmail;

// ══════════════════════════════════════════
// STYLES — inline per compatibilità email
// ══════════════════════════════════════════
const styles: Record<string, React.CSSProperties> = {
  // Sfondo pagina
  main: {
    backgroundColor: '#fdf5f7',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '2px 0',
  },

  // Container principale
  wrapper: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#fffbfc',
    border: '1px solid #f0d6da',
  },

  // ── HEADER ──
  header: {
    backgroundColor: '#fffbfc',
    padding: '30px 20px',
    textAlign: 'center',
  },
  logo: {
    display: 'block',
    maxWidth: '200px',
    margin: '0 auto',
  },

  // ── HERO ──
  hero: {
    backgroundColor: '#fffbfc',
    padding: '40px 40px 24px',
    textAlign: 'center',
  },
  heroEyebrow: {
    color: '#b41c3c',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    margin: '0 0 14px',
    fontFamily: 'Inter, sans-serif',
  },
  heroTitle: {
    color: '#1e1e1e',
    fontSize: '26px',
    fontWeight: '800',
    lineHeight: '1.35',
    margin: '0 0 20px',
    fontFamily: 'Merriweather, Georgia, serif',
  },
  heroAddress: {
    color: '#5f5f5f',
    fontSize: '15px',
    letterSpacing: '0.3px',
    margin: '0',
    fontFamily: 'Inter, sans-serif',
  },

  // ── CARD VALUTAZIONE ──
  cardOuter: {
    padding: '15px 15px 0',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #f0d6da',
    padding: '12px 12px',
    textAlign: 'center',
  },
  cardEyebrow: {
    color: '#b41c3c',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '2px',
    textTransform: 'uppercase' as const,
    margin: '0 0 10px',
    fontFamily: 'Inter, sans-serif',
  },
  avgValue: {
    color: '#1e1e1e',
    fontSize: '52px',
    fontWeight: '800',
    letterSpacing: '-1.5px',
    margin: '0 0 24px',
    lineHeight: '1',
    fontFamily: 'Merriweather, Georgia, serif',
  },
  cardDivider: {
    borderColor: '#f0d6da',
    margin: '0 0 20px',
  },
  minMaxCol: {
    textAlign: 'center',
    padding: '0 10px',
  },
  minMaxColDivider: {
    width: '1px',
    backgroundColor: '#f0d6da',
  },
  minMaxLabel: {
    color: '#b41c3c',
    fontSize: '10px',
    fontWeight: '700',
    letterSpacing: '1.5px',
    textTransform: 'uppercase' as const,
    margin: '0 0 4px',
    fontFamily: 'Inter, sans-serif',
  },
  minMaxValue: {
    color: '#1e1e1e',
    fontSize: '20px',
    fontWeight: '800',
    margin: '0',
    letterSpacing: '-0.5px',
    fontFamily: 'Merriweather, Georgia, serif',
  },
  cardNote: {
    color: '#9f9f9f',
    fontSize: '11px',
    lineHeight: '1.5',
    margin: '20px 0 0',
    fontStyle: 'italic' as const,
    fontFamily: 'Inter, sans-serif',
  },

  // ── CTA ──
  ctaSection: {
    padding: '40px 40px 36px',
    textAlign: 'center',
  },
  ctaTitle: {
    color: '#1e1e1e',
    fontSize: '20px',
    fontWeight: '800',
    margin: '0 0 12px',
    fontFamily: 'Merriweather, Georgia, serif',
  },
  ctaBody: {
    color: '#5f5f5f',
    fontSize: '14px',
    lineHeight: '1.7',
    margin: '0 0 28px',
    fontFamily: 'Inter, sans-serif',
  },
  ctaButton: {
    backgroundColor: '#b41c3c',
    color: '#fffbfc',
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '14px 36px',
    borderRadius: '5px',
    textDecoration: 'none',
    display: 'inline-block',
    letterSpacing: '0.3px',
    fontFamily: 'Inter, sans-serif',
  },

  // ── FOOTER ──
  footerDivider: {
    borderColor: '#f0d6da',
  },
  footer: {
    padding: '28px 40px 36px',
    textAlign: 'center',
    backgroundColor: '#fffbfc',
  },
  footerLogo: {
    display: 'block',
    margin: '0 auto 16px',
  },
  footerInfo: {
    color: '#5f5f5f',
    fontSize: '13px',
    lineHeight: '1.7',
    margin: '0 0 14px',
    fontFamily: 'Inter, sans-serif',
  },
  footerLink: {
    color: '#b41c3c',
    textDecoration: 'none',
  },
  footerDisclaimer: {
    color: '#9f9f9f',
    fontSize: '11px',
    lineHeight: '1.6',
    margin: '0',
    fontFamily: 'Inter, sans-serif',
  },
};
