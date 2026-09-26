import type { ContactInput } from '@/types';

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mirrors the backend Bean Validation rules so users get instant feedback. */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length < 2 || name.length > 100) errors.name = 'Name must be between 2 and 100 characters.';

  if (!email) errors.email = 'Please enter your email.';
  else if (!EMAIL.test(email) || email.length > 254) errors.email = 'Please enter a valid email address.';

  if (!subject) errors.subject = 'Please enter a subject.';
  else if (subject.length < 3 || subject.length > 150) errors.subject = 'Subject must be between 3 and 150 characters.';

  if (!message) errors.message = 'Please write a message.';
  else if (message.length < 10 || message.length > 5000) errors.message = 'Message must be between 10 and 5000 characters.';

  return errors;
}
