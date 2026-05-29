import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm() {
  const [state, handleSubmit] = useForm('xdajjggv');

  if (state.succeeded) {
    return (
      <div className="bg-white rounded-2xl p-8 border text-center" style={{ borderColor: 'var(--borde)' }}>
        <p className="text-xl font-bold" style={{ color: 'var(--verde)' }}>Gracias, te respondo hoy.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 md:p-8 border space-y-4" style={{ borderColor: 'var(--borde)' }}>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="name" autoComplete="name" placeholder="Nombre" className="px-4 py-3 rounded-lg border w-full" style={{ borderColor: 'var(--borde)' }} />
        <input required name="business" placeholder="Nombre de empresa" className="px-4 py-3 rounded-lg border w-full" style={{ borderColor: 'var(--borde)' }} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required type="email" name="email" autoComplete="email" placeholder="Email" className="px-4 py-3 rounded-lg border w-full" style={{ borderColor: 'var(--borde)' }} />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-red-500 text-sm" />
        <input type="tel" inputMode="tel" name="phone" autoComplete="tel" placeholder="Teléfono / WhatsApp" className="px-4 py-3 rounded-lg border w-full" style={{ borderColor: 'var(--borde)' }} />
      </div>
      <select required name="situation" className="px-4 py-3 rounded-lg border w-full bg-white" style={{ borderColor: 'var(--borde)' }}>
        <option value="" disabled>¿Cuál es tu situación?</option>
        <option>Tengo web pero no me trae clientes</option>
        <option>Solo tengo Instagram y quiero web propia</option>
        <option>Tengo un proyecto nuevo y necesito construirlo</option>
        <option>Necesito una herramienta a medida (calculadora, quiz...)</option>
        <option>Quiero SEO/SEM pero sin empezar de cero</option>
      </select>
      <textarea rows={4} name="message" placeholder="Cuéntame más (opcional)" className="px-4 py-3 rounded-lg border w-full" style={{ borderColor: 'var(--borde)' }} />
      <button type="submit" disabled={state.submitting} className="btn btn-primary w-full">
        {state.submitting ? 'Enviando…' : 'Enviar → te respondo hoy'}
      </button>
      <p className="text-xs text-center" style={{ color: 'var(--texto-apagado)' }}>Sin formularios que no contestan. Te respondo yo directamente.</p>
    </form>
  );
}
