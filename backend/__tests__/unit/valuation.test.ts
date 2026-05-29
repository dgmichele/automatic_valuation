import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { calculateValuation } from '../../services/valuation.service';
import db from '../../config/db';
import { ValuationPayload } from '../../types/valuation';

jest.mock('../../config/db', () => {
  return {
    __esModule: true,
    default: jest.fn(),
  };
});

// Cast to any to bypass strict Knex types in tests
const dbMock = db as any;

describe('Valuation Service Unit Tests', () => {
  beforeEach(() => {
    dbMock.mockClear();
  });

  const basePayload: ValuationPayload = {
    lat: 45.4654,
    lon: 7.8732,
    address: 'Via Palestro 3, Ivrea',
    property_type: 'Appartamento',
    sqm: 100,
    condition: 'In buono stato',
    rooms: '3',
    bathrooms: '1',
    floor: '2',
    energy_class: 'G',
    heating: 'Autonomo',
    elevator: true,
    balconies: '1',
    terrace: false,
    box: true,
    garden: false,
    intent: 'Vendita',
    first_name: 'Mario',
    last_name: 'Rossi',
    email: 'mario@example.com',
    phone: '3331234567'
  };

  it('should calculate valuation correctly without bonus', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1000, max_price: 1200 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Ascensore', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Box', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Giardino', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: '1', coefficiente: 1.00 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const result = await calculateValuation('E379/D1', basePayload);
    
    expect(result.min_value).toBe(100000);
    expect(result.max_value).toBe(120000);
    expect(result.avg_value).toBe(110000);
  });

  it('should apply bonus for box in E379/B1 zone', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1250, max_price: 1350 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Ascensore', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Box', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Giardino', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: '1', coefficiente: 1.00 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const result = await calculateValuation('E379/B1', basePayload);
    
    expect(result.min_value).toBe(140000);
    expect(result.max_value).toBe(150000);
    expect(result.avg_value).toBe(145000);
  });

  it('should calculate multiplier correctly', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1000, max_price: 1000 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'Ristrutturato', coefficiente: 1.20 },
            { categoria: 'Ascensore', parametro: 'Assente > 2°piano', coefficiente: 0.85 },
            { categoria: 'Box', parametro: 'Assente', coefficiente: 0.95 },
            { categoria: 'Giardino', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: 'Assente - altri piani', coefficiente: 0.85 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const payload: ValuationPayload = { ...basePayload, condition: 'Ristrutturato', elevator: false, floor: '3', box: false, balconies: 'No' };
    const result = await calculateValuation('E379/D1', payload);
    
    expect(result.min_value).toBe(82500);
  });
  
  it('should calculate commercial property (Negozio) correctly', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1000, max_price: 1200 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'Nuova costruzione', coefficiente: 1.80 },
            { categoria: 'Vetrine', parametro: 'Sì / 1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const payload: ValuationPayload = { 
      ...basePayload, 
      property_type: 'Negozio',
      condition: 'Nuova costruzione',
      windows: '1'
    };
    
    const result = await calculateValuation('E379/B2', payload);
    
    expect(result.min_value).toBe(180000);
    expect(result.max_value).toBe(216000);
    expect(result.avg_value).toBe(198000);
  });

  it('should calculate Villa property type mapping to Villa / Indipendente correctly', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1500, max_price: 1800 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Giardino', parametro: 'Presente', coefficiente: 1.10 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Box', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const payload: ValuationPayload = { 
      ...basePayload, 
      property_type: 'Villa',
      garden: true,
      box: true,
      balconies: 'No'
    };
    
    const result = await calculateValuation('E379/D1', payload);
    
    expect(result.min_value).toBe(165000);
    expect(result.max_value).toBe(198000);
    expect(result.avg_value).toBe(182000);
  });

  // --- Nuovi test: campi condizionali nullable ---

  it('should NOT crash when Villa has floor=null (frontend omits field)', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1500, max_price: 1800 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Giardino', parametro: 'Presente', coefficiente: 1.10 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Box', parametro: 'Presente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    // floor e elevator assenti come farebbe il frontend per una Villa
    const payload: ValuationPayload = {
      ...basePayload,
      property_type: 'Villa',
      floor: null,       // frontend non lo invia → normalizzato a null
      elevator: null,    // frontend non lo invia → normalizzato a null
      garden: true,
      box: true,
      balconies: 'No'
    };

    // Non deve lanciare TypeError
    await expect(calculateValuation('E379/D1', payload)).resolves.toBeDefined();
  });

  it('should NOT crash when Negozio has balconies=null and bathrooms=null', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1000, max_price: 1200 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Vetrine', parametro: 'Sì / 1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    // Payload realistico dal frontend per un Negozio: omette tutti i campi residenziali
    const payload: ValuationPayload = {
      ...basePayload,
      property_type: 'Negozio',
      floor: null,
      elevator: null,
      balconies: null,
      terrace: null,
      box: null,
      garden: null,
      bathrooms: null,
      windows: '1'
    };

    await expect(calculateValuation('E379/B2', payload)).resolves.toBeDefined();
  });

  it('should treat floor=null as non-ground-floor when computing isGroundFloor for Appartamento', async () => {
    dbMock.mockImplementation((table: string) => {
      if (table === 'omi_values') {
        return {
          where: jest.fn().mockReturnThis(),
          first: jest.fn<() => Promise<any>>().mockResolvedValue({ min_price: 1000, max_price: 1000 })
        };
      }
      if (table === 'correction_coefficients') {
        return {
          where: jest.fn().mockReturnThis(),
          // floor=null → isGroundFloor=false → il service deve richiedere 'Assente - altri piani'
          whereIn: jest.fn<() => Promise<any>>().mockResolvedValue([
            { categoria: 'Stato', parametro: 'In buono stato', coefficiente: 1.00 },
            { categoria: 'Box', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Giardino', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Terrazzo', parametro: 'Assente', coefficiente: 1.00 },
            { categoria: 'Balcone', parametro: 'Assente - altri piani', coefficiente: 0.90 },
            { categoria: 'Bagno', parametro: '1', coefficiente: 1.00 }
          ])
        };
      }
      return {};
    });

    const payload: ValuationPayload = {
      ...basePayload,
      floor: null,       // floor null → isGroundFloor deve essere false
      elevator: true,
      balconies: 'No',   // innesca il ramo isGroundFloor
      box: false,
      garden: false,
      terrace: false
    };

    // Con coefficiente Balcone 0.90 su 100mq a 1000€/mq → 90000
    const result = await calculateValuation('E379/D1', payload);
    expect(result.min_value).toBe(90000);
  });
});
