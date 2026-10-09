// Single source of truth for contact information.
export const CONTACT = {
  phone: "34609575722",
  whatsapp: "https://wa.me/34609575722",
  email: "jaimegomez@cliimber.com",
  social: {} as Record<string, string>,
};

// Datos del titular para el aviso legal y la política de privacidad (LSSI y RGPD).
// NIF y domicilio: vacíos no se muestran. Basta con rellenarlos aquí para que aparezcan en las dos páginas.
export const LEGAL = {
  titular: "Jaime Gómez de Alvaré",
  nif: "",
  domicilio: "",
  email: CONTACT.email,
};
