var trans = angular.module( 'App.translations', [ 'pascalprecht.translate' ] );
trans.config( [ '$translateProvider', function( $translateProvider, $translate ) {
    //$translateProvider.preferredLanguage(window.localStorage.getItem("lang"));
    $translateProvider.useLoader( 'asyncLoader' );
    $translateProvider.useSanitizeValueStrategy( 'escaped' );
    $translateProvider.preferredLanguage( window.localStorage.getItem( "lang" ) );
    //console.log("Lenguaje: "+window.localStorage.getItem("lang"))
    $translateProvider.fallbackLanguage( window.localStorage.getItem( "lang" ) );;
} ] );
trans.factory( 'asyncLoader', function( $q, $timeout ) {
    return function( options ) {
        var deferred = $q.defer(),
            translations;
        if ( options.key === 'es' ) {
            translations = {
                LENGUAJE_ID: 1,
                CONQUISTAS: "Logros",
                LENGUAJE: "Español",
                HOME: "Home",
                TEMPORADAS: "Temporadas",
                COPAS: "Copas",
                SENHA: "Contraseña",
                INISESSAO: "Iniciar sesión",
                RECSENHA: "Restablecer Contraseña",
                REGISTRO: "Registrárse",
                ANTESREGISTRO: "Antes de registrárse, verifique su Gamertag...",
                GAMERTAGOK: "Gamertag OK. ¡Registrate!",
                VOLTAR: "Volver",
                PONTOS: "Puntos",
                JOGOS: "Juegos",
                JOGO: "Juego",
                REGRAS: "Reglas",
                CONFIGURACAO: "Configuración",
                DESENVOLVIDOPOR: "Desarrollado por",
                SELECIONARIDIOMA: "Seleccionar el Idioma",
                IDIOMA: "Idioma",
                OFICIAL: "Oficial",
                ENTRAR: "Entrar",
                INICIO: "Comienza",
                FIM: "Termina",
                MAXPARTICIPANTES: "Max.Participantes",
                TEMPINICIAL: "Temp.Inicio",
                VITORIA: "Victoria",
                EMPATE: "Empate",
                DERROTA: "Derrota",
                NOINSCRITOTORNEIO: "No estás inscripto en este desafío.",
                ADICIONEASFOTOS: "Agregue aqui la(s) foto(s):",
                SELECIONECONQUISTAS: "Seleccione una o más conquistas:",
                CONQUISTASSELECIONADAS: "Conquistas seleccionadas:",
                ELIMINECONQUISTAS: "Elimine un elemento moviendo la conquista de la derecha hacia la izquierda y click en el botón Delete.",
                TOTALDEPONTOS: "Total de Puntos de las Conquistas seleccionadas:",
                JOGOENVIADO: "Este juego fue enviado.",
                DETALHECONQUISTAS: "Detalle de las conquistas:",
                DETALHEJOGO: "Detalle del Juego",
                SAIR: "Salir",
                DESAFIO: "Desafío",
                DETALHEDESAFIO: "Detalles del desafío",
                MEUSJOGOS: "Mis Juegos",
                TEMPORADAS: "Temporadas",
                DESCRICAO: "Descripción",
                RECUPERARRESULTADO: 'Recuperar resultado',
                SELECCIONETIME: "Seleccione su equipo",
                MANDANTE: "Local",
                VISITANTE: "Visitante",
                RESULTADOONLINE: "Resultado Online",
                RESULTADOMANUAL: "Resultado Manual",
                ADICIONARCONQUISTAS: "Agregar Conquistas",
                DETALHECONQUISTAS: "Detalle de las Conquistas",
                X: "VS",
                ENVIAR: "Enviar",
                TEMPORADAATUAL: "Temporada actual",
                REINICIAR: "Reiniciar",
                ESTAOFF: 'está offline!',
                OJOGORECUPERADO: "Importante: El resultado solo podrá ser recuperado cuando el usuario permanezca Online y en la pantalla de la partida.",
                RECUPERARCOMMENU: "No puedes recuperar el resultado del juego mientras estés en el Menú.",
                NAOFIFA: " está en otro juego!",
                INFOTORNEIO: "Información del Desafio",
                TOTALJOGOS: "Total de Juegos",
                TEMPORADAINICIO: "Temporada de Inicio",
                DATAINICIO: "Fecha de Inicio",
                DATAFIM: "Fecha del Final",
                MINPARTICIPANTES: "No. Mínimo de Participantes",
                INSCPARTICIPANTES: "Participantes Inscriptos",
                GENIAL: "¡Enhorabuena!",
                VOCEESTAPARTICIPANDO: "Ya estás participando de este desafio.",
                SAIRTORNEIO: "¿Seguro que quieres salir de este desafío?",
                ENTRARLOGADO: "Para entrar en este desafío debes iniciar sesión.",
                NAOHAINSCRITOS: "Aún no hay inscriptos en este desafío. ¿Qué tal ser el primero?",
                DESAFIOFINALIZADO: "¡Desafío Finalizado!",
                CAMPEAO: "Vencedor",
                DESAFIOTERMINADO: "¡Este desafio há terminado!",
                SELECCIONEIMAGEN: "Seleccione la imagen para comprobar el resultado:",
                ADICIONARPARTICPANTES: "Agregue los participantes:",
                NOMEGAMERTAG: "Nombre",
                SAIRTORNEIOTODOS: "¿Seguro que quieres eliminar este torneo?",
                CRIARNOVO: "Nuevo Torneo",
                RODADA: "Ronda",
                PARACRIARTORNEIO: "Para crear un nuevo torneo debes estar logado.",
                MEUSTORNEIOS: "Mis Torneos",
                NOVO: "Nuevo",
                CAMPOSPREENCHIDOS: "Todos los campos deben ser llenados.",
                NUMEROMININO: "¡Debes agregar al menos 4 participantes!",
                NOMESREPETIDOS: "Cambie o borre los nombres duplicados!",
                ADICIONENOVOTORNEIO: "Agregue un nuevo torneo e invite sus amigos a jugar!",
                OUTROSTORNEIOS: "Otros Torneos",
                CHAVEDEACESSO: "Clave de acceso",
                BUSCARTORNEIO: "Buscar torneo:",
                VERIFICARDATOS: "No se encontró este torneo, por favor revise el GAMERTAG y/o la CLAVE DE ACCESO y vuelva a intentar.",
                TORNEIOENCONTRADO: "Torneo encontrado!",
                TORNEIOSADICIONADOS: "Podrás ver los torneos agregados en la pestaña 'Otros Torneos'",
                AQUILISTATORNEIOOUTROS: "Aqui se listarán los torneos de tus amigos que hayas agregados.",
                TORNEIOS: "Torneos",
                TORNEIO: "Torneo",
                TORNEIOJAFOIADICIONADO: "Este torneo ya se está agregado a su lista de OTROS TORNEOS",
                CHAVE: "Clave",
                ESTAECHAVEACESSO: "Esta es la clave de acceso para este torneo, comparta con sus amigos y ¡A jugar!.",
                ADICIONEPARTICCOMPARTA: "Acceda, agregue participantes y comparta la llave de acceso de este torneo",
                ADICIONARADMIN: "Agregar Administrador",
                ATUALIZAR: "Actualizar",
                GERARCONFRONTOS: "Generar rondas"
            };
        }
        if ( options.key === 'pt' ) {
            translations = {
                LENGUAJE_ID: 2,
                CONQUISTAS: "Conquistas",
                LENGUAJE: "Portugues",
                HOME: "Home",
                TEMPORADAS: "Temporadas",
                COPAS: "Copas",
                SENHA: "Senha",
                INISESSAO: "Iniciar sessão",
                RECSENHA: "Recuperar Senha",
                REGISTRO: "Registro",
                ANTESREGISTRO: "Antes de se registrar, verifique seu Gamertag...",
                GAMERTAGOK: "Gamertag OK. Pode se registrar!",
                VOLTAR: "Volver",
                PONTOS: "Pontos",
                JOGOS: "Jogos",
                JOGO: "Jogo",
                REGRAS: "Regras",
                CONFIGURACAO: "Configuração",
                DESENVOLVIDOPOR: "Desenvolvido por",
                SELECIONARIDIOMA: "Selecione o Idioma",
                IDIOMA: "Idioma",
                OFICIAL: "Oficial",
                ENTRAR: "Entrar",
                INICIO: "Inicio",
                FIM: "Final",
                MAXPARTICIPANTES: "Max.Participantes",
                TEMPINICIAL: "Temp.Inicio",
                VITORIA: "Vitória",
                EMPATE: "Empate",
                DERROTA: "Derrota",
                NOINSCRITOTORNEIO: "Você não está inscrito neste desafio.",
                ADICIONEASFOTOS: "Adicione aqui a(s) foto(s):",
                SELECIONECONQUISTAS: "Selecione uma o mais conquistas:",
                CONQUISTASSELECIONADAS: "Conquistas selecionadas:",
                ELIMINECONQUISTAS: "Elimine um elemento movendo a conquista da direita para a esquerda e presionando o botão Delete.",
                TOTALDEPONTOS: "Total de Pontos das Conquistas selecionadas:",
                JOGOENVIADO: "Este jogo já foi enviado.",
                DETALHECONQUISTAS: "Detalhe das conquistas:",
                DETALHEJOGO: "Detalhe do Jogo",
                SAIR: "Sair",
                DESAFIO: "Desafio",
                DETALHEDESAFIO: "Detalhes do desafio",
                MEUSJOGOS: "Meus Jogos",
                TEMPORADAS: "Temporadas",
                DESCRICAO: "Descrição",
                RECUPERARRESULTADO: 'Recuperar resultado',
                SELECCIONETIME: "Selecione seu time",
                MANDANTE: "Mandante",
                VISITANTE: "Visitante",
                RESULTADOONLINE: "Resultado Online",
                RESULTADOMANUAL: "Resultado Manual",
                ADICIONARCONQUISTAS: "Adicionar Conquistas",
                DETALHECONQUISTAS: "Detalhe das Conquistas",
                X: "X",
                ENVIAR: "Enviar",
                TEMPORADAATUAL: "Temporada atual",
                REINICIAR: "Reiniciar",
                ESTAOFF: 'está offline!',
                OJOGORECUPERADO: "Importante: O resultado só pode ser recuperado quando o usuario estiver Online e na tela da partida",
                RECUPERARCOMMENU: "Não poderá recuperar o resultado da partida enquanto estiver no Menú.",
                NAOFIFA: " está em outro jogo!",
                INFOTORNEIO: "Informação do Desafio",
                TOTALJOGOS: "Total de Jogos",
                TEMPORADAINICIO: "Temporada de Início",
                DATAINICIO: "Data Inicio",
                DATAFIM: "Data Final",
                MINPARTICIPANTES: "No. Mínimo de Participantes",
                INSCPARTICIPANTES: "Participantes Inscritos",
                GENIAL: "Show de bola!",
                VOCEESTAPARTICIPANDO: "Você já está participando neste desafio.",
                SAIRTORNEIO: "Você tem certeza que quer sair deste desafio?",
                ENTRARLOGADO: "Para entrar neste desafio deve está logado.",
                NAOHAINSCRITOS: "Ainda não há inscritos neste desafio. Você pode ser o primeiro!",
                DESAFIOFINALIZADO: "Desafio Finalizado!",
                CAMPEAO: "Vencedor",
                DESAFIOTERMINADO: "Este desafio já foi terminado!",
                SELECCIONEIMAGEN: "Selecione a imagem para comprovar o resultado",
                ADICIONARPARTICPANTES: "Adicione os participantes:",
                NOMEGAMERTAG: "Nome",
                SAIRTORNEIOTODOS: "Você tem certeza que quer eliminar este torneio?",
                CRIARNOVO: "Novo Torneio",
                RODADA: "Rodada",
                PARACRIARTORNEIO: "Para criar un novo torneio você deve estar logado.",
                MEUSTORNEIOS: "Meus Torneios",
                NOVO: "Novo",
                CAMPOSPREENCHIDOS: "Todos os campos devem ser preenchidos.",
                NUMEROMININO: "Você debe adicionar pelo menos 4 participantes!",
                NOMESREPETIDOS: "Modifique ou elimine os nomes repetidos!",
                ADICIONENOVOTORNEIO: "Adicione um novo torneio e convide seus amigos para jogar!",
                OUTROSTORNEIOS: "Outros Torneios",
                CHAVEDEACESSO: "Chave de acesso",
                BUSCARTORNEIO: "Pesquisar torneio:",
                VERIFICARDATOS: "Não se encontrou este torneio, por favore verifique o GAMERTAG e/ou a CHAVE DE ACESSO e volte a pesquisar.",
                TORNEIOENCONTRADO: "Torneio encontrado!",
                TORNEIOSADICIONADOS: "Você poderá ver os torneios adicionados na aba 'Outros Torneios'",
                AQUILISTATORNEIOOUTROS: "Aqui se verá a lista dos torneios criados pelo seus amigos e adicionados por você.",
                TORNEIOS: "Torneios",
                TORNEIO: "Torneo",
                TORNEIOJAFOIADICIONADO: "Este torneio já está adicionado em sua lista de OUTROS TORNEIOS",
                CHAVE: "Chave",
                ESTAECHAVEACESSO: "Esta é a chave de acesso para este torneio, compartilhe com seus amigos!",
                ADICIONEPARTICCOMPARTA: "Entre aqui, adicione os participantes e compartilhe a chave de acesso deste torneio!",
                ADICIONARADMIN: "Adicionar Administrador",
                ATUALIZAR: "Atualizar",
                GERARCONFRONTOS: "Gerar confrontos"
            };
        }
        if ( options.key === 'en' ) {
            translations = {
                LENGUAJE_ID: 3,
                LENGUAJE: "English",
                PONTOS: "Score"
            };
        }
        $timeout( function() {
            deferred.resolve( translations );
        }, 2000 );
        return deferred.promise;
    };
} );