export const validationBookingForm = ({ name, lastname, email, message }) => {
  const errors = {};

  // Valida que el nombre y apellido solo contengan letras (sin números ni caracteres especiales, excepto espacios y tildes)
  const regexName = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  //Valida el formato del correo
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  
  if (!name.length) {
    errors.name = 'Debes ingresar tu nombre';
  } else if (name.trim().length < 2) {
    errors.name = 'Debes ingresar un nombre válido con mínimo 2 caracteres';
  } else if (!regexName.test(name)) {
    errors.name = 'El nombre solo debe contener letras';
  } else if (name.trim().length > 50) {
    errors.name = 'El nombre debe contener menos de 50 caracteres';
  }

  if (!lastname.length) {
    errors.lastname = 'Debes ingresar tu apellido';
  } else if (lastname.trim().length < 2) {
    errors.lastname =
      'Debes ingresar un apellido válido con mínimo 2 caracteres';
  } else if (!regexName.test(lastname)) {
    errors.lastname = 'El apellido solo debe contener letras';
  } else if (lastname.trim().length > 50) {
    errors.lastname = 'El apellido debe contener menos de 50 caracteres';
  }

  if (!email.length) {
    errors.email = 'Debes ingresar tu correo electrónico';
  } else if (!regexEmail.test(email)) {
    errors.email = 'Ingresa un correo electrónico válido';
  } else if (email.trim().length > 50) {
    errors.email = 'El correo electrónico debe contener menos de 50 caracteres';
  } else if (email.includes('ñ')) {
    errors.email = 'El correo electrónico no debe contener la ñ';
  }

  if (!message.length) {
    errors.message = 'Debes ingresar un mensaje';
  }else if (message.trim().length < 10) {
    errors.message = 'El mensaje debe contener mínimo 10 caracteres';
  } else if (message.trim().length > 500) {
    errors.message = 'El mensaje debe contener menos de 500 caracteres';
  } 

  return errors;
};
