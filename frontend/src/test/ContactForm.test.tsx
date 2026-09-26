import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/api/client';
import { ContactForm } from '@/components/ContactForm';
import { renderWithProviders } from './utils';

const contact = vi.fn();
const trackEvent = vi.fn();
vi.mock('@/api/endpoints', () => ({
  publicApi: {
    contact: (...args: unknown[]) => contact(...args),
    track: (...args: unknown[]) => trackEvent(...args),
  },
}));

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/^Name/), 'Jane Doe');
  await user.type(screen.getByLabelText(/^Email/), 'jane@example.com');
  await user.type(screen.getByLabelText(/^Subject/), 'Internship');
  await user.type(screen.getByLabelText(/^Message/), 'Hello Rihab, I would like to talk about an internship.');
}

describe('ContactForm', () => {
  beforeEach(() => {
    contact.mockReset();
    trackEvent.mockReset().mockResolvedValue(undefined);
  });

  it('shows validation errors and does not call the API when fields are invalid', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ContactForm />);

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Please enter your name.')).toBeInTheDocument();
    expect(screen.getByText('Please enter your email.')).toBeInTheDocument();
    expect(screen.getByLabelText(/^Name/)).toHaveAttribute('aria-invalid', 'true');
    expect(contact).not.toHaveBeenCalled();
  });

  it('submits trimmed values and shows the success state', async () => {
    const user = userEvent.setup();
    contact.mockResolvedValue({ message: "Thanks for your message. I'll get back to you soon." });
    renderWithProviders(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Message sent')).toBeInTheDocument();
    expect(contact).toHaveBeenCalledWith(expect.objectContaining({ name: 'Jane Doe', email: 'jane@example.com', website: '' }));
  });

  it('displays field errors returned by the backend', async () => {
    const user = userEvent.setup();
    contact.mockRejectedValue(new ApiError(400, 'Some fields are invalid.', { email: 'Please enter a valid email address.' }));
    renderWithProviders(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Some fields are invalid.')).toBeInTheDocument();
  });

  it('explains rate limiting in plain language', async () => {
    const user = userEvent.setup();
    contact.mockRejectedValue(new ApiError(429, 'Too many requests.'));
    renderWithProviders(<ContactForm />);

    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => expect(screen.getByText(/sent several messages recently/i)).toBeInTheDocument());
  });
});
