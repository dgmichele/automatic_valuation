/**
 * formatCurrency.ts
 * Utility per formattare numeri in formato valuta Euro (es. € 250.000)
 */
export const formatCurrency = (val: number): string => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(val);
};
