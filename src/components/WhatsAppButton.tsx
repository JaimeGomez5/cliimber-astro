export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/34609575722?text=Hola%20Jaime%2C%20he%20visto%20tu%20web%20y%20me%20interesa%20hablar%20sobre%20mi%20proyecto"
      target="_blank"
      rel="noreferrer"
      aria-label="Contactar por WhatsApp"
      className="whatsapp-btn"
      style={{
        position: "fixed",
        zIndex: 999,
        borderRadius: "50%",
        background: "#25D366",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.05)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 24px rgba(0,0,0,0.32)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.668 4.61 1.832 6.504L4 29l7.695-1.813A11.94 11.94 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3z" fill="#fff"/>
        <path d="M21.72 18.72c-.297-.148-1.757-.867-2.03-.967-.272-.099-.47-.148-.668.149-.198.296-.767.967-.94 1.165-.173.198-.347.223-.644.074-.297-.148-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.457.13-.605.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.372-.025-.52-.074-.149-.668-1.611-.915-2.206-.241-.579-.486-.5-.668-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.073.149.198 2.095 3.2 5.076 4.487.71.307 1.263.49 1.695.627.712.226 1.36.194 1.872.118.571-.085 1.757-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#25D366"/>
      </svg>
    </a>
  );
}
