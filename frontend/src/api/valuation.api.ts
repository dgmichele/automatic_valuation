/**
 * valuation.api.ts — Chiamate API per la sottomissione del form di valutazione.
 */
import apiClient from './axiosClient';
import type { ApiResponse } from '../types/shared';
import type { ValuationPayload, ValuationResult } from '../types/valuation';

/**
 * Invia il payload completo della valutazione al backend (POST /api/valuations).
 *
 * @param payload - Oggetto conforme a ValuationPayload
 * @returns Promise<ValuationResult> - Risultato con min_value, max_value, avg_value
 */
export const submitValuation = async (
  payload: ValuationPayload,
): Promise<ValuationResult> => {
  const { data } = await apiClient.post<ApiResponse<ValuationResult>>(
    '/valuations',
    payload,
  );

  return data.data!;
};
