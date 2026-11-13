// Alhambra Shopping — texto de la Política General de Protección de Datos
// Personales (PD-PPDP-04-2025), transcrito del PDF de Legal. Las tablas de la
// sección 11 se generaron desde el PDF agrupando las filas por su base de
// legitimación (las celdas combinadas del original). No editar el texto sin
// el visto bueno de Legal. Este archivo no es un componente.

export type PolicyBlock =
    | { p: string }
    | { ol: string[] }
    | { ul: string[] }
    | { defs: [string, string][] }
    | { contact: [string, string, string?][] }
    | { tables: PolicyTable[] }

export type PolicyTable = { who: string; groups: { base: string; items: [string, string][] }[] }
export type PolicySection = { id: string; title: string; blocks: PolicyBlock[] }

export const POLICY_META = {
    company: "Comercializadora Inmobiliaria Alhambra Cobilhambra S.A.",
    version: "1",
    code: "PD-PPDP-04-2025",
    date: "01/07/2024",
    email: "protecciondedatos@eljuri.com",
}

const TABLES: PolicyTable[] = [
    {
        "who": "Aplicantes",
        "groups": [
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Reclutamiento",
                        "Para recopilar las aplicaciones a puestos de trabajo para el proceso de selección."
                    ],
                    [
                        "Selección de personal",
                        "Para gestionar el proceso de selección y entrevistas, previo a la formalización de una relación con la Compañía."
                    ],
                    [
                        "Comunicaciones",
                        "Para que Alhambra se pueda contactar constantemente con el aplicante, y así informarle sobre el estado del proceso de selección."
                    ],
                    [
                        "Envío de información comercial, promociones, descuentos, sorteos y eventos",
                        "Para enviar información promocional, ofertas, descuentos, sorteos y eventos de forma personalizada a través de los canales con los que cuente Alhambra, tomando en cuenta los intereses, y necesidades del Titular."
                    ],
                    [
                        "Gestión de sorteos y eventos",
                        "Gestionar su participación en los eventos, y sorteos de Alhambra."
                    ]
                ]
            },
            {
                "base": "Ejecución de medidas precontractuales y el cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Exámenes preocupacionales",
                        "Para verificar el estado de salud, y por ende, si el Titular es apto para el puesto de trabajo al que aplica."
                    ]
                ]
            },
            {
                "base": "Tratamiento de Datos Personales que constan en bases de datos de acceso público e interés legítimo",
                "items": [
                    [
                        "Comprobación y verificación de la identidad y antecedentes penales, disciplinarios financieros y crediticios",
                        "Para verificar la veracidad de la información proporcionada por el Titular a través de registros públicos."
                    ]
                ]
            }
        ]
    },
    {
        "who": "Trabajadores",
        "groups": [
            {
                "base": "Ejecución de medidas precontractuales o el cumplimiento de obligaciones contractuales",
                "items": [
                    [
                        "Contratación",
                        "Para formalizar la relación laboral con el trabajador con la suscripción del contrato laboral."
                    ],
                    [
                        "Comunicaciones",
                        "Para mantener una comunicación directa con los trabajadores sobre temas relacionados con la relación laboral."
                    ],
                    [
                        "Ingreso a las instalaciones",
                        "Para que los trabajadores puedan ingresar a las instalaciones de la Compañía, a fin de que puedan realizar sus labores."
                    ],
                    [
                        "Entrega de equipos",
                        "Para proporcionar a los trabajadores las herramientas, y equipos que requieran acceso para realizar sus labores."
                    ],
                    [
                        "Alta y baja de perfil de usuario",
                        "Para que el Titular pueda tener acceso a los aplicativos y sistemas necesarios para el cumplimiento de sus labores."
                    ],
                    [
                        "Acciones correctivas",
                        "Para gestionar y registrar, de acuerdo con el Reglamento Interno de Trabajo, las acciones correspondientes por infracciones leves y graves."
                    ],
                    [
                        "Capacitaciones",
                        "Para mantener a los trabajadores debidamente actualizados, aptos y competentes para la gestión de sus labores."
                    ],
                    [
                        "Evaluación de desempeño",
                        "Para evaluar el cumplimiento de objetivos por parte de los trabajadores."
                    ],
                    [
                        "Pago a nómina",
                        "Para gestionar el pago de la remuneración y descuentos aplicables a los trabajadores."
                    ],
                    [
                        "Control de asistencia",
                        "Para validar el cumplimiento del horario laboral por parte de los trabajadores, y de corresponder, realizar el cálculo para el pago de horas suplementarias o extraordinarias."
                    ],
                    [
                        "Gestión de viajes por asuntos laborales",
                        "Para gestionar la compra de pasajes, reserva de hoteles para los viajes relacionados a asuntos laborales."
                    ],
                    [
                        "Pago de viáticos",
                        "Para gestionar el pago de los viáticos para los viajes que realicen los trabajadores con relación a asuntos laborales."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Gestión de seguridad social",
                        "Para afiliar al trabajador al Instituto Ecuatoriano de Seguridad Social – IESS, realizar los descuentos de su remuneración para los aportes, y llevar a cabo las demás actividades correspondientes, en cumplimiento con la normativa laboral y de seguridad social."
                    ],
                    [
                        "Gestión frente al Ministerio de Trabajo",
                        "Para gestionar todos los procesos asociados frente al Ministerio de Trabajo y establecidos en la normativa laboral vigente."
                    ],
                    [
                        "Exámenes ocupacionales",
                        "Para verificar el estado de salud, y validar si es apto del trabajador para desempeñar las actividades laborales que realiza."
                    ],
                    [
                        "Exámenes de salida",
                        "Para verificar el estado de salud de trabajador saliente."
                    ],
                    [
                        "Pago de beneficios de ley y utilidades",
                        "Para realizar el pago de horas suplementarias y/o extraordinarias, décimos, vacaciones y demás beneficios de ley previstos en la normativa laboral, utilidades, y realizar las gestiones correspondientes frente al Ministerio de Trabajo."
                    ],
                    [
                        "Gestión de accidentes laborales",
                        "Para las gestiones correspondientes frente a las entidades públicas competentes, de acuerdo con la normativa laboral y de seguridad social."
                    ],
                    [
                        "Conservación de la información de la relación laboral",
                        "Para mantener en los soportes físicos o digitales de la Compañía, para cumplir con requerimientos de información de autoridades competentes, solicitudes de los Titulares, o defensa de los intereses de la Compañía."
                    ],
                    [
                        "Actualización de información",
                        "Para solicitar la actualización periódicos de los Datos Personales suministrados."
                    ],
                    [
                        "Respuesta a requerimientos de autoridades competentes y el cumplimiento de sus mandatos",
                        "Para gestionar la transferencia de información que solicite una autoridad competente, en observancia de los principios establecidos en la LOPDP."
                    ]
                ]
            },
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Afiliación al seguro de salud privado",
                        "Suministrar la información y Datos Personales de los Titulares interesados a los asesores corredores de seguro y/o a las Compañías de seguro o de medicina prepagada."
                    ],
                    [
                        "Envío de información comercial, promociones, descuentos, sorteos y eventos",
                        "Para enviar información promocional, ofertas, descuentos, sorteos y eventos de forma personalizada a través de los canales con los que cuente Alhambra, tomando en cuenta los intereses, y necesidades del Titular."
                    ],
                    [
                        "Gestión de sorteos y eventos",
                        "Gestionar su participación en los eventos, y sorteos de Alhambra."
                    ],
                    [
                        "Análisis estadísticos, comerciales, financieros, sociales y técnicos, y elaboración de perfiles",
                        "Para realizar análisis con el fin de mejorar los productos o servicios que ofrece Alhambra de acuerdo con las necesidades e intereses. Esto incluye la posibilidad de realizar procedimientos automatizados para brindar servicios o productos personalizados."
                    ],
                    [
                        "Sistema biométrico de identificación y autenticación para el control de asistencia laboral",
                        "Para validar el cumplimiento del horario laboral por parte de los trabajadores mediante sistemas biométricos de identificación, y de corresponder, realizar el cálculo para el pago de horas suplementarias o extraordinarias."
                    ]
                ]
            },
            {
                "base": "Órdenes judiciales",
                "items": [
                    [
                        "Descuentos judiciales",
                        "Para realizar los descuentos correspondientes a la remuneración del trabajador en cumplimiento de lo ordenado por un juez competente, en observancia de los principios establecidos en la LOPDP."
                    ],
                    [
                        "Respuesta a requerimientos de entes judiciales y el cumplimiento de sus mandatos",
                        "Transferencia de información que soliciten jueces y tribunales, en observancia de los principios establecidos en la LOPDP."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de una misión realizada en interés público e interés legítimo",
                "items": [
                    [
                        "Videovigilancia",
                        "Para la seguridad interna y externa de las personas, bienes e información de Alhambra."
                    ],
                    [
                        "Sistema de control de acceso y salida del parqueadero mediante identificación y autenticación biométrica",
                        "identificar y autenticar a las personas que ingresan y salen del parqueadero de Alhambra, generar y validar mecanismos de correspondencia entre el ingreso y la salida de cada usuario y vehículo, prevenir accesos o salidas no autorizadas y fortalecer la seguridad y protección de las personas, vehículos y bienes dentro de las instalaciones de los Establecimientos de Alhambra"
                    ]
                ]
            }
        ]
    },
    {
        "who": "Clientes y potenciales clientes",
        "groups": [
            {
                "base": "Ejecución de medidas precontractuales o el cumplimiento de obligaciones contractuales",
                "items": [
                    [
                        "Desarrollo, ejecución y cumplimiento de la relación contractual",
                        "Para el envío de proformas, formalizar la relación con el Titular, crear al Titular como cliente en los soportes de Alhambra, entregar los productos o brindar los servicios contratados, y atender los requerimientos relacionados a la relación comercial. Esto también involucra el envío de los Datos Personales a otras Compañías del grupo, aliados comerciales y partes relacionadas que sean necesarios para el desarrollo, ejecución y cumplimiento de la relación."
                    ],
                    [
                        "Gestión de actividades contables y de cobranza",
                        "Para realizar las actividades inherentes a la facturación, cobro, refinanciamiento, gestión de cartera extrajudicial y judicial, devolución, actualización de información crediticia, entre otras."
                    ],
                    [
                        "Venta de cartera",
                        "Para realizar la venta de la cartera de deudores de Alhambra"
                    ],
                    [
                        "Realizar todas las gestiones de orden tributario",
                        "Para el cumplimiento de las obligaciones de carácter tributario, emisión de facturas, y declaraciones tributarias frente a la autoridad tributaria, en virtud de las normas tributarias competentes vigentes."
                    ],
                    [
                        "Gestión de actividades con auditoría externa",
                        "Para el envío de información a auditor externo, en virtud de las normas societarias vigentes."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Respuesta a requerimientos de autoridades competentes y el cumplimiento de sus mandatos",
                        "Para gestionar la transferencia de información que solicite una autoridad competente, en observancia de los principios establecidos en la LOPDP."
                    ],
                    [
                        "Cunplimiento a requerimientos de autoridades competentes y el cumplimiento de sus mandatos respecto a Lavado de Activos",
                        "Para obtener y gestionar la transferencia de información que solicite la Unidad de Análisis Financiero y Económico (UAFE) como sujeto obligado a reportar información solicitada por la autoridad comeptente"
                    ]
                ]
            },
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Envío de información comercial, promociones, descuentos",
                        "Para enviar información promocional, ofertas, descuentos, de forma personalizada a través de los canales con los que cuente Alhambra, tomando en cuenta los intereses, y necesidades del Titular."
                    ],
                    [
                        "Gestión de sorteos y eventos",
                        "Gestionar su participación en los eventos, y sorteos de Alhambra"
                    ],
                    [
                        "Análisis estadísticos, comerciales, financieros, sociales y técnicos, y elaboración de perfiles",
                        "Para realizar análisis con el fin de mejorar los productos o servicios que ofrece Alhambra de acuerdo con las necesidades e intereses. Esto incluye la posibilidad de realizar procedimientos automatizados para brindar servicios o productos personalizados."
                    ],
                    [
                        "Efectuar encuestas de satisfacción respecto de los bienes y servicios de Alhambra",
                        "Para conocer sobre la experiencia del Titular y la mejora de bienes o servicios de Alhambra."
                    ],
                    [
                        "Gestión de solicitudes, quejas o reclamos",
                        "Para atender los requerimientos que tengan los Titulares de Datos Personales, a través de los mecanismos habilitados por Alhambra."
                    ],
                    [
                        "Actualización de información",
                        "Para solicitar la actualización periódicos de los Datos Personales suministrados."
                    ],
                    [
                        "Conservación de la información de la relación",
                        "Para mantener en los soportes físicos o digitales de la Compañía, para cumplir con requerimientos de información de autoridades competentes, solicitudes de los Titulares, o defensa de los intereses de la Compañía."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de una misión realizada en interés público e interés legítimo",
                "items": [
                    [
                        "Videovigilancia",
                        "Para la seguridad interna y externa de las personas, bienes e información de Alhambra."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de obligaciones legales y contractuales",
                "items": [
                    [
                        "Envío de información",
                        "Dar a conocer, transferir o comunicar Datos Personales dentro y fuera del país a las Compañías matrices, filiales o subsidiarias o aliados comerciales, o a otras sociedades o personas que Alhambra encargue para realizar el Tratamiento de la información y cumplir con las finalidades descritas en la presente Política y el objeto de la relación comercial con los Titulares."
                    ]
                ]
            },
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Encuestas de satisfacción",
                        "Para conocer sobre su experiencia para la mejora de nuestros productos."
                    ],
                    [
                        "Envío de estado de cuenta",
                        "Elaborar y enviar periódicamente al Titular el estado de cuenta correspondiente a las concesiones de espacio que se otorga a los concesionarios para que operen sus negocios dentro del Centro Comercial Alhambra Shopping"
                    ]
                ]
            },
            {
                "base": "Órdenes judiciales",
                "items": [
                    [
                        "Respuesta a requerimientos de entes judiciales y el cumplimiento de sus mandatos",
                        "Transferencia de información que soliciten jueces y tribunales, en observancia de los principios establecidos en la LOPDP."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de una misión realizada en interés público e interés legítimo",
                "items": [
                    [
                        "Sistema de control de acceso y salida del parqueadero mediante identificación y autenticación biométrica",
                        "identificar y autenticar a las personas que ingresan y salen del parqueadero de Alhambra, generar y validar mecanismos de correspondencia entre el ingreso y la salida de cada usuario y vehículo, prevenir accesos o salidas no autorizadas y fortalecer la seguridad y protección de las personas, vehículos y bienes dentro de las instalaciones de los Establecimientos de Alhambra"
                    ]
                ]
            }
        ]
    },
    {
        "who": "Proveedores",
        "groups": [
            {
                "base": "Ejecución de medidas precontractuales o el cumplimiento de obligaciones contractuales",
                "items": [
                    [
                        "Calificación de proveedores",
                        "Para validar y realizar una verificación de la información de aquellos proveedores que desean prestar servicios o vender bienes a Alhambra"
                    ],
                    [
                        "Desarrollo, ejecución y cumplimiento de la relación contractual",
                        "Gestionar las relaciones comerciales que surjan, con el objeto de adquirir productos o servicios que ofrecen los proveedores para ayudar a la gestión administrativa de Alhambra"
                    ],
                    [
                        "Comunicaciones",
                        "Para mantener comunicación directa con los Titulares para temas relacionados con su relación comercial."
                    ],
                    [
                        "Pago",
                        "Gestionar y realizarle los pagos correspondientes por la prestación de los servicios o entrega de los bienes adquiridos."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Realizar todas las gestiones de orden tributario",
                        "Para el cumplimiento de las obligaciones de carácter tributario, emisión de comprobantes de retención, y declaraciones tributarias frente a la autoridad tributaria competente, en virtud de las normas tributarias vigentes."
                    ],
                    [
                        "Gestión de actividades con auditoría externa",
                        "Para el envío de información a auditor externo, en virtud de las normas societarias vigentes."
                    ],
                    [
                        "Respuesta a requerimientos de autoridades competentes y el cumplimiento de sus mandatos",
                        "Para gestionar la transferencia de información que solicite una autoridad competente, en observancia de los principios establecidos en la LOPDP."
                    ]
                ]
            },
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Envío de información comercial, promociones, descuentos, sorteos y eventos",
                        "Para enviar información promocional, ofertas, descuentos, sorteos y eventos de forma personalizada a través de los canales con los que cuente Alhambra, tomando en cuenta los intereses, y necesidades del Titular."
                    ],
                    [
                        "Gestión de sorteos y eventos",
                        "Gestionar su participación en los eventos, y sorteos de Alhambra."
                    ],
                    [
                        "Análisis estadísticos, comerciales, financieros, sociales y técnicos, y elaboración de perfiles",
                        "Para realizar análisis con el fin de mejorar los productos o servicios que ofrece Alhambra de acuerdo con las necesidades e intereses. Esto incluye la posibilidad de realizar procedimientos automatizados para brindar servicios o productos personalizados."
                    ]
                ]
            },
            {
                "base": "Órdenes judiciales",
                "items": [
                    [
                        "Respuesta a requerimientos de entes judiciales y el cumplimiento de sus mandatos",
                        "Transferencia de información que soliciten jueces y tribunales, en observancia de los principios establecidos en la LOPDP."
                    ]
                ]
            },
            {
                "base": "Cumplimiento de una misión realizada en interés público e interés legítimo",
                "items": [
                    [
                        "Videovigilancia",
                        "Para la seguridad interna y externa de las personas, bienes e información de Alhambra."
                    ],
                    [
                        "Sistema de control de acceso y salida del parqueadero mediante identificación y autenticación biométrica",
                        "identificar y autenticar a las personas que ingresan y salen del parqueadero de Alhambra, generar y validar mecanismos de correspondencia entre el ingreso y la salida de cada usuario y vehículo, prevenir accesos o salidas no autorizadas y fortalecer la seguridad y protección de las personas, vehículos y bienes dentro de las instalaciones de los Establecimientos de Alhambra"
                    ]
                ]
            },
            {
                "base": "Cumplimiento de obligaciones legales y contractuales",
                "items": [
                    [
                        "Conservación de la información de la relación",
                        "Para mantener en los soportes físicos o digitales de la Compañía, para cumplir con requerimientos de información de autoridades competentes, solicitudes de los Titulares, o defensa de los intereses de la Compañía."
                    ],
                    [
                        "Actualización de información",
                        "Para solicitar la actualización periódicos de los Datos Personales suministrados."
                    ],
                    [
                        "Envío de información",
                        "Dar a conocer, transferir o comunicar Datos Personales dentro y fuera del país a las Compañías matrices, filiales o subsidiarias o aliados comerciales, o a otras sociedades o personas que Alhambra encargue para realizar el Tratamiento de la información y cumplir con las finalidades descritas en la presente Política y el objeto de la relación comercial con los Titulares."
                    ]
                ]
            }
        ]
    },
    {
        "who": "Visitantes",
        "groups": [
            {
                "base": "Cumplimiento de una misión realizada en interés público e interés legítimo",
                "items": [
                    [
                        "Videovigilancia",
                        "Para la seguridad interna y externa de las personas, bienes e información de Alhambra."
                    ],
                    [
                        "Registro de visitantes",
                        "Para la seguridad de las oficinas de Alhambra."
                    ],
                    [
                        "Conservación de la información de la relación",
                        "Para mantener en los soportes físicos o digitales de la Compañía, para cumplir con requerimientos de información de autoridades competentes, solicitudes de los Titulares, o defensa de los intereses de la Compañía."
                    ],
                    [
                        "Sistema de control de acceso y salida del parqueadero mediante identificación y autenticación biométrica",
                        "identificar y autenticar a las personas que ingresan y salen del parqueadero de Alhambra, generar y validar mecanismos de correspondencia entre el ingreso y la salida de cada usuario y vehículo, prevenir accesos o salidas no autorizadas y fortalecer la seguridad y protección de las personas, vehículos y bienes dentro de las instalaciones de los Establecimientos de Alhambra"
                    ]
                ]
            }
        ]
    },
    {
        "who": "Socios",
        "groups": [
            {
                "base": "Cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Gestión societaria",
                        "Para el cumplimiento de las obligaciones societarias consagradas en la normativa aplicable de la materia, lo que incluye, pero no se limita a elaboración de libros sociales, cesión de participaciones, entre otros."
                    ],
                    [
                        "Pago de dividendos",
                        "Para el cumplimiento de los pagos por concepto de dividendos."
                    ]
                ]
            },
            {
                "base": "Consentimiento libre, específico, informado e inequívoco",
                "items": [
                    [
                        "Envío de información comercial, promociones, descuentos, sorteos y eventos",
                        "Para enviar información promocional, ofertas, descuentos, sorteos y eventos de forma personalizada a través de los canales con los que cuente Alhambra, tomando en cuenta los intereses, y necesidades del Titular."
                    ],
                    [
                        "Gestión de sorteos y eventos",
                        "Gestionar su participación en los eventos, y sorteos de Alhambra."
                    ]
                ]
            },
            {
                "base": "Interés legítimo y cumplimiento de obligaciones legales",
                "items": [
                    [
                        "Conservación de la información de la relación",
                        "Para mantener en los soportes físicos o digitales de la Compañía, para cumplir con requerimientos de información de autoridades competentes, solicitudes de los Titulares, o defensa de los intereses de la Compañía."
                    ]
                ]
            },
            {
                "base": "Interés legítimo",
                "items": [
                    [
                        "Actualización de información",
                        "Para solicitar la actualización periódicos de los Datos Personales suministrados."
                    ]
                ]
            }
        ]
    }
]

export const POLICY: PolicySection[] = [
    {
        id: "finalidad",
        title: "¿Cuál es la finalidad de la Política?",
        blocks: [
            { p: "Comercializadora Inmobiliaria Alhambra Cobilhambra S.A. (“Alhambra” o “Compañía”) pone en conocimiento del público su Política General de Protección de Datos Personales (“Política”), en cumplimiento con lo establecido en la Constitución de la República, la Ley Orgánica de Protección de Datos Personales (“LOPDP”), el Reglamento General de la LOPDP (“Reglamento”), y demás normativa de la materia que resulte aplicable con el fin de informar a los Titulares los criterios bajo los cuales Alhambra realiza el Tratamiento de los Datos Personales que son recolectados, almacenados, utilizados, actualizados, transferidos, y suprimidos por la Compañía." },
        ],
    },
    {
        id: "responsable",
        title: "¿Quién es el Responsable del Tratamiento?",
        blocks: [
            { p: "De acuerdo con lo establecido en la LOPDP, su Reglamento, y demás normativa aplicable de la materia, el Responsable del Tratamiento es Alhambra, cuyos datos son los siguientes:" },
            {
                contact: [
                    ["RUC No.", "0992965150001"],
                    ["Domicilio", "Samborondón: Km 2.5 Vía a Sambrondón y Celeste Blacio Rendón"],
                    ["Número de teléfono", "Cuenca: +593 46005220", "tel:+59346005220"],
                    ["Correo electrónico", "Samborondón: protecciondedatos@eljuri.com", "mailto:protecciondedatos@eljuri.com"],
                ],
            },
        ],
    },
    {
        id: "alcance",
        title: "¿Cuál es el alcance de la Política?",
        blocks: [
            { p: "La Política es de obligatorio cumplimiento para los trabajadores, proveedores, consultores, aliados y partes relacionadas que obren en nombre de Alhambra. La Política debe ser observada y respetada en el cumplimiento de las actividades que se realicen con los Datos Personales de responsabilidad de la Compañía, y en todo caso, en razón al conocimiento público que se tiene de esta Política, en virtud de que se encuentra debidamente publicada en el sitio web de la Compañía." },
            { p: "La Política aplica al Tratamiento de Datos Personales de las siguientes categorías de Titulares:" },
            { ol: ["Aplicantes;", "Trabajadores;", "Clientes y Potenciales clientes;", "Proveedores;", "Visitantes;", "Socios."] },
        ],
    },
    {
        id: "definiciones",
        title: "Definiciones",
        blocks: [
            { p: "La Política menciona las siguientes definiciones, las cuales son recopiladas de la LOPDP, su Reglamento, y demás normativa aplicable:" },
            {
                defs: [
                    ["Autoridad de Protección de Datos Personales", "Hace referencia a la Superintendencia de Protección de Datos Personales."],
                    ["Base de Datos", "Conjunto estructurado de datos cualquiera que fuera la forma, modalidad de creación, almacenamiento, organización, tipo de soporte, Tratamiento, procesamiento, localización o acceso, centralizado, descentralizado o repartido de forma funcional o geográfica."],
                    ["Dato/s Personal/es", "Información que identifica o hace identificable a una persona natural, directa o indirectamente."],
                    ["Dato/s sensible/s", "Datos relativos a: etnia, identidad de género, identidad cultural, religión, ideología, filiación política, pasado judicial, condición migratoria, orientación sexual, salud, datos biométricos, datos genéticos y aquellos cuyo Tratamiento indebido pueda dar origen a discriminación, atenten o puedan atentar contra los derechos y libertades fundamentales."],
                    ["Delegado de Protección de Datos Personales", "Persona natural encargada de informar al Responsable o al Encargado del Tratamiento sobre sus obligaciones legales en materia de protección de datos, así como de velar o supervisar el cumplimiento normativo al respecto, y de cooperar con la Autoridad de Protección de Datos Personales, sirviendo como punto de contacto entre esta y la entidad Responsable del Tratamiento de datos."],
                    ["Destinatario", "Persona natural o jurídica que ha sido comunicada con Datos Personales."],
                    ["Encargado del Tratamiento", "Persona natural o jurídica, pública o privada, autoridad pública, u otro organismo que solo o conjuntamente con otros trate Datos Personales a nombre y por cuenta del Responsable de Tratamiento de Datos Personales."],
                    ["Responsable del Tratamiento", "Persona natural o jurídica, pública o privada, autoridad pública, u otro organismo, que solo o conjuntamente con otros decide sobre la finalidad y el Tratamiento de Datos Personales."],
                    ["Titular", "Persona natural cuyos Datos Personales son objeto de Tratamiento."],
                    ["Tratamiento", "Cualquier operación o conjunto de operaciones realizadas sobre Datos Personales, ya sea por procedimientos técnicos de carácter automatizado, parcialmente automatizado o no automatizado, tales como: la recogida, recopilación, obtención, registro, organización, estructuración, conservación, custodia, adaptación, modificación, eliminación, indexación, extracción, consulta, elaboración, utilización, posesión, aprovechamiento, distribución, cesión, comunicación o transferencia, o cualquier otra forma de habilitación de acceso, cotejo, interconexión, limitación, supresión, destrucción y, en general, cualquier uso de Datos Personales."],
                    ["Transferencia o comunicación", "Manifestación, declaración, entrega, consulta, interconexión, cesión, transmisión, difusión, divulgación o cualquier forma de revelación de Datos Personales realizada a una persona distinta al Titular, Responsable o Encargado del Tratamiento de Datos Personales. Los Datos Personales que comuniquen deben ser exactos, completos y actualizados."],
                    ["Dato biométrico bruto", "Es la información biométrica capturada directamente de una persona natural, tales como las imágenes faciales, las huellas dactilares, los patrones de voz, los escaneos de iris o cualquier otro rasgo biométrico."],
                    ["Espacio público", "Es todo lugar físico al que el público tiene acceso general, independientemente de su titularidad o dominio público o privado, tales como los centros comerciales, las estaciones de transporte, los estadios, las plazas o los parques, entre otros."],
                    ["Identificación biométrica", "Es la comparación de una muestra biométrica con múltiples registros almacenados en una o varias bases de datos para determinar la identidad de una persona natural."],
                    ["Identificación unívoca", "Es la capacidad de un sistema biométrico para identificar o verificar la identidad de una persona natural de forma única mediante el tratamiento de sus características físicas, fisiológicas o conductuales."],
                    ["Plantilla biométrica", "Es la representación matemática, codificada y derivada del dato biométrico bruto y utilizada para efectuar comparaciones biométricas. El responsable del tratamiento deberá privilegiar, en todo momento, el uso de plantillas biométricas y evitar, salvo estricta necesidad técnica, el almacenamiento de datos biométricos brutos."],
                    ["Sistemas biométricos", "Es el conjunto de tecnologías, procesos y dispositivos destinados a capturar, procesar, analizar o comparar datos biométricos con el propósito de identificar y/o verificar la identidad de una persona natural. Los sistemas biométricos incluyen, entre otros, aquellos que están basados en el reconocimiento facial, las huellas dactilares, así como reconocimiento de iris, voz, patrones de comportamiento o cualquier otra tecnología que utilizare rasgos biométricos."],
                    ["Verificación biométrica", "Es la comparación de una muestra biométrica con una plantilla previamente asociada a una identidad declarada, con el fin de confirmar dicha identidad."],
                ],
            },
        ],
    },
    {
        id: "principios",
        title: "¿Bajo qué principios se rige la Política?",
        blocks: [
            { p: "El Tratamiento de los Datos Personales a los que se hace mención en esta Política, se lleva a cabo bajo los parámetros establecidos en los principios consagrados en la LOPDP:" },
            {
                defs: [
                    ["Juridicidad", "El Tratamiento de Datos Personales se realiza de acuerdo con los principios, derechos y obligaciones consagrados en la Constitución de la República, LOPDP, Reglamento, demás normativa secundaria, jurisprudencia y observando las disposiciones de los instrumentos internacionales aplicables."],
                    ["Lealtad", "Se recopilan Datos Personales de manera leal y lícita para una o varias de las finalidades específicas e informadas al Titular. Alhambra realiza el Tratamiento de Datos Personales bajo una o varias bases legitimadoras establecidas en el artículo 7 de la LOPDP.\n\nDe igual manera, Alhambra únicamente trata Datos sensibles cuando el Tratamiento se fundamenta en una base legitimadora. De forma ejemplificativa, la Compañía hace el Tratamiento de Datos Personales de salud de sus trabajadores de acuerdo con las disposiciones del Código de Trabajo, Ley de Seguridad Social, y demás normativa aplicable.\n\nSerá responsabilidad del Titular proporcionar a Alhambra Datos Personales exactos y actualizados; sin embargo, de todos modos, la Compañía podrá actualizar o solicitar la actualización de estos.\n\nAlhambra no adquiere Datos Personales o Bases de Datos, que no cuentan con los mecanismos de legitimación correspondiente, así como tampoco transfiere Datos Personales a terceros sin contar con una base legitimadora."],
                    ["Transparencia", "Alhambra actúa de forma transparente con el Titular de los Datos Personales durante el Tratamiento de estos. En este sentido, la Compañía informa al Titular utilizando un lenguaje claro y sencillo sobre los Tratamientos de los datos. La información relativa al Tratamiento es de fácil acceso, debido a que las políticas y documentos referentes a la protección de Datos Personales constarán en las oficinas, sitio web, y lugares administrados y de propiedad de la Compañía.\n\nLos Titulares de Datos Personales pueden ejercer los derechos establecidos en la LOPDP a través de los canales que Alhambra pone a su disposición."],
                    ["Finalidad", "El Tratamiento de los Datos Personales obedecen una finalidad legítima de acuerdo con la LOPDP, la cual se informa al Titular.\n\nEn este sentido, Alhambra recopila, almacena, utiliza, comunica o suprime los Datos Personales para las finalidades previstas en la presente Política, así como en los demás documentos de protección de datos aplicables.\n\nEn términos generales, Alhambra trata Datos Personales para el cumplimiento de su objeto social, y actividad comercial."],
                    ["Pertinencia y Minimización", "Alhambra se limita a tratar los Datos Personales necesarios y pertinentes para el cumplimiento de las finalidades informadas al Titular."],
                    ["Proporcionalidad", "Alhambra no recopila Datos Personales en exceso, o que sean innecesarios para las finalidades establecidas.\n\nAlhambra devolverá al Titular y/o eliminará de sus Bases de Datos, aquellos Datos Personales que sean excesivos."],
                    ["Confidencialidad", "Alhambra guarda estricta confidencialidad y reserva de la información, durante y después de terminadas las actividades de Tratamiento de Datos Personales."],
                    ["Conservación", "Alhambra conserva los Datos Personales por el tiempo necesario para el cumplimiento de las finalidades para los cuales fueron recopilados, o de acuerdo con lo establecido en las diferentes normas especiales de la materia que establecen plazos de almacenamiento de documentos, y hasta por el tiempo de prescripción de acciones legales.\n\nCumplida la finalidad del Tratamiento, o el plazo de conservación, Alhambra devolverá y/o eliminará de sus sistemas los Datos Personales.\n\nSin embargo, Alhambra podrá conservar aquellos Datos Personales anonimizados, toda vez que estos pierden su carácter de personal. Por lo anterior, el dato anonimizado podrá ser libremente utilizado por Alhambra."],
                    ["Seguridad", "Alhambra cuenta con medidas de seguridad técnicas y organizativas adecuadas para garantizar la confidencialidad, integridad y disponibilidad de los Datos Personales, habida cuenta el volumen y categorías de los Datos Personales, así como el estado de la técnica y sus costos de aplicación.\n\nAquellos con quienes Alhambra comparte Datos Personales deben acreditar la implementación de medidas de seguridad que garanticen la protección de los Datos Personales."],
                    ["Responsabilidad Proactiva y Demostrada", "Alhambra cuenta con los medios de verificación necesarios para demostrar el cumplimiento de la LOPDP, su Reglamento y demás normativa aplicable de la materia."],
                ],
            },
        ],
    },
    {
        id: "derechos",
        title: "¿Cuáles son los derechos de los Titulares?",
        blocks: [
            { p: "Alhambra reconoce y garantiza a los Titulares de los Datos Personales los siguientes derechos consagrados en la LOPDP:" },
            {
                defs: [
                    ["Acceso", "El Titular podrá consultar si Alhambra realiza el Tratamiento de sus Datos Personales o no, así como solicitar información sobre el Tratamiento de acuerdo con el artículo 12 de la LOPDP, y acceder a los Datos Personales tratados por Alhambra obteniendo una copia de estos."],
                    ["Rectificación y actualización", "El Titular podrá solicitar que sus Datos Personales incorrectos o inexactos, sean rectificados o actualizados por Alhambra, presentando los justificativos que correspondan."],
                    ["Oposición", "El Titular podrá solicitar a Alhambra oponerse al Tratamiento de sus Datos Personales en los casos que no afecten derechos fundamentales, no estén relacionados con información pública o de interés público, el Tratamiento tenga por objeto marketing directo, o cuando no sea necesario su consentimiento para el Tratamiento como consecuencia de un interés legítimo."],
                    ["Eliminación", "El Titular podrá solicitar a Alhambra la supresión de sus Datos Personales, cuando: (i) el Tratamiento no cumpla con los principios establecidos en la LOPDP, (ii) el Tratamiento no sea necesario o pertinente para el cumplimiento de una finalidad; (iii) se haya cumplido con la finalidad para la cual los Datos Personales fueron recopilados o tratados; (iv) haya vencido el plazo de conservación de los Datos Personales; (v) el Tratamiento afecte derechos fundamentales; (vi) se haya revocado el consentimiento, o señale no haberlo otorgado, o (vii) exista una obligación legal de eliminar los Datos Personales."],
                    ["Suspensión", "El Titular podrá solicitar la suspensión del Tratamiento de sus Datos Personales en las siguientes situaciones: (i) impugnación de la exactitud de los Datos Personales, (ii) Tratamiento ilícito y usted se oponga a la supresión de los Datos Personales, y en su lugar solicite la suspensión de su uso, (iii) Datos Personales dejan de ser necesario por parte de Alhambra, pero sí los son para usted para reclamaciones; y, (iv) oposición al Tratamiento en virtud del artículo 31 de la LOPDP mientras se verifica si nuestros motivos legítimos prevalecen."],
                    ["Portabilidad", "El Titular podrá solicitar a Alhambra recibir sus Datos Personales en un formato compatible, actualizado, estructurado, común, inter-operable y de lectura mecánica, preservando sus características, o que transfiera sus Datos Personales a otro Responsable cuando sea técnicamente posible."],
                    ["No ser objeto de una decisión basada única o parcialmente en valoraciones automatizadas", "El Titular podrá solicitar a Alhambra: (i) explicaciones motivadas sobre la decisión tomada, (ii) presentar observaciones a la decisión, (iii) solicitar criterios de valoración sobre el programa automatizado, (iv) solicitar información sobre los tipos de Datos Personales utilizados y la fuente de la que se han obtenido, e (v) impugnar la decisión."],
                ],
            },
        ],
    },
    {
        id: "ejercer-derechos",
        title: "¿Cómo puedes ejercer los derechos?",
        blocks: [
            { p: "Los Titulares cuyos Datos Personales se encuentren en Bases de Datos de Alhambra, o de terceros autorizados, podrán ejercer los derechos de acceso, rectificación y actualización, eliminación, suspensión, oposición, portabilidad y a no ser objeto de decisiones basadas única o parcialmente en valoraciones automatizadas. Para el ejercicio de los derechos, los Titulares de los Datos Personales podrán utilizar los siguientes mecanismos acreditando su identidad:" },
            {
                ol: [
                    "Envío de petición escrita en medio físico a las siguientes direcciones: Samborondón: Km 2.5 Vía a Samborondón y Av. Celeste Blacio, Centro Comercial Alhambra. En general, cualquiera de los locales comerciales y Centros Comerciales de de Alhambra a nivel nacional.",
                    "Envío de una petición escrita en medio digital a través del siguiente correo: protecciondedatos@eljuri.com, para lo cual tenemos a disposición formularios físicos en todas las tiendas a nivel nacional y de manera digital en nuestra página web",
                ],
            },
            { p: "En cumplimiento con la LOPDP, Alhambra atenderá la solicitud de ejercicio de derechos dentro del plazo de quince (15) días siguientes a su recepción, salvo la solicitud deba ser aclarada o ampliada." },
            { p: "En tal caso, dentro del término de cinco (5) días siguientes a la recepción de la solicitud, Alhambra requerirá al Titular que la aclare o amplíe, y el Titular contará con el término de diez (10) días contados desde el día siguiente en el que se le haya notificado para aclarar o ampliar la solicitud." },
            { p: "En el evento de que el Titular no aclare o amplíe la solicitud dentro del tiempo previamente señalado, Alhambra procederá con el archivo de la solicitud, y se le notificará sobre este particular, sin que ello impida que pueda presentar una nueva solicitud." },
            { p: "El Titular podrá presentar un reclamo directamente ante la Autoridad de Protección de Datos Personales cuando encuentre motivos para creer que se han vulnerado sus derechos con la respuesta que se ha dado a su solicitud, o cuando no haya recibido respuesta en el plazo establecido en la LOPDP." },
            { p: "El ejercicio de los derechos podría verse limitado a las excepciones consagradas en la normativa aplicable de la materia." },
        ],
    },
    {
        id: "consentimiento",
        title: "Consentimiento",
        blocks: [
            { p: "Cuando aplique, Alhambra solicitará su consentimiento para realizar el Tratamiento de sus Datos Personales." },
            { p: "Podrá revocar el consentimiento otorgado en cualquier momento y de forma gratuita a través de los mecanismos puestos a su disposición o dirigiendo una solicitud a los correos electrónicos previamente señalados. En este caso, se suspenderá el Tratamiento de los Datos Personales." },
            { p: "Sin embargo, la revocatoria del consentimiento no afectará a la licitud del Tratamiento de los Datos Personales llevado a cabo hasta el momento de la revocatoria." },
        ],
    },
    {
        id: "seguridad",
        title: "¿Qué medidas de seguridad utiliza Comercializadora Inmobiliaria Alhambra Cobilhambra S.A.?",
        blocks: [
            { p: "Alhambra cuenta con medidas técnicas y organizativas necesarias para garantizar la protección de los Datos Personales, y así garantizar su confidencialidad, integridad y disponibilidad. Por lo anterior, las medidas de seguridad adoptadas pretenden evitar la pérdida, alteración, acceso no autorizado o Tratamiento ilegal de los Datos Personales, habida cuenta las categorías y volumen de los Datos Personales y los riesgos a los que estos están expuestos, el estado de la técnica y los costos de aplicación." },
            { p: "Es responsabilidad de los empleados, proveedores, contratistas de Alhambra, notificar cualquier incidente de seguridad, lo que incluye, cualquier fuga de información, daño informático, comercialización de Datos Personales, uso no autorizado de Datos Personales, suplantación de identidad, accesos no autorizados, o conductas que puedan vulnerar la intimidad de una persona." },
            { p: "La formación y capacitación de los empleados será un complemento fundamental de esta Política. En caso de terceros externos a Alhambra, la Compañía pone a disposición esta Política en su sitio web para conocimiento público." },
        ],
    },
    {
        id: "datos",
        title: "¿Qué Datos Personales son objeto de Tratamiento?",
        blocks: [
            { p: "De forma ejemplificativa, pero no limitada, Alhambra realiza el Tratamiento de las siguientes categorías y tipologías de Datos Personales:" },
            {
                defs: [
                    ["Datos de identificación", "Nombres, apellidos, número del documento de identificación, licencia de conducir, código de cliente, firma, Registro Unico de Contribuyente (RUC)."],
                    ["Datos de contacto", "Número de teléfono fijo y celular, dirección de domicilio y trabajo, correo electrónico, geolocalización."],
                    ["Datos relacionados a características personales", "Estado civil, fecha de nacimiento, lugar de nacimiento, sexo, género, edad, hobbies, intereses, nacionalidad, tipo de sangre, imagen, referencias personales."],
                    ["Datos de circunstancias familiares y sociales", "Datos de familiares, nombres y apellidos del cónyuge, número de cargas familiares, datos del garante, ingresos económicos de conyuge, ingresos económicos de familiares."],
                    ["Datos académicos", "Formación académica (título), idiomas."],
                    ["Datos profesionales", "Experiencia profesional, cargo de trabajo, remuneración, referencias laborales, evaluación de desempeño, código interno de trabajador, fecha de ingreso al lugar de trabajo, fecha de salida al lugar de trabajo."],
                    ["Datos económicos, financieros, y de seguros", "Datos bancarios (banco, número de cuenta bancaria, tipo de cuenta bancaria), datos de tarjeta de crédito o débito, vivienda, vehículos, inmuebles, referencias comerciales, ingresos económicos."],
                    ["Datos de control de presencial", "Fecha y hora de entrada y salida, motivo de ausencia."],
                    ["Datos de navegación", "Dirección IP."],
                    ["Categorías especiales de Datos Personales", "Condición migratoria, pasado judicial, datos crediticios, datos de salud, datos de discapacidad, datos biométricos."],
                ],
            },
        ],
    },
    {
        id: "tratamientos",
        title: "¿Qué Tratamientos de Datos Personales realiza Comercializadora Inmobiliaria Alhambra Cobilhambra S.A.?",
        blocks: [
            { p: "Alhambra realiza el Tratamiento de los Datos Personales, en virtud de las bases de legitimación establecidas en el artículo 7 de la LOPDP, siendo estas: consentimiento; cumplimiento de obligaciones legales; ejecución de medidas precontractuales o cumplimiento de obligaciones contractuales; cumplimiento de órdenes judiciales; Tratamiento de Datos Personales que consten en bases de datos de acceso público; protección de intereses vitales del interesado o de terceros; cumplimiento de una misión realizada en interés público, e interés legítimo." },
            { p: "Cuando el Tratamiento de Datos Personales se realice en virtud del consentimiento, Alhambra informará al Titular del Dato Personal sobre la existencia de las condiciones particulares del Tratamiento de sus Datos Personales en cada caso." },
            { p: "Alhambra trata los Datos Personales previamente señalados de sus aplicantes, trabajadores, clientes, proveedores, visitantes y socios para el cumplimiento de su objeto social, y específicamente las siguientes finalidades:" },
            { tables: TABLES },
        ],
    },
    {
        id: "recopilacion",
        title: "¿Cómo recopilamos los Datos Personales?",
        blocks: [
            { p: "Alhambra recopila los Datos Personales de los Titulares, ya sea por cuenta propia o como a través de un tercero debidamente autorizado." },
            { p: "Los Datos Personales podrán ser suministrados directamente por los Titulares, o recolectados a través de cualquier medio, por ejemplo: sitio web, formatos o formularios de recopilación de información, solicitudes de crédito, concursos, encuestas, eventos, mensajería, entre otros." },
            { p: "En concordancia con lo anterior, Alhambra recopila los Datos Personales de los Titulares a través de los siguientes mecanismos:" },
            {
                ol: [
                    "Almacenamiento en físico o digital de hoja de vida, contratos y demás documentos de carácter laboral de aspirantes y trabajadores, según corresponda.",
                    "Almacenamiento de información de clientes, proveedores, o personas vinculadas por motivos comerciales a Alhambra.",
                    "A través de los sitios web: https://www.alhambrashopping.com/",
                    "En el momento de la comercialización de productos o servicios con clientes de Alhambra.",
                    "Evaluadores de riesgo.",
                    "Registros públicos.",
                    "Mediante las cámaras de videovigilancia en las instalaciones de la Compañía.",
                    "A través de los registros de entradas y salidas a las instalaciones.",
                ],
            },
        ],
    },
    {
        id: "destinatarios",
        title: "¿Con quienes compartimos los Datos Personales?",
        blocks: [
            { p: "Alhambra transfiere o comunica los Datos Personales de los Titulares únicamente con aquellos terceros para el cumplimiento de las finalidades previamente señaladas. Así mismo, se podrá comunicar los Datos Personales a empresas del grupo o empresas relacionadas, sucursales, filiales, quienes podrán utilizar los Datos Personales para las finalidades descritas." },
            { p: "Alhambra cuenta con estrictos criterios para la selección de sus proveedores, con la finalidad de salvaguardar los Datos Personales." },
            { p: "Alhambra comparte los Datos Personales con los siguientes proveedores de servicios quienes colaboran para el cumplimiento de las finalidades señaladas:" },
            {
                ol: [
                    "Brokers de seguros;", "Aseguradoras;", "Compañía de seguridad privada;", "Compañías prestadoras de servicios de pago;",
                    "Compañías prestadoras de servicios tecnológicos;", "Compañías de servicios de software;", "Compañías de gestión de cobro y cartera;",
                    "Auditores externos;", "Compañías prestadoras de servicios de transporte o logística;", "Evaluadores de riesgo;", "Compañías de mensajería;",
                    "Compañías de facturación electrónica;", "Compañías prestadoras de servicios legales;", "Entidades bancarias y financieras;",
                    "Compañías de telecomunicaciones;", "Compañías de redes sociales.",
                ],
            },
            { p: "También, Alhambra puede compartir los Datos Personales de los Titulares con destinatarios en cumplimiento de obligaciones legales, contractuales, u órdenes judiciales para el cumplimiento de las finalidades señaladas:" },
            {
                ol: [
                    "IESS;", "Ministerio de Trabajo;", "Ministerio de Salud;", "Servicio de Rentas Internas;", "Superintendencia de Compañías, Valores y Seguros;",
                    "Jueces y Tribunales;", "Fiscalías;", "Policía Nacional;", "Agencias de Tránsito;", "Superintendencia de Protección de Datos Personales;",
                    "Notarías a nivel nacional.", "Unidad de Análisis Financiero y Económico (UAFE)", "Gads Municipales.",
                ],
            },
            { p: "El Tratamiento de Datos Personales podría involucrar Transferencias internacionales de Datos Personales, por ejemplo, para los servicios de almacenamiento de información. Por este motivo, cuando las comunicaciones supongan Transferencias internacionales de Datos Personales, Alhambra exigirá el cumplimiento de estándares de protección, confidencialidad y seguridad, sobre todo, cuando la transferencia se realice a jurisdicciones que no cuenten con niveles adecuados de protección conforme a los parámetros establecidos en la normativa aplicable y las resoluciones que emita la Autoridad de Protección de Datos Personales." },
        ],
    },
    {
        id: "conservacion",
        title: "¿Por cuánto tiempo se almacenan los Datos Personales?",
        blocks: [
            { p: "Alhambra almacena los Datos Personales por el tiempo necesario, de acuerdo con las finalidades que justifican el Tratamiento, atendiendo a las disposiciones aplicables a la materia de que se trate y a los aspectos administrativos, contables, tributarios, jurídicos e históricos de la información." },
            { p: "Los Datos Personales se almacenan en una Base de Datos o en un sistema informático creado para tal fin, ya sea en forma física o digital, de tal manera que se garantizará su seguridad." },
            { p: "Una vez cumplida la o las finalidades del Tratamiento, y sin perjuicio de las normas legales que dispongan lo contrario, procederá a la supresión de los Datos Personales, salvo estos se anonimicen, pues en tal caso los datos perderán su carácter de personal, y podrán ser utilizados a discreción por Alhambra." },
            { p: "Sin perjuicio de lo anterior, los Datos Personales deberán ser conservados cuando así se requiera para el cumplimiento de una obligación legal, contractual o de auditoría, y hasta por el plazo de prescripción de las acciones legales." },
        ],
    },
    {
        id: "negativa",
        title: "Negativa de entrega de los Datos Personales",
        blocks: [
            { p: "En caso de que opte por negarse a entregar sus Datos Personales, u oponerse al tratamiento de estos, no podremos ayudarle con sus requerimientos. La consecuencia de la negativa será la pérdida de oportunidades." },
        ],
    },
    {
        id: "datos-erroneos",
        title: "Datos erróneos o inexactos",
        blocks: [
            { p: "Será su responsabilidad única y exclusiva proporcionar Datos Personales verídicos y exactos. En tal virtud, la consecuencia de proporcionar datos falsos o erróneos será no procesar las solicitudes que realice, por lo que no se le podrá ayudar con sus requerimientos. De igual manera, nos reservamos el derecho de eliminar y bloquear su perfil, en caso de tenerlo, por el uso de datos erróneos o inexactos." },
        ],
    },
    {
        id: "videovigilancia",
        title: "Videovigilancia",
        blocks: [
            { p: "Alhambra realiza el Tratamiento de datos de imagen obtenidos a través de cámaras de videovigilancia de su propiedad con el fin de salvaguardar la seguridad de las instalaciones, bienes, y personas que tienen acceso a los establecimientos de propiedad de la Compañía. La base legal que sustenta este Tratamiento es el cumplimiento de una misión realizada en interés público, así como el interés legítimo." },
            { p: "Las imágenes se almacenan en un sistema que cuenta con condiciones de seguridad físicas y lógicas de estricto cumplimiento y al cual sólo tiene acceso personal previamente autorizado." },
            { p: "Las grabaciones tienen una duración de entre ocho (8) y treinta (30) días. Posterior el plazo señalado, se eliminan las grabaciones." },
            { p: "Las grabaciones únicamente se descargan por motivos de novedades de seguridad." },
        ],
    },
    {
        id: "delegado",
        title: "Delegado de Protección de Datos Personales",
        blocks: [
            { p: "Alhambra cuenta con un Delegado de Protección de Datos Personales (“DPO”), quien vela por el cumplimiento de la normativa aplicable de Datos Personales, comunica con la Autoridad de Protección de Datos, entre el cumplimiento de otras actividades establecidas en la normativa aplicable de la materia." },
        ],
    },
    {
        id: "vigencia",
        title: "Aprobación y Entrada en Vigencia",
        blocks: [
            { p: "La Política es revisada con periodicidad de acuerdo con los objetivos de Alhambra, así como los cambios normativos, y resoluciones de la Autoridad competente." },
            { p: "Control de cambios" },
            { ul: ["La Política fue realizada el 07 de enero de 2025.", "Actualizada el 09 de septiembre del 2026"] },
        ],
    },
]
