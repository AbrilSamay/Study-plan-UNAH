// Catalog source: conserva los nombres del bundle publicado por el usuario.
export const curriculum = [
        // Data group: PROGRAMACIÓN Y SOFTWARE; agrupa las asignaturas de esta área.
        { code: "ISC-101", name: "Int a Ingenieria en Sistemas ", ca: 4, req: [], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-102", name: "Programación Estructurada", ca: 4, req: ["ISC-101"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-103", name: "Programación Orientada a Objetos", ca: 5, req: ["ISC-102"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-204", name: "Paradigmas de Programación", ca: 4, req: ["ISC-103"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-211", name: "Estructuras de Datos", ca: 4, req: ["MM-420", "MM-211"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-312", name: "Teoría de la Computación", ca: 4, req: ["ISC-211", "ISC-204"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-313", name: "Compiladores", ca: 4, req: ["ISC-312"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-305", name: "Programación Web", ca: 4, req: ["ISC-321"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-407", name: "Programación Móvil", ca: 5, req: ["ISC-305"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-414", name: "Inteligencia Artificial", ca: 4, req: ["ISC-313", "MM-401"], category: "Desarrollo de Software y Algoritmos" },
        { code: "ISC-415", name: "Tecnologías Emergentes", ca: 4, req: ["ISC-305", "ISC-437", "ISC-332"], category: "Desarrollo de Software y Algoritmos" },

        // Data group: INGENIERÍA DE SOFTWARE Y PROYECTOS; agrupa las asignaturas de esta área.
        { code: "ISC-341", name: "Sistemas de Información", ca: 4, req: ["ISC-351"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-306", name: "Análisis de Requerimientos", ca: 4, req: ["ISC-341"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-408", name: "Ingeniería del Software", ca: 4, req: ["ISC-306"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-409", name: "Calidad de Software", ca: 4, req: ["ISC-408"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-443", name: "Industria de TI", ca: 4, req: ["ISC-306"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-445", name: "Proyectos de TI", ca: 4, req: ["ISC-443", "ISC-442"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-546", name: "Ejecución de Proyectos de TI", ca: 4, req: ["ISC-445"], category: "Ingeniería de Software y Gestión de TI" },
        { code: "ISC-544", name: "Auditoría Informática", ca: 4, req: ["ISC-442", "ISC-306"], category: "Ingeniería de Software y Gestión de TI" },

        // Data group: DATOS E INFORMACIÓN; agrupa las asignaturas de esta área.
        { code: "ISC-321", name: "Fundamentos de Base de Datos", ca: 5, req: ["MM-420"], category: "Bases de Datos y Ciencia de Datos" },
        { code: "ISC-422", name: "Administración de Base de Datos", ca: 4, req: ["ISC-321"], category: "Bases de Datos y Ciencia de Datos" },
        { code: "ISC-423", name: "Ciencia de Datos", ca: 4, req: ["ISC-422"], category: "Bases de Datos y Ciencia de Datos" },

        // Data group: REDES, HARDWARE Y SEGURIDAD; agrupa las asignaturas de esta área.
        { code: "IE-326", name: "Instalaciones Eléctricas para Centros de Datos", ca: 4, req: ["FS-200"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-331", name: "Redes de Datos I", ca: 4, req: ["IE-326"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-332", name: "Redes de Datos II", ca: 4, req: ["ISC-331"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-333", name: "Sistemas Operativos I", ca: 4, req: ["ISC-211"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-334", name: "Sistemas Operativos II", ca: 4, req: ["ISC-333"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-336", name: "Diseño Digital", ca: 4, req: ["ISC-321", "ISC-334"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-437", name: "Arquitectura de Computadoras", ca: 4, req: ["ISC-336"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-435", name: "Administración de Servidores", ca: 4, req: ["ISC-334", "ISC-332"], category: "Redes, Sistemas e Infraestructura" },
        { code: "ISC-442", name: "Seguridad Informática", ca: 4, req: ["ISC-435"], category: "Redes, Sistemas e Infraestructura" },

        // Data group: CIENCIAS BÁSICAS Y MATEMÁTICAS; agrupa las asignaturas de esta área.
        { code: "MM-110", name: "Matemática I", ca: 5, req: [], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-111", name: "Geometría y Trigonometría", ca: 5, req: [], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-201", name: "Cálculo I", ca: 5, req: ["MM-110", "MM-111"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-211", name: "Vectores y Matrices", ca: 3, req: ["MM-110", "MM-111"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-420", name: "Matemática Discreta", ca: 4, req: ["MM-110"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-202", name: "Cálculo II", ca: 5, req: ["MM-201", "MM-211"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "MM-401", name: "Estadística I", ca: 3, req: ["MM-202"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "FS-100", name: "Física I", ca: 5, req: ["MM-201", "MM-211"], category: "Matemáticas y Ciencias Fisicomatemáticas" },
        { code: "FS-200", name: "Física II", ca: 5, req: ["FS-100", "MM-202"], category: "Matemáticas y Ciencias Fisicomatemáticas" },

        // Data group: GESTIÓN Y COMPLEMENTARIAS; agrupa las asignaturas de esta área.
        { code: "AGE-102", name: "Administración", ca: 4, req: ["ISC-103", "MM-401"], category: "Administración, Investigación y Cierre" },
        { code: "ISC-351", name: "Contabilidad Financiera", ca: 4, req: ["AGE-102"], category: "Administración, Investigación y Cierre" },
        { code: "ISC-552", name: "Seminario de Investigación", ca: 4, req: ["ISC-415", "ISC-445", "ISC-423"], category: "Administración, Investigación y Cierre" },
        { code: "PPS-100", name: "Práctica Profesional Supervisada", ca: 0, req: ["ALL_PREV"], category: "Administración, Investigación y Cierre" },

        // Data group: GENERALES Y OPTATIVAS; agrupa las asignaturas de esta área.
        { code: "EG-011", name: "Español General", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "SC-101", name: "Sociología", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "FF-101", name: "Filosofía", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "HH-101", name: "Historia de Honduras", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "IN-101", name: "Optativa I: Lenguas Extranjeras (Inglés I)", ca: 4, req: [], category: "Formación General y Optativas" },
        { code: "IN-102", name: "Inglés II", ca: 4, req: ["IN-101"], category: "Formación General y Optativas" },
        { code: "IN-103", name: "Inglés III", ca: 4, req: ["IN-102"], category: "Formación General y Optativas" },
        { code: "HUM-OPT", name: "Optativa II: Campo de las Humanidades", ca: 3, req: [], category: "Formación General y Optativas" },
        { code: "ART-OPT", name: "Optativa III: Campo de las Artes y del Deporte", ca: 3, req: [], category: "Formación General y Optativas" },
        { code: "NAT-OPT", name: "Optativa IV: Campo de las Ciencias Naturales", ca: 3, req: [], category: "Formación General y Optativas" }
    ];
