import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Send } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { publicApi } from '@/api/endpoints';
import { ApiError, toApiError } from '@/api/client';
import { track } from '@/hooks/useAnalytics';
import type { ContactInput } from '@/types';
import { validateContact, type ContactErrors } from '@/utils/validation';
import { Button } from './ui/Button';
import { InputField, TextAreaField } from './ui/Field';

const EMPTY: ContactInput = { name: '', email: '', subject: '', message: '', website: '' };

type Status = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success'; message: string } | { kind: 'error'; message: string };

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const update = (field: keyof ContactInput) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: event.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const clientErrors = validateContact(values);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length > 0) {
      setStatus({ kind: 'idle' });
      return;
    }
    setStatus({ kind: 'submitting' });
    try {
      const result = await publicApi.contact({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
        website: values.website,
      });
      track('contact_submit');
      setValues(EMPTY);
      setStatus({ kind: 'success', message: result.message });
    } catch (err) {
      const apiError: ApiError = toApiError(err);
      if (Object.keys(apiError.fieldErrors).length > 0) setErrors(apiError.fieldErrors as ContactErrors);
      const message =
        apiError.status === 429
          ? 'You have sent several messages recently. Please try again a bit later.'
          : apiError.status === 0
            ? 'Could not reach the server. Check your connection and try again.'
            : apiError.message;
      setStatus({ kind: 'error', message });
    }
  };

  return (
    <div className="relative">
      <AnimatePresence mode="wait" initial={false}>
        {status.kind === 'success' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-start gap-3 py-6"
            role="status"
          >
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-success/10 text-success">
              <CheckCircle2 className="h-5 w-5" aria-hidden />
            </span>
            <p className="text-lg font-semibold text-ink">Message sent</p>
            <p className="text-sm text-muted">{status.message}</p>
            <Button variant="secondary" size="sm" onClick={() => setStatus({ kind: 'idle' })}>
              Send another message
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            aria-label="Contact form"
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField label="Name" name="name" autoComplete="name" required value={values.name} onChange={update('name')} error={errors.name} maxLength={100} />
              <InputField
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={values.email}
                onChange={update('email')}
                error={errors.email}
                maxLength={254}
              />
            </div>
            <InputField label="Subject" name="subject" required value={values.subject} onChange={update('subject')} error={errors.subject} maxLength={150} />
            <TextAreaField
              label="Message"
              name="message"
              required
              rows={6}
              value={values.message}
              onChange={update('message')}
              error={errors.message}
              maxLength={5000}
              hint="Internship, PFE, a project or just a question — all welcome."
            />
            {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Website
                <input tabIndex={-1} autoComplete="off" name="website" value={values.website} onChange={update('website')} />
              </label>
            </div>

            {status.kind === 'error' && (
              <p role="alert" className="rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger">
                {status.message}
              </p>
            )}

            <Button type="submit" size="lg" loading={status.kind === 'submitting'} icon={<Send className="h-4 w-4" aria-hidden />} className="w-full sm:w-auto">
              {status.kind === 'submitting' ? 'Sending…' : 'Send message'}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
