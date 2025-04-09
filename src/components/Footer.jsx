import { useState } from 'react';
import logo from '../assets/logoApp.png';
import PoliciesModal from './PoliciesModal';
import { Link } from 'react-router-dom';
import { FaInstagram } from 'react-icons/fa';
import { FaSquareFacebook } from 'react-icons/fa6';
import { GrLinkedin } from 'react-icons/gr';

const Footer = () => {
  const [isPoliciesModalOpen, setIsPoliciesModalOpen] = useState(false);

  const openPoliciesModal = () => {
    setIsPoliciesModalOpen(true);
  };

  const closePoliciesModal = () => {
    setIsPoliciesModalOpen(false);
  };

  return (
    <footer className="w-full bg-[#3C6E71] text-white mt-auto space-y-3">
      <section className="mx-auto w-full max-w-screen-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-5 lg:p-8 gap-6 md:gap-8">
        {/* Logo info empresa */}
        <article className="text-left md:text-center md:col-span-2 lg:col-span-1  ">
          <div className="flex flex-col justify-center items-center lg:text-left gap-3 ">
            <div className="w-full flex justify-start items-center md:justify-center lg:justify-start gap-2">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                <img
                  src={logo}
                  alt="Logo de la empresa"
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="font-medium text-xl md:text-2xl  tracking-wide">
                Go Trip
              </h2>
            </div>
            <p className="font-light md:text-xl">
              Plataforma creada para facilitar tu asistencia a los diferentes
              eventos que se realizan a nivel mundial.
            </p>
            <div className="flex self-start md:self-center lg:self-start gap-2">
              <a href="https://www.instagram.com/" target="_blank">
                {' '}
                <FaInstagram className="cursor-pointer text-2xl lg:text-3xl hover:bg-white/30 hover:rounded-full hover:p-2" />
              </a>
              <a href="https://www.facebook.com/" target="_blank">
                <FaSquareFacebook className="cursor-pointer text-2xl lg:text-3xl hover:bg-white/30 hover:rounded-full hover:p-2" />
              </a>
              <a href="https://www.linkedin.com/" target="_blank">
                <GrLinkedin className="cursor-pointer text-2xl lg:text-[29px] hover:bg-white/30 hover:rounded-full hover:p-2" />
              </a>
            </div>
          </div>
        </article>
        {/* Servicios */}
        <article className="flex flex-col gap-2 md:justify-self-end lg:justify-self-center">
          <h2 className="font-medium text-xl md:text-2xl  tracking-wide">
            Inicia Tu Aventura
          </h2>
          <ul className="font-light md:text-xl flex flex-col gap-2">
            <li>
              <Link to={'/login'} className="hover:border-b-2">
                Inicio de Sesión
              </Link>
            </li>
            <li>
              <Link to={'/register'} className="hover:border-b-2">
                Registro
              </Link>
            </li>
          </ul>
        </article>
        {/* Contáctanos */}
        <article className="flex flex-col gap-2 md:pl-4 lg:justify-self-end ">
          <h2 className="font-medium text-xl md:text-2xl  tracking-wide">
            Contáctanos
          </h2>
          <ul className="w-full max-w-sm font-light md:text-xl flex flex-col gap-2">
            <li>+45 66834567</li>
            <li className="break-all whitespace-normal">eventos@gotrip.com</li>
            <li>Av Alegre Viva, Calle #02-68</li>
          </ul>
        </article>
      </section>
      <section className="border-gray-500 border-t-[1px] py-3 w-11/12 mx-auto max-w-screen-2xl flex flex-col-reverse md:flex-row md:justify-between items-center gap-4 text-center">
        <p className="font-medium">
          © 2025 Go Trip Todos los derechos reservados
        </p>
        <button
          onClick={openPoliciesModal}
          className="text-white hover:text-teal-300 border-b-2 border-teal-400 pb-1 inline-flex items-center"
        >
          <span className="mr-2">Políticas de Uso y Seguridad</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
        </button>
      </section>
      <PoliciesModal
        isOpen={isPoliciesModalOpen}
        onClose={closePoliciesModal}
      />
    </footer>
  );
};

export default Footer;

/* Diseño footer inicial */
// <div className="container mx-auto px-6 py-4">
// <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between">
//     <div className="flex items-center space-x-4 mb-4 sm:mb-0">
//         <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden bg-white">
//             <img src={logo} alt="Logo de la empresa" className="w-full h-full object-cover" />
//         </div>
//         <div className="text-sm">
//             <p className="font-medium">© 2025 Go Trip Todos los derechos reservados</p>
//         </div>
//     </div>
//     <div>

//                 <button
//                     onClick={openPoliciesModal}
//                     className="text-white hover:text-teal-300 border-b-2 border-teal-400 pb-1 inline-flex items-center"
//                 >
//                     <span className="mr-2">Políticas de Uso y Seguridad</span>
//                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
//                         <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
//                     </svg>
//                 </button>

//     </div>
// </div>
// </div>
// <PoliciesModal isOpen={isPoliciesModalOpen} onClose={closePoliciesModal} />
