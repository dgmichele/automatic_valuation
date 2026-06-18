/**
 * FallbackPage — stub (Fase 1)
 * Renderizzata quando lat/lon sono assenti o non validi,
 * oppure quando la geo lookup restituisce OUTSIDE_AREA.
 * Implementata completamente in Fase 2.
 */
const FallbackPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-brand-paragraph font-sans text-sm">
        FallbackPage — stub Fase 1
      </p>
    </div>
  );
};

export default FallbackPage;
