/**
 * useAddressAutocomplete.ts — Hook per la gestione dello stato e della logica
 * del componente AddressAutocomplete.
 *
 * Separa la logica di business e le chiamate API di geocoding/suggerimenti
 * dalla parte di visualizzazione (UI presentazionale).
 */
import { useState, useEffect, useRef } from 'react';
import { useNominatim, type SelectedAddress } from './useNominatim';

interface UseAddressAutocompleteParams {
  onValidSelect: (address: SelectedAddress) => void;
  isSubmitting: boolean;
}

const insertHouseNumberIntoDisplayName = (
  displayName: string,
  road: string | undefined,
  civic: string,
): string => {
  if (road && displayName.startsWith(road)) {
    return displayName.replace(road, `${road} ${civic}`);
  }
  return `${displayName} ${civic}`;
};

export const useAddressAutocomplete = ({
  onValidSelect,
  isSubmitting,
}: UseAddressAutocompleteParams) => {
  const {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading,
    handleSelect,
    reset: resetNominatim,
  } = useNominatim();

  const [manualHouseNumber, setManualHouseNumber] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Chiudi la dropdown al click fuori dal componente
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        // Chiudi i suggerimenti senza resettare la query
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Resetta il civico manuale quando cambia la selezione
  useEffect(() => {
    if (!selected || selected.hasHouseNumber) {
      setManualHouseNumber('');
    }
  }, [selected]);

  /** Pulsante "Valuta" abilitato solo se abbiamo un indirizzo con civico (estratto o inserito a mano) */
  const isValutaDisabled =
    !selected ||
    isSubmitting ||
    (!selected.hasHouseNumber && !manualHouseNumber.trim());

  const handleValutaClick = () => {
    if (selected) {
      if (selected.hasHouseNumber) {
        onValidSelect(selected);
      } else if (manualHouseNumber.trim()) {
        const displayNameWithCivic = insertHouseNumberIntoDisplayName(
          selected.displayName,
          selected.road,
          manualHouseNumber.trim(),
        );

        onValidSelect({
          ...selected,
          displayName: displayNameWithCivic,
          hasHouseNumber: true,
        });
      }
    }
  };

  const handleReset = () => {
    resetNominatim();
    setManualHouseNumber('');
  };

  return {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading,
    handleSelect,
    manualHouseNumber,
    setManualHouseNumber,
    inputRef,
    listRef,
    isValutaDisabled,
    handleValutaClick,
    handleReset,
  };
};
