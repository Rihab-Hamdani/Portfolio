import { describe, expect, it } from 'vitest';
import { validateContact } from '@/utils/validation';
import { parseStep } from '@/utils/project';

describe('validateContact', () => {
  const valid = { name: 'Jane Doe', email: 'jane@example.com', subject: 'Internship', message: 'Hello, I would like to talk.' };

  it('accepts a valid message', () => {
    expect(validateContact(valid)).toEqual({});
  });

  it('flags every missing field', () => {
    const errors = validateContact({ name: '', email: '', subject: '', message: '' });
    expect(Object.keys(errors).sort()).toEqual(['email', 'message', 'name', 'subject']);
  });

  it('mirrors backend length and format rules', () => {
    const errors = validateContact({ name: 'J', email: 'not-an-email', subject: 'Hi', message: 'short' });
    expect(errors.name).toMatch(/between 2 and 100/);
    expect(errors.email).toBe('Please enter a valid email address.');
    expect(errors.subject).toMatch(/between 3 and 150/);
    expect(errors.message).toMatch(/between 10 and 5000/);
  });

  it('trims whitespace before validating', () => {
    expect(validateContact({ ...valid, name: '   ' }).name).toBe('Please enter your name.');
  });
});

describe('parseStep', () => {
  it('splits label and detail', () => {
    expect(parseStep('Spring Boot|Business rules')).toEqual({ label: 'Spring Boot', detail: 'Business rules' });
    expect(parseStep('PostgreSQL')).toEqual({ label: 'PostgreSQL', detail: undefined });
  });
});
