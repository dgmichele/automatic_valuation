export interface GeoZone {
  id_zona: string;
  comune: string;
  fascia: string;
  descrizione: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}
