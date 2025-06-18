// tests/setup.ts
import { jest } from '@jest/globals';

// Supprimer les logs pendant les tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};