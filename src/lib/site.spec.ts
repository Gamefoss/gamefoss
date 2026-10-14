import { describe, expect, it } from 'vitest';
import { slugify } from './site';
describe('slugify', () => { it('normalizes accents and punctuation', () => expect(slugify('Heróis & Vilões!')).toBe('herois-viloes')); });
