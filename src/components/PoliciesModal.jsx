const PoliciesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-y-auto border border-gray-200">
                {/* Cabecera del modal */}
                <div className="bg-teal-600 text-white p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16" className="mr-3 flex-shrink-0">
                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
                        </svg>
                        <h2 className="text-xl font-bold underline decoration-2 underline-offset-2">Políticas de Uso y Seguridad</h2>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-teal-700"
                        aria-label="Cerrar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>
                </div>

                {/* Contenido del modal */}
                <div className="p-6 space-y-8">
                    <div className="border-l-4 border-teal-600 pl-4">
                        <h3 className="text-lg font-semibold mb-3 text-teal-800">Políticas Generales para Tours y Experiencias</h3>
                        <p className="text-gray-700 mb-4 text-justify leading-relaxed">
                            Para ofrecer una experiencia segura y organizada, todos los usuarios de nuestra plataforma deben aceptar y cumplir nuestras
                            Políticas Generales de Uso y Seguridad. A continuación, detallamos las normas esenciales que aplican a todos los tours
                            reservados a través de nuestra plataforma.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {/* Sección 1: Reservas y Pagos */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2.5 1a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h2a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-2zm0 3a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5zm0 2a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3 0a.5.5 0 0 0 0 1h2a.5.5 0 0 0 0-1h-2zm3 0a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm3-3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1zm0-3a.5.5 0 0 0 0 1h1a.5.5 0 0 0 0-1h-1z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Reservas y Pagos</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed ">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Todas las reservas deben realizarse a través de la plataforma y confirmarse mediante pago.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Los precios incluyen únicamente lo especificado en la descripción del tour. Costos adicionales, como transporte personal, correrán por cuenta del viajero.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Al reservar un tour, el usuario acepta las condiciones establecidas por el anfitrión/guía.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Sección 2: Cancelaciones */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Cancelaciones y Reembolsos</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Cancelaciones por parte del viajero: Se aplicarán cargos según el tiempo de antelación. Algunos tours pueden ser no reembolsables.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Cancelaciones por parte del operador: En caso de que el guía/anfitrión cancele un tour, se ofrecerá un reembolso total o la opción de reagendar.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Condiciones climáticas y fuerza mayor: Si el tour no puede realizarse debido a condiciones climáticas extremas u otros eventos imprevistos, se notificará a los viajeros con la mayor anticipación posible.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Sección 3: Seguridad */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Normas de Seguridad y Responsabilidad</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Todos los participantes deben seguir las instrucciones del guía para garantizar su seguridad y disfrutar experiencias.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>La plataforma no se hace responsable por accidentes o incidentes ocurridos durante la experiencia, aunque trabajamos con anfitriones verificados para minimizar riesgos.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Se recomienda contar con un seguro de viaje para cualquier eventualidad.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Sección 4: Conducta */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                        <path d="M11.315 10.014a.5.5 0 0 1 .548.736A4.498 4.498 0 0 1 7.965 13a4.498 4.498 0 0 1-3.898-2.25.5.5 0 0 1 .548-.736h.005l.017.005.067.015.252.055c.215.046.515.108.857.169.693.124 1.522.242 2.152.242.63 0 1.46-.118 2.152-.242a26.58 26.58 0 0 0 1.109-.224l.067-.015.017-.004.005-.002zM4.756 4.566c.763-1.424 4.02-.12.952 3.434-4.496-1.596-2.35-4.298-.952-3.434zm6.488 0c1.398-.864 3.544 1.838-.952 3.434-3.067-3.554.19-4.858.952-3.434z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Conducta y Respeto</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Se espera un comportamiento adecuado y respetuoso entre los participantes, anfitriones y la comunidad local.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Cualquier comportamiento agresivo, discriminatorio o ilegal resultará en la expulsión del tour sin derecho a reembolso.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Los anfitriones tienen derecho a rechazar a cualquier viajero que represente un riesgo para la seguridad o la experiencia del grupo.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Sección 5: Propiedad */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path fillRule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM5.5 8a.5.5 0 0 0-1 0v1.5a.5.5 0 0 0 1 0V8zm2.5.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Propiedad y Daños</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>El usuario es responsable de cuidar el equipo o propiedad proporcionada durante la experiencia.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>En caso de daños causados por el viajero, éste deberá asumir el costo de la reparación o reemplazo.</span>
                                </li>
                            </ul>
                        </div>
                        
                        {/* Sección 6: Privacidad */}
                        <div className="bg-teal-50 border border-teal-100 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                            <div className="flex items-center p-4 border-b border-teal-100">
                                <div className="bg-teal-100 rounded-full p-2 mr-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-teal-700">
                                        <path d="M4 0h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm9 1.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zm2 0a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zM8 5a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM.5 12a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM.5 10a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM.5 8a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM.5 6a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM.5 4a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5zM.5 2a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1H.5z"/>
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-teal-800">Privacidad y Uso de Datos</h4>
                            </div>
                            <ul className="text-sm text-gray-700 space-y-3 p-4 leading-relaxed">
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>La plataforma protege la información de los usuarios y no comparte datos personales con terceros sin consentimiento.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-teal-600 mr-2 font-bold">•</span>
                                    <span>Los viajeros aceptan que los anfitriones pueden tomar fotografías durante los tours con fines promocionales, a menos que expresen lo contrario.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    {/* Sección de modificaciones de políticas */}
                    <div className="bg-gray-100 p-5 rounded-lg border-l-4 border-gray-400">
                        <div className="flex items-center mb-3">
                            <div className="bg-gray-300 rounded-full p-2 mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" className="text-gray-700">
                                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h13zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z"/>
                                    <path d="M7.293 6.293a1 1 0 0 1 1.414 0L10 7.586l1.293-1.293a1 1 0 1 1 1.414 1.414L11.414 9l1.293 1.293a1 1 0 0 1-1.414 1.414L10 10.414l-1.293 1.293a1 1 0 0 1-1.414-1.414L8.586 9 7.293 7.707a1 1 0 0 1 0-1.414z"/>
                                </svg>
                            </div>
                            <h4 className="font-semibold text-gray-800">Modificaciones en las Políticas</h4>
                        </div>
                        <p className="text-sm text-gray-700 text-justify ml-10 leading-relaxed">
                            Nos reservamos el derecho de modificar estas políticas en cualquier momento. Las actualizaciones se notificarán a los usuarios a través de la plataforma.
                        </p>
                    </div>
                    
                    {/* Botones de acción */}
                    <div className="mt-8 flex justify-end space-x-4">
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Cerrar
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-300 font-medium shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        >
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PoliciesModal;
