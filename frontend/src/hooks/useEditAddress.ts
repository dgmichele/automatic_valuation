/**
 * useEditAddress.ts — Custom hook per la gestione dello stato e della logica
 * del modal di modifica indirizzo (EditAddressModal).
 *
 * Separa la logica di business e le chiamate API di geocoding/lookup
 * dalla parte puramente presentazionale della UI.
 */
import { useState, useEffect, useRef } from 'react';
import { useNominatim } from './useNominatim';
import { lookupZone } from '../api/geo.api';
import { useValuationStore } from '../store/useValuationStore';

interface UseEditAddressParams {
  isOpen: boolean;
  onClose: () => void;
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

export const useEditAddress = ({ isOpen, onClose }: UseEditAddressParams) => {
  const currentAddress = useValuationStore((state) => state.address);
  const setGeo = useValuationStore((state) => state.setGeo);

  const {
    query,
    setQuery,
    suggestions,
    selected,
    isLoading: isSearching,
    handleSelect,
    reset: resetNominatim,
  } = useNominatim();

  const [manualHouseNumber, setManualHouseNumber] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Resetta lo stato del modal alla chiusura o all'apertura
  useEffect(() => {
    if (!isOpen) {
      resetNominatim();
      setManualHouseNumber('');
      setError(null);
      setIsSaving(false);
    }
  }, [isOpen, resetNominatim]);

  // Chiudi la dropdown al click esterno
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current &&
        !inputRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        // Nascondiamo i suggerimenti ma non resettiamo il testo
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

  // Il pulsante "Salva" è abilitato solo se abbiamo un indirizzo con civico (estratto o manuale)
  const isSaveDisabled =
    !selected ||
    isSaving ||
    (!selected.hasHouseNumber && !manualHouseNumber.trim());

  const handleSave = async () => {
    if (!selected) return;

    setIsSaving(true);
    setError(null);

    // Costruisce il display name finale includendo il civico manuale se inserito
    let finalAddress = selected.displayName;
    if (!selected.hasHouseNumber && manualHouseNumber.trim()) {
      finalAddress = insertHouseNumberIntoDisplayName(
        selected.displayName,
        selected.road,
        manualHouseNumber.trim(),
      );
    }

    try {
      // Verifica se le coordinate rientrano in una zona OMI abilitata
      const zoneData = await lookupZone(selected.lat, selected.lon);

      // Successo: aggiorna lo store Zustand
      setGeo({
        lat: selected.lat,
        lon: selected.lon,
        address: finalAddress,
        zona: zoneData,
      });

      // Chiudi il modal
      onClose();
    } catch (err: any) {
      // Estrae il codice errore o lo status per determinare il messaggio
      const status = err?.response?.status;
      const code = err?.code ?? err?.response?.data?.error?.code;

      if (status === 404 || code === 'OUTSIDE_AREA') {
        setError("L'indirizzo inserito non è nella nostra area di competenza.");
      } else {
        setError("Si è verificato un errore nella verifica dell'indirizzo. Riprova più tardi.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    currentAddress,
    query,
    setQuery,
    suggestions,
    selected,
    isSearching,
    resetNominatim,
    handleSelect,
    manualHouseNumber,
    setManualHouseNumber,
    isSaving,
    error,
    isSaveDisabled,
    handleSave,
    inputRef,
    listRef,
  };
};
