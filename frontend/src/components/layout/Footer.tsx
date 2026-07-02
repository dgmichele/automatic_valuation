/**
 * Footer.tsx — Piè di pagina dell'applicazione.
 *
 * Layout responsive:
 * - Mobile (< md):       flex colonna centrato — link in alto, copyright sotto
 * - Tablet/Desktop (≥ md): flex riga — copyright a sinistra, link a destra
 *
 * Sfondo #fffbfc con ombra neutra percettibile sopra (speculare all'Header).
 * Link: colore #5f5f5f (brand-paragraph) → #b41c3c (brand-primary) all'hover
 * con transizione smooth.
 */

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-brand-field py-5"
      style={{ boxShadow: '0 -2px 10px 0 rgba(0, 0, 0, 0.16)' }}
    >
      <div className="w-full px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-0 lg:max-w-7xl lg:mx-auto">

        {/* Copyright — sotto su mobile, a sinistra su desktop */}
        <p className="order-2 md:order-1 text-brand-paragraph font-sans text-sm lg:text-md text-center md:text-left lg:order-1">
          Copyright &copy; {currentYear} Bich Immobiliare. Tutti i diritti riservati.
        </p>

        {/* Link Privacy e Cookie — sopra su mobile, a destra su desktop */}
        <nav
          aria-label="Link legali"
          className="order-1 md:order-2 lg:order-2 flex items-center gap-4 mb-2 md:mb-0"
        >
          <a
            href="https://www.iubenda.com/privacy-policy/72256962"
            className="text-brand-paragraph font-sans text-sm lg:text-md transition-colors duration-300 ease-in-out hover:text-brand-primary"
            aria-label="Leggi la Privacy Policy"
          >
            Privacy Policy
          </a>
          <a
            href="https://www.iubenda.com/privacy-policy/72256962/cookie-policy"
            className="text-brand-paragraph font-sans text-sm lg:text-md transition-colors duration-300 ease-in-out hover:text-brand-primary"
            aria-label="Leggi la Cookie Policy"
          >
            Cookie Policy
          </a>
        </nav>

      </div>
    </footer>
  );
};

export default Footer;
