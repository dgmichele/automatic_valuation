/**
 * Header.tsx — Intestazione dell'applicazione.
 *
 * Layout responsive:
 * - Mobile (< md):          logo compatto (logo-mobile-tablet.png) ingrandito, telefono nascosto
 * - Tablet (md - lg):       logo compatto ingrandito, telefono visibile
 * - Desktop (≥ lg):         logo orizzontale completo (logo-orizzontale.png), telefono visibile
 *
 * Sfondo #fffbfc con ombra neutra percettibile sotto.
 */
import { FaPhoneAlt } from "react-icons/fa";

import logoOrizzontale from '../../assets/images/logo-orizzontale.png';
import logoMobile from '../../assets/images/logo-mobile-tablet.png';

const Header = () => {
  return (
    <header
      className="w-full bg-brand-field py-2"
      style={{ boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.16)' }}
    >
      {/* px ridotto per avvicinarsi ai bordi su tablet/PC */}
      <div className="w-full px-4 md:px-6 flex items-center justify-between">

        {/* Logo — mobile/tablet: icona compatta | desktop: logo orizzontale */}
        <a
          href="https://www.bichimmobiliare.it"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Bich Immobiliare — torna al sito"
        >
          {/* Mobile e Tablet (< lg) */}
          <img
            src={logoMobile}
            alt="Bich Immobiliare"
            className="block lg:hidden h-14 md:h-16 w-auto object-contain"
          />
          {/* Desktop (≥ lg) - invariato */}
          <img
            src={logoOrizzontale}
            alt="Bich Immobiliare"
            className="hidden lg:block h-14 w-auto object-contain"
          />
        </a>

        {/* Numero di telefono — visibile da tablet in su (md) */}
        <a
          href="tel:+390125454148"
          className="hidden md:flex items-center gap-2 text-brand-primary font-sans text-xl font-bold tracking-wide hover:opacity-75 transition-opacity"
          aria-label="Chiama Bich Immobiliare: 0125 45148"
        >
          <FaPhoneAlt size={24} strokeWidth={2.5} aria-hidden="true" />
          <span>0125 45148</span>
        </a>

      </div>
    </header>
  );
};

export default Header;


