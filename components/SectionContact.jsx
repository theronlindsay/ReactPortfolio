'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import TiltCard from '@/components/TiltCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ContactMessageEditor from '@/components/ContactMessageEditor';

const METHODS = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'text', label: 'Text' },
  { value: 'other', label: 'Other' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function contactFieldLabel(method) {
  switch (method) {
    case 'email':
      return 'Your email';
    case 'phone':
      return 'Your phone number';
    case 'text':
      return 'Your mobile number (for SMS)';
    default:
      return 'Contact detail';
  }
}

export default function SectionContact() {
  const [editorKey, setEditorKey] = useState(0);
  const [method, setMethod] = useState('');
  const [contactDetail, setContactDetail] = useState('');
  const [otherDetail, setOtherDetail] = useState('');
  const [messageHtml, setMessageHtml] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = useCallback(() => {
    const next = {};
    if (!method) {
      next.method = 'Choose how you would like to be contacted.';
    }
    if (method === 'other') {
      if (!otherDetail.trim()) {
        next.otherDetail = 'Please describe how you want to be contacted.';
      }
    } else if (method && method !== 'other') {
      const v = contactDetail.trim();
      if (!v) {
        next.contactDetail = `Please enter your ${method === 'email' ? 'email address' : 'number'}.`;
      } else if (method === 'email' && !EMAIL_RE.test(v)) {
        next.contactDetail = 'Enter a valid email address.';
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }, [method, contactDetail, otherDetail]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contactMethod: method,
          contactDetail: method === 'other' ? '' : contactDetail.trim(),
          otherDetail: method === 'other' ? otherDetail.trim() : '',
          messageHtml,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus({ type: 'error', text: data.error || 'Something went wrong. Try again later.' });
        return;
      }
      setStatus({ type: 'success', text: 'Message sent. I will get back to you soon.' });
      setContactDetail('');
      setOtherDetail('');
      setMessageHtml('');
      setMethod('');
      setEditorKey((k) => k + 1);
    } catch {
      setStatus({ type: 'error', text: 'Network error. Check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const showPrimaryField = method && method !== 'other';
  const showOtherField = method === 'other';

  return (
    <div className="mx-auto flex h-screen w-full max-w-2xl flex-col items-center overflow-y-auto p-6 pb-56 pt-20 scrollbar-hide md:pt-32 md:pb-12">
      <TiltCard className="w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel glass-panel-hover relative w-full overflow-hidden rounded-2xl border-zinc-800/50 text-zinc-100 shadow-lg"
        >
          <Card className="gap-0 border-0 bg-transparent py-0 shadow-none">
            <CardHeader className="space-y-1 border-b border-white/5 bg-black/20 px-6 py-5">
              <CardTitle className="text-2xl font-semibold text-zinc-100">Contact me</CardTitle>
              <CardDescription className="text-zinc-400">
                Pick how to reach you, add your details, and send a message.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label htmlFor="contact-method">How should I contact you?</Label>
                  <Select
                    value={method || undefined}
                    onValueChange={(v) => {
                      setMethod(v);
                      setErrors({});
                      setStatus(null);
                    }}
                  >
                    <SelectTrigger
                      id="contact-method"
                      className="h-11 w-full rounded-xl border-white/10 bg-black/20"
                      aria-invalid={!!errors.method}
                    >
                      <SelectValue placeholder="Email, phone, text, or other" />
                    </SelectTrigger>
                    <SelectContent>
                      {METHODS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.method && <p className="text-sm text-red-400">{errors.method}</p>}
                </div>

                {showPrimaryField && (
                  <div className="space-y-2">
                    <Label htmlFor="contact-detail">{contactFieldLabel(method)}</Label>
                    <Input
                      id="contact-detail"
                      type={method === 'email' ? 'email' : 'text'}
                      value={contactDetail}
                      onChange={(e) => {
                        setContactDetail(e.target.value);
                        setErrors((prev) => ({ ...prev, contactDetail: undefined }));
                      }}
                      className="border-white/10 bg-black/20"
                      placeholder={method === 'email' ? 'you@example.com' : '+1 …'}
                      aria-invalid={!!errors.contactDetail}
                      autoComplete={method === 'email' ? 'email' : 'tel'}
                    />
                    {errors.contactDetail && (
                      <p className="text-sm text-red-400">{errors.contactDetail}</p>
                    )}
                  </div>
                )}

                {showOtherField && (
                  <div className="space-y-2">
                    <Label htmlFor="other-detail">How do you want me to contact you?</Label>
                    <Input
                      id="other-detail"
                      value={otherDetail}
                      onChange={(e) => {
                        setOtherDetail(e.target.value);
                        setErrors((prev) => ({ ...prev, otherDetail: undefined }));
                      }}
                      className="border-white/10 bg-black/20"
                      placeholder="e.g. Signal, Discord, preferred times…"
                      aria-invalid={!!errors.otherDetail}
                    />
                    {errors.otherDetail && (
                      <p className="text-sm text-red-400">{errors.otherDetail}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="message-editor">Message</Label>
                  <ContactMessageEditor key={editorKey} value={messageHtml} onChange={setMessageHtml} />
                  <p className="text-xs text-zinc-500">Use the toolbar to format your message (optional).</p>
                </div>

                {status?.type === 'error' && (
                  <p className="text-sm text-red-400" role="alert">
                    {status.text}
                  </p>
                )}
                {status?.type === 'success' && (
                  <p className="text-sm text-emerald-400" role="status">
                    {status.text}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={submitting}
                  className="glass-button-3d w-full rounded-xl !bg-blue-600 !text-white hover:!bg-blue-500 hover:!text-white"
                >
                  {submitting ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </TiltCard>
    </div>
  );
}
