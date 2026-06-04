import { useForm, ValidationError } from '@formspree/react';

export default function ContactForm({ dark = false }: { dark?: boolean }) {
  const [state, handleSubmit] = useForm('xdajjggv');

  const fieldStyle = dark
    ? { background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.18)', color: 'var(--texto-claro)' }
    : { borderColor: 'var(--borde)' };
  const selectStyle = dark
    ? { background: '#1a3a4a', borderColor: 'rgba(255,255,255,0.18)', color: '#f5f8f9' }
    : { borderColor: 'var(--borde)' };
  const optionStyle = dark ? { background: '#1a3a4a', color: '#f5f8f9' } : {};
  const formStyle = dark
    ? { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' }
    : { borderColor: 'var(--borde)' };
  const footerColor = dark ? 'rgba(245,248,249,0.5)' : 'var(--texto-apagado)';

  if (state.succeeded) {
    return (
      <div className="rounded-2xl p-8 border text-center" style={dark ? { background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)' } : { background: '#fff', borderColor: 'var(--borde)' }}>
        <p className="text-xl font-bold" style={{ color: 'var(--verde)' }}>Gracias, te respondo hoy.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl p-6 md:p-8 border space-y-4" style={formStyle}>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required name="name" autoComplete="name" placeholder="Nombre" className="px-4 py-3 rounded-lg border w-full" style={fieldStyle} />
        <input required name="business" placeholder="Nombre de empresa" className="px-4 py-3 rounded-lg border w-full" style={fieldStyle} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <input required type="email" name="email" autoComplete="email" placeholder="Email" className="px-4 py-3 rounded-lg border w-full" style={fieldStyle} />
        <ValidationError field="email" prefix="Email" errors={state.errors} className="text-red-500 text-sm" />
        <input type="tel" inputMode="tel" name="phone" autoComplete="tel" placeholder="Teléfono / WhatsApp" className="px-4 py-3 rounded-lg border w-full" style={fieldStyle} />
      </div>
      <select required name="situation" className="px-4 py-3 rounded-lg border w-full" style={selectStyle}>
        <option value="" disabled style={optionStyle}>¿Cuál es tu situación?</option>
        <option style={optionStyle}>Tengo web pero no me trae clientes</option>
        <option style={optionStyle}>Solo tengo Instagram y quiero web propia</option>
        <option style={optionStyle}>Tengo un proyecto nuevo y necesito construirlo</option>
        <option style={optionStyle}>Necesito una herramienta a medida (calculadora, quiz...)</option>
        <option style={optionStyle}>Quiero SEO/SEM pero sin empezar de cero</option>
      </select>
      <textarea rows={4} name="message" placeholder="Cuéntame más (opcional)" className="px-4 py-3 rounded-lg border w-full" style={fieldStyle} />
      <button type="submit" disabled={state.submitting} className="btn btn-primary w-full">
        {state.submitting ? 'Enviando…' : 'Enviar → te respondo hoy'}
      </button>
      <p className="text-xs text-center" style={{ color: footerColor }}>Sin formularios que no contestan. Te respondo yo directamente.</p>
    </form>
  );
}
