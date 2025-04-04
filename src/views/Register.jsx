import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import viajeGlobo from "../assets/viaje en globo.jpg";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correoElectronico: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case "nombre":
        if (!value.trim()) {
          return "El nombre es requerido";
        } else if (value.length < 3) {
          return "El nombre debe tener al menos 3 caracteres";
        } else if (value.length > 50) {
          return "El nombre no puede exceder 50 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
          return "El nombre solo debe contener letras";
        }
        return "";

      case "apellido":
        if (!value.trim()) {
          return "El apellido es requerido";
        } else if (value.length < 3) {
          return "El apellido debe tener al menos 3 caracteres";
        } else if (value.length > 50) {
          return "El apellido no puede exceder 50 caracteres";
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(value)) {
          return "El apellido solo debe contener letras";
        }
        return "";

      case "correoElectronico":
        if (!value.trim()) {
          return "El correo electrónico es requerido";
        } else if (!value.includes("@")) {
          return "El correo debe contener el símbolo @";
        } else if (value.includes("ñ")) {
          return "El correo no debe contener la ñ";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Ingresa un correo electrónico válido";
        } else if (value.length > 100) {
          return "El correo electrónico no puede exceder 100 caracteres";
        }
        return "";

      case "password":
        if (!value) {
          return "La contraseña es requerida";
        } else if (value.length < 6) {
          return "La contraseña debe tener al menos 6 caracteres";
        } else if (value.length > 50) {
          return "La contraseña no puede exceder 50 caracteres";
        } else if (
          !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(
            value
          )
        ) {
          return "La contraseña debe contener al menos una letra minúscula, una letra mayúscula, un número y un carácter especial";
        }
        return "";

      case "confirmPassword":
        if (!value) {
          return "Confirma tu contraseña";
        } else if (value !== formData.password) {
          return "Las contraseñas no coinciden";
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar todos los campos
    Object.keys(formData).forEach((field) => {
      const errorMessage = validateField(field, formData[field]);
      if (errorMessage) {
        newErrors[field] = errorMessage;
      }
    });

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Si el campo ya fue tocado, valida en tiempo real mientras se escribe
    if (touchedFields[name]) {
      const errorMessage = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Marca el campo como tocado
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Valida el campo individual
    const errorMessage = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Marca todos los campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouchedFields(allTouched);

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl =
        import.meta.env.VITE_API_URL_DEVELOPMENT ||
        import.meta.env.VITE_API_URL_PRODUCTION;
      // Eliminamos confirmPassword antes de enviar al servidor
      const { confirmPassword, ...dataToSubmit } = formData;
      const response = await axios.post(
        `${apiUrl}/user/registro`,
        dataToSubmit
      );

      if (response.status === 201) {
        navigate("/login", { state: { message: "¡Registro exitoso!" } });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          api:
            error.response.data.message ||
            "Ocurrió un error durante el registro",
        });
      } else {
        setErrors({ api: "Error de conexión. Intente nuevamente más tarde." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${viajeGlobo})` }}
    >
      <div className="bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          ¡Bienvenido a GO Trip!
        </h2>

        {errors.api && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errors.api}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 bg-green-50 rounded-md ${
                errors.nombre ? "border border-red-500" : ""
              }`}
            />
            {errors.nombre && touchedFields.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              name="apellido"
              placeholder="Apellido"
              value={formData.apellido}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 bg-green-50 rounded-md ${
                errors.apellido ? "border border-red-500" : ""
              }`}
            />
            {errors.apellido && touchedFields.apellido && (
              <p className="text-red-500 text-sm mt-1">{errors.apellido}</p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="correoElectronico"
              placeholder="Correo Electrónico"
              value={formData.correoElectronico}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 bg-green-50 rounded-md ${
                errors.correoElectronico ? "border border-red-500" : ""
              }`}
            />
            {errors.correoElectronico && touchedFields.correoElectronico && (
              <p className="text-red-500 text-sm mt-1">
                {errors.correoElectronico}
              </p>
            )}
          </div>

          <div className="mb-4">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 bg-green-50 rounded-md ${
                errors.password ? "border border-red-500" : ""
              }`}
            />
            {errors.password && touchedFields.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full p-3 bg-green-50 rounded-md ${
                errors.confirmPassword ? "border border-red-500" : ""
              }`}
            />
            {errors.confirmPassword && touchedFields.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition duration-300"
          >
            {isSubmitting ? "Registrando..." : "Registrarse"}
          </button>

          <p className="mt-4 text-center">
            ¿Ya tienes una cuenta?{" "}
            <a href="/login" className="text-teal-600 hover:underline">
              Iniciar sesión
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
