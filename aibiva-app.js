(function () {
  'use strict';

  const METHOD = window.AIBIVA_METHOD || 'combined';
  const SOURCE_DATA = Array.isArray(window.AIBIVA_POPULATIONS) ? window.AIBIVA_POPULATIONS : [];
  const CHI_SQUARE = {
    tolerance50: 1.386,
    tolerance75: 2.773,
    tolerance95: 5.991,
    confidence95: 5.991
  };
  const P = 2;

  const METHOD_LABELS = {
    tolerance: { 'pt-BR': 'Tolerância', en: 'Tolerance', es: 'Tolerancia' },
    confidence: { 'pt-BR': 'Confiança', en: 'Confidence', es: 'Confianza' },
    combined: { 'pt-BR': 'Mista', en: 'Combined', es: 'Mixta' }
  };

  const TRANSLATIONS = {
    'pt-BR': {
      'method.title': METHOD_LABELS[METHOD]['pt-BR'],
      'sidebar.population': 'População de Referência',
      'filters.sex': 'Sexo',
      'filters.all': 'Todos',
      'filters.allFem': 'Todas',
      'filters.male': 'Masculino',
      'filters.female': 'Feminino',
      'filters.country': 'País',
      'filters.age': 'Faixa Etária',
      'filters.equipment': 'Equipamento',
      'filters.population': 'População',
      'filters.search': 'Buscar...',
      'filters.loading': 'Carregando...',
      'filters.none': 'Nenhuma população encontrada',
      'input.title': 'Nova Medição',
      'input.r': 'Resistência (R, Ω)',
      'input.xc': 'Reatância (Xc, Ω)',
      'input.h': 'Estatura (H, m)',
      'input.group': 'Grupo',
      'input.groupPlaceholder': 'Ex: Controle',
      'input.moment': 'Momento',
      'input.momentPlaceholder': 'Ex: Pré',
      'input.id': 'Identificação (opcional)',
      'input.idPlaceholder': 'Ex: Paciente 01',
      'input.add': 'Adicionar',
      'input.clear': 'Limpar',
      'input.invalid': 'Informe valores positivos para R, Xc e estatura.',
      'stats.summary': 'Resumo',
      'stats.sd': 'DP:',
      'stats.meanRH': 'Média R/H',
      'stats.meanXcH': 'Média Xc/H',
      'chart.title': 'Nomograma BIVA (R/H vs Xc/H)',
      'chart.x': 'Resistência / Estatura (R/H) [Ω/m]',
      'chart.y': 'Reatância / Estatura (Xc/H) [Ω/m]',
      'chart.xShort': 'R/H',
      'chart.yShort': 'Xc/H',
      'chart.specificX': 'Resistência específica (Rsp)',
      'chart.specificY': 'Reatância específica (Xcsp)',
      'chart.specificXShort': 'Rsp',
      'chart.specificYShort': 'Xcsp',
      'chart.zx': 'Z(R)',
      'chart.zy': 'Z(Xc)',
      'axis.title': 'Eixos e visualização',
      'axis.xMin': '{axis} mín',
      'axis.xMax': '{axis} máx',
      'axis.yMin': '{axis} mín',
      'axis.yMax': '{axis} máx',
      'axis.apply': 'Aplicar eixos',
      'axis.auto': 'Auto',
      'axis.phaseLine': 'Linha ao 0 e ângulo de fase',
      'axis.phase': 'Ângulo de fase',
      'mixed.open': 'Abrir na mista',
      'chart.measurements': 'Medições',
      'chart.countSingular': '1 medição',
      'chart.countPlural': '{n} medições',
      'export.csv': 'CSV',
      'export.chartPng': 'Gráfico PNG',
      'export.ellipsePng': 'Elipse PNG',
      'export.excel': 'Excel',
      'export.ellipsePngTitle': 'Baixar elipse como imagem',
      'export.excelTitle': 'Baixar Excel editável',
      'analysis.title': 'Comparação de Confiança',
      'analysis.mode': 'Tipo',
      'analysis.cross': 'Transversal',
      'analysis.longitudinal': 'Longitudinal',
      'analysis.pairedConfidence': 'Confiança pareada',
      'analysis.groupA': 'Grupo A',
      'analysis.groupB': 'Grupo B',
      'analysis.momentA': 'Momento A',
      'analysis.momentB': 'Momento B',
      'analysis.ellipseA': 'Elipse A',
      'analysis.ellipseB': 'Elipse B',
      'analysis.pairedResult': 'Confiança pareada',
      'analysis.run': 'Calcular comparação',
      'analysis.needTwoGroups': 'Adicione pelo menos dois grupos com medições.',
      'analysis.needTwoMoments': 'Adicione pelo menos dois momentos com IDs repetidos.',
      'analysis.needSamples': 'A comparação precisa de amostras suficientes para estimar a covariância.',
      'analysis.needPairs': 'A comparação longitudinal precisa de pelo menos 3 pares com a mesma identificação.',
      'analysis.singular': 'A matriz de covariância não pôde ser invertida.',
      'analysis.resultCross': 'Transversal independente',
      'analysis.resultLongitudinal': 'Longitudinal pareada',
      'analysis.n': 'n',
      'analysis.pairs': 'pares',
      'analysis.hotelling': 'Hotelling T²',
      'analysis.mahalanobis': 'Mahalanobis D',
      'analysis.mahalanobis2': 'Mahalanobis D²',
      'analysis.f': 'F',
      'analysis.p': 'p',
      'analysis.df': 'gl',
      'ellipseCompare.title': 'Elipses para comparar',
      'ellipseCompare.markCurrent': 'Marcar atual',
      'ellipseCompare.clear': 'Limpar',
      'ellipseCompare.none': 'Nenhuma elipse de confiança disponível com os filtros atuais.',
      'ellipseCompare.selected': '{n} elipses marcadas',
      'ellipseCompare.needTwo': 'Marque pelo menos duas elipses de confiança para comparar.',
      'ellipseCompare.currentNotConfidence': 'A população atual não é uma elipse de confiança.',
      'ellipseCompare.pairwise': 'Comparações pareadas entre elipses',
      'ellipseCompare.ellipseA': 'Elipse A',
      'ellipseCompare.ellipseB': 'Elipse B',
      'ellipseCompare.styles': 'Estilo das elipses marcadas',
      'ellipseCompare.remove': 'Remover',
      'floating.title': 'Testes estatísticos',
      'floating.close': 'Fechar janela',
      'floating.noP': 'Sem p-value calculado',
      'style.title': 'Indivíduos relacionados',
      'style.group': 'Grupo',
      'style.color': 'Cor',
      'style.symbol': 'Símbolo',
      'style.apply': 'Aplicar estilo',
      'style.none': 'Adicione medições com grupo.',
      'style.circle': 'Círculo',
      'style.square': 'Quadrado',
      'style.triangle': 'Triângulo',
      'style.diamond': 'Losango',
      'style.cross': 'Cruz',
      'ellipseInput.title': 'Nova elipse',
      'ellipseInput.import': 'Import ellipse',
      'ellipseInput.template': 'Baixar modelo Excel',
      'ellipseInput.imported': '{n} elipses importadas.',
      'ellipseInput.importError': 'Não foi possível importar a planilha. Confira o modelo.',
      'ellipseInput.emptyImport': 'Nenhuma elipse válida foi encontrada na planilha.',
      'ellipseInput.name': 'Nome da elipse',
      'ellipseInput.type': 'Tipo',
      'ellipseInput.classic': 'Classic',
      'ellipseInput.specific': 'Specific',
      'ellipseInput.pairId': 'ID pareado',
      'ellipseInput.pairPlaceholder': 'Ex: Grupo A',
      'ellipseInput.correlation': 'Correlação',
      'ellipseInput.arm': 'Perímetro braço direito (cm)',
      'ellipseInput.waist': 'Perímetro cintura (cm)',
      'ellipseInput.calf': 'Perímetro panturrilha direita (cm)',
      'ellipseInput.add': 'Adicionar elipse',
      'ellipseInput.invalid': 'Informe média, DP, correlação e N válidos para a elipse.',
      'ellipseInput.invalidSpecific': 'No modo Specific, informe braço direito, cintura e panturrilha direita.',
      'toleranceImport.title': 'Importar participantes',
      'toleranceImport.button': 'Importar Excel',
      'toleranceImport.template': 'Baixar modelo Excel',
      'toleranceImport.imported': '{n} participantes importados.',
      'toleranceImport.error': 'Não foi possível importar a planilha. Confira o modelo.',
      'toleranceImport.empty': 'Nenhum participante válido foi encontrado na planilha.',
      'ellipseStyle.line': 'Traço',
      'ellipseStyle.solid': 'Cheio',
      'ellipseStyle.dash': 'Tracejado',
      'ellipseStyle.dot': 'Pontilhado',
      'ellipseStyle.width': 'Espessura',
      'theme.light': 'Claro',
      'theme.dark': 'Escuro',
      'toleranceMode.title': 'Modo da tolerância',
      'toleranceMode.classic': 'Elipse tradicional deslocada',
      'toleranceMode.zscore': 'Elipse centrada no 0 (z-score)',
      'nav.back': 'Voltar'
    },
    en: {
      'method.title': METHOD_LABELS[METHOD].en,
      'sidebar.population': 'Reference Population',
      'filters.sex': 'Sex',
      'filters.all': 'All',
      'filters.allFem': 'All',
      'filters.male': 'Male',
      'filters.female': 'Female',
      'filters.country': 'Country',
      'filters.age': 'Age Range',
      'filters.equipment': 'Equipment',
      'filters.population': 'Population',
      'filters.search': 'Search...',
      'filters.loading': 'Loading...',
      'filters.none': 'No population found',
      'input.title': 'New Measurement',
      'input.r': 'Resistance (R, Ω)',
      'input.xc': 'Reactance (Xc, Ω)',
      'input.h': 'Height (H, m)',
      'input.group': 'Group',
      'input.groupPlaceholder': 'e.g. Control',
      'input.moment': 'Moment',
      'input.momentPlaceholder': 'e.g. Pre',
      'input.id': 'Identifier (optional)',
      'input.idPlaceholder': 'e.g. Patient 01',
      'input.add': 'Add',
      'input.clear': 'Clear',
      'input.invalid': 'Enter positive values for R, Xc and height.',
      'stats.summary': 'Summary',
      'stats.sd': 'SD:',
      'stats.meanRH': 'Mean R/H',
      'stats.meanXcH': 'Mean Xc/H',
      'chart.title': 'BIVA Nomogram (R/H vs Xc/H)',
      'chart.x': 'Resistance / Height (R/H) [Ω/m]',
      'chart.y': 'Reactance / Height (Xc/H) [Ω/m]',
      'chart.xShort': 'R/H',
      'chart.yShort': 'Xc/H',
      'chart.specificX': 'Specific resistance (Rsp)',
      'chart.specificY': 'Specific reactance (Xcsp)',
      'chart.specificXShort': 'Rsp',
      'chart.specificYShort': 'Xcsp',
      'chart.zx': 'Z(R)',
      'chart.zy': 'Z(Xc)',
      'axis.title': 'Axes and view',
      'axis.xMin': '{axis} min',
      'axis.xMax': '{axis} max',
      'axis.yMin': '{axis} min',
      'axis.yMax': '{axis} max',
      'axis.apply': 'Apply axes',
      'axis.auto': 'Auto',
      'axis.phaseLine': 'Line to 0 and phase angle',
      'axis.phase': 'Phase angle',
      'mixed.open': 'Open in combined',
      'chart.measurements': 'Measurements',
      'chart.countSingular': '1 measurement',
      'chart.countPlural': '{n} measurements',
      'export.csv': 'CSV',
      'export.chartPng': 'Chart PNG',
      'export.ellipsePng': 'Ellipse PNG',
      'export.excel': 'Excel',
      'export.ellipsePngTitle': 'Download ellipse as image',
      'export.excelTitle': 'Download editable Excel file',
      'analysis.title': 'Confidence Comparison',
      'analysis.mode': 'Type',
      'analysis.cross': 'Cross-sectional',
      'analysis.longitudinal': 'Longitudinal',
      'analysis.pairedConfidence': 'Paired confidence',
      'analysis.groupA': 'Group A',
      'analysis.groupB': 'Group B',
      'analysis.momentA': 'Moment A',
      'analysis.momentB': 'Moment B',
      'analysis.ellipseA': 'Ellipse A',
      'analysis.ellipseB': 'Ellipse B',
      'analysis.pairedResult': 'Paired confidence',
      'analysis.run': 'Calculate comparison',
      'analysis.needTwoGroups': 'Add at least two groups with measurements.',
      'analysis.needTwoMoments': 'Add at least two moments with repeated IDs.',
      'analysis.needSamples': 'The comparison needs enough samples to estimate covariance.',
      'analysis.needPairs': 'The longitudinal comparison needs at least 3 pairs with the same identifier.',
      'analysis.singular': 'The covariance matrix could not be inverted.',
      'analysis.resultCross': 'Independent cross-sectional',
      'analysis.resultLongitudinal': 'Paired longitudinal',
      'analysis.n': 'n',
      'analysis.pairs': 'pairs',
      'analysis.hotelling': 'Hotelling T²',
      'analysis.mahalanobis': 'Mahalanobis D',
      'analysis.mahalanobis2': 'Mahalanobis D²',
      'analysis.f': 'F',
      'analysis.p': 'p',
      'analysis.df': 'df',
      'ellipseCompare.title': 'Ellipses to Compare',
      'ellipseCompare.markCurrent': 'Mark current',
      'ellipseCompare.clear': 'Clear',
      'ellipseCompare.none': 'No confidence ellipse is available with the current filters.',
      'ellipseCompare.selected': '{n} selected ellipses',
      'ellipseCompare.needTwo': 'Select at least two confidence ellipses to compare.',
      'ellipseCompare.currentNotConfidence': 'The current population is not a confidence ellipse.',
      'ellipseCompare.pairwise': 'Pairwise ellipse comparisons',
      'ellipseCompare.ellipseA': 'Ellipse A',
      'ellipseCompare.ellipseB': 'Ellipse B',
      'ellipseCompare.styles': 'Selected ellipse style',
      'ellipseCompare.remove': 'Remove',
      'floating.title': 'Statistical tests',
      'floating.close': 'Close panel',
      'floating.noP': 'No p-value calculated',
      'style.title': 'Related individuals',
      'style.group': 'Group',
      'style.color': 'Color',
      'style.symbol': 'Symbol',
      'style.apply': 'Apply style',
      'style.none': 'Add measurements with a group.',
      'style.circle': 'Circle',
      'style.square': 'Square',
      'style.triangle': 'Triangle',
      'style.diamond': 'Diamond',
      'style.cross': 'Cross',
      'ellipseInput.title': 'New ellipse',
      'ellipseInput.import': 'Import ellipse',
      'ellipseInput.template': 'Download Excel template',
      'ellipseInput.imported': '{n} ellipses imported.',
      'ellipseInput.importError': 'The spreadsheet could not be imported. Check the template.',
      'ellipseInput.emptyImport': 'No valid ellipse was found in the spreadsheet.',
      'ellipseInput.name': 'Ellipse name',
      'ellipseInput.type': 'Type',
      'ellipseInput.classic': 'Classic',
      'ellipseInput.specific': 'Specific',
      'ellipseInput.pairId': 'Paired ID',
      'ellipseInput.pairPlaceholder': 'Ex: Group A',
      'ellipseInput.correlation': 'Correlation',
      'ellipseInput.arm': 'Right arm circumference (cm)',
      'ellipseInput.waist': 'Waist circumference (cm)',
      'ellipseInput.calf': 'Right calf circumference (cm)',
      'ellipseInput.add': 'Add ellipse',
      'ellipseInput.invalid': 'Enter valid mean, SD, correlation and N for the ellipse.',
      'ellipseInput.invalidSpecific': 'For Specific mode, enter right arm, waist and right calf circumferences.',
      'toleranceImport.title': 'Import participants',
      'toleranceImport.button': 'Import Excel',
      'toleranceImport.template': 'Download Excel template',
      'toleranceImport.imported': '{n} participants imported.',
      'toleranceImport.error': 'The spreadsheet could not be imported. Check the template.',
      'toleranceImport.empty': 'No valid participant was found in the spreadsheet.',
      'ellipseStyle.line': 'Line',
      'ellipseStyle.solid': 'Solid',
      'ellipseStyle.dash': 'Dashed',
      'ellipseStyle.dot': 'Dotted',
      'ellipseStyle.width': 'Width',
      'theme.light': 'Light',
      'theme.dark': 'Dark',
      'toleranceMode.title': 'Tolerance mode',
      'toleranceMode.classic': 'Traditional shifted ellipse',
      'toleranceMode.zscore': 'Centered at 0 (z-score)',
      'nav.back': 'Back'
    },
    es: {
      'method.title': METHOD_LABELS[METHOD].es,
      'sidebar.population': 'Población de Referencia',
      'filters.sex': 'Sexo',
      'filters.all': 'Todos',
      'filters.allFem': 'Todas',
      'filters.male': 'Masculino',
      'filters.female': 'Femenino',
      'filters.country': 'País',
      'filters.age': 'Rango de edad',
      'filters.equipment': 'Equipo',
      'filters.population': 'Población',
      'filters.search': 'Buscar...',
      'filters.loading': 'Cargando...',
      'filters.none': 'No se encontró población',
      'input.title': 'Nueva Medición',
      'input.r': 'Resistencia (R, Ω)',
      'input.xc': 'Reactancia (Xc, Ω)',
      'input.h': 'Estatura (H, m)',
      'input.group': 'Grupo',
      'input.groupPlaceholder': 'Ej.: Control',
      'input.moment': 'Momento',
      'input.momentPlaceholder': 'Ej.: Pre',
      'input.id': 'Identificación (opcional)',
      'input.idPlaceholder': 'Ej.: Paciente 01',
      'input.add': 'Agregar',
      'input.clear': 'Limpiar',
      'input.invalid': 'Ingrese valores positivos para R, Xc y estatura.',
      'stats.summary': 'Resumen',
      'stats.sd': 'DE:',
      'stats.meanRH': 'Media R/H',
      'stats.meanXcH': 'Media Xc/H',
      'chart.title': 'Nomograma BIVA (R/H vs Xc/H)',
      'chart.x': 'Resistencia / Estatura (R/H) [Ω/m]',
      'chart.y': 'Reactancia / Estatura (Xc/H) [Ω/m]',
      'chart.xShort': 'R/H',
      'chart.yShort': 'Xc/H',
      'chart.specificX': 'Resistencia específica (Rsp)',
      'chart.specificY': 'Reactancia específica (Xcsp)',
      'chart.specificXShort': 'Rsp',
      'chart.specificYShort': 'Xcsp',
      'chart.zx': 'Z(R)',
      'chart.zy': 'Z(Xc)',
      'axis.title': 'Ejes y visualización',
      'axis.xMin': '{axis} mín',
      'axis.xMax': '{axis} máx',
      'axis.yMin': '{axis} mín',
      'axis.yMax': '{axis} máx',
      'axis.apply': 'Aplicar ejes',
      'axis.auto': 'Auto',
      'axis.phaseLine': 'Línea al 0 y ángulo de fase',
      'axis.phase': 'Ángulo de fase',
      'mixed.open': 'Abrir en mixta',
      'chart.measurements': 'Mediciones',
      'chart.countSingular': '1 medición',
      'chart.countPlural': '{n} mediciones',
      'export.csv': 'CSV',
      'export.chartPng': 'Gráfico PNG',
      'export.ellipsePng': 'Elipse PNG',
      'export.excel': 'Excel',
      'export.ellipsePngTitle': 'Descargar elipse como imagen',
      'export.excelTitle': 'Descargar Excel editable',
      'analysis.title': 'Comparación de Confianza',
      'analysis.mode': 'Tipo',
      'analysis.cross': 'Transversal',
      'analysis.longitudinal': 'Longitudinal',
      'analysis.pairedConfidence': 'Confianza pareada',
      'analysis.groupA': 'Grupo A',
      'analysis.groupB': 'Grupo B',
      'analysis.momentA': 'Momento A',
      'analysis.momentB': 'Momento B',
      'analysis.ellipseA': 'Elipse A',
      'analysis.ellipseB': 'Elipse B',
      'analysis.pairedResult': 'Confianza pareada',
      'analysis.run': 'Calcular comparación',
      'analysis.needTwoGroups': 'Agregue al menos dos grupos con mediciones.',
      'analysis.needTwoMoments': 'Agregue al menos dos momentos con IDs repetidos.',
      'analysis.needSamples': 'La comparación necesita muestras suficientes para estimar la covarianza.',
      'analysis.needPairs': 'La comparación longitudinal necesita al menos 3 pares con la misma identificación.',
      'analysis.singular': 'No se pudo invertir la matriz de covarianza.',
      'analysis.resultCross': 'Transversal independiente',
      'analysis.resultLongitudinal': 'Longitudinal pareada',
      'analysis.n': 'n',
      'analysis.pairs': 'pares',
      'analysis.hotelling': 'Hotelling T²',
      'analysis.mahalanobis': 'Mahalanobis D',
      'analysis.mahalanobis2': 'Mahalanobis D²',
      'analysis.f': 'F',
      'analysis.p': 'p',
      'analysis.df': 'gl',
      'ellipseCompare.title': 'Elipses para comparar',
      'ellipseCompare.markCurrent': 'Marcar actual',
      'ellipseCompare.clear': 'Limpiar',
      'ellipseCompare.none': 'No hay elipses de confianza disponibles con los filtros actuales.',
      'ellipseCompare.selected': '{n} elipses seleccionadas',
      'ellipseCompare.needTwo': 'Seleccione al menos dos elipses de confianza para comparar.',
      'ellipseCompare.currentNotConfidence': 'La población actual no es una elipse de confianza.',
      'ellipseCompare.pairwise': 'Comparaciones pareadas entre elipses',
      'ellipseCompare.ellipseA': 'Elipse A',
      'ellipseCompare.ellipseB': 'Elipse B',
      'ellipseCompare.styles': 'Estilo de las elipses seleccionadas',
      'ellipseCompare.remove': 'Eliminar',
      'floating.title': 'Pruebas estadísticas',
      'floating.close': 'Cerrar ventana',
      'floating.noP': 'Sin p-value calculado',
      'style.title': 'Individuos relacionados',
      'style.group': 'Grupo',
      'style.color': 'Color',
      'style.symbol': 'Símbolo',
      'style.apply': 'Aplicar estilo',
      'style.none': 'Agregue mediciones con grupo.',
      'style.circle': 'Círculo',
      'style.square': 'Cuadrado',
      'style.triangle': 'Triángulo',
      'style.diamond': 'Rombo',
      'style.cross': 'Cruz',
      'ellipseInput.title': 'Nueva elipse',
      'ellipseInput.import': 'Import ellipse',
      'ellipseInput.template': 'Descargar modelo Excel',
      'ellipseInput.imported': '{n} elipses importadas.',
      'ellipseInput.importError': 'No fue posible importar la hoja. Verifique el modelo.',
      'ellipseInput.emptyImport': 'No se encontró ninguna elipse válida en la hoja.',
      'ellipseInput.name': 'Nombre de la elipse',
      'ellipseInput.type': 'Tipo',
      'ellipseInput.classic': 'Classic',
      'ellipseInput.specific': 'Specific',
      'ellipseInput.pairId': 'ID pareado',
      'ellipseInput.pairPlaceholder': 'Ej: Grupo A',
      'ellipseInput.correlation': 'Correlación',
      'ellipseInput.arm': 'Perímetro brazo derecho (cm)',
      'ellipseInput.waist': 'Perímetro cintura (cm)',
      'ellipseInput.calf': 'Perímetro pantorrilla derecha (cm)',
      'ellipseInput.add': 'Agregar elipse',
      'ellipseInput.invalid': 'Ingrese media, DE, correlación y N válidos para la elipse.',
      'ellipseInput.invalidSpecific': 'En modo Specific, ingrese brazo derecho, cintura y pantorrilla derecha.',
      'toleranceImport.title': 'Importar participantes',
      'toleranceImport.button': 'Importar Excel',
      'toleranceImport.template': 'Descargar modelo Excel',
      'toleranceImport.imported': '{n} participantes importados.',
      'toleranceImport.error': 'No fue posible importar la hoja. Verifique el modelo.',
      'toleranceImport.empty': 'No se encontró ningún participante válido en la hoja.',
      'ellipseStyle.line': 'Trazo',
      'ellipseStyle.solid': 'Continuo',
      'ellipseStyle.dash': 'Discontinuo',
      'ellipseStyle.dot': 'Punteado',
      'ellipseStyle.width': 'Grosor',
      'theme.light': 'Claro',
      'theme.dark': 'Oscuro',
      'toleranceMode.title': 'Modo de tolerancia',
      'toleranceMode.classic': 'Elipse tradicional desplazada',
      'toleranceMode.zscore': 'Elipse centrada en 0 (z-score)',
      'nav.back': 'Volver'
    }
  };

  let currentLanguage = localStorage.getItem('selectedLanguage') || 'pt-BR';
  let allPopulations = [];
  let filteredPopulations = [];
  let measurements = [];
  let bivaChart = null;
  let currentAnalysisResult = null;
  let selectedEllipseKeys = new Set();
  let ellipseComparisonResults = [];
  let groupStyles = new Map();
  let userEllipses = [];
  let customEllipseCounter = 1;
  let tolerancePlotMode = localStorage.getItem('aibivaToleranceMode') || 'classic';
  let axisSettings = (() => {
    try { return JSON.parse(localStorage.getItem('aibivaAxisSettings') || 'null'); }
    catch (_) { return null; }
  })();
  let showPhaseLine = localStorage.getItem('aibivaShowPhaseLine') !== 'false';
  let floatingStatsClosedSignature = '';
  let floatingStatsPosition = null;
  let floatingStatsDrag = null;

  function t(key) {
    return (TRANSLATIONS[currentLanguage] && TRANSLATIONS[currentLanguage][key]) || key;
  }

  function isSpecificView() {
    if (!(METHOD === 'confidence' || METHOD === 'combined')) return false;
    const selected = selectedEllipsePopulations();
    if (selected.length) return selected.every((item) => item.type === 'specific' || item.age_range === 'Specific');
    return document.getElementById('ellipseType')?.value === 'specific';
  }

  function axisLabelSet() {
    if (METHOD === 'tolerance' && tolerancePlotMode === 'zscore') {
      return { x: t('chart.zx'), y: t('chart.zy'), xShort: t('chart.zx'), yShort: t('chart.zy') };
    }
    if (isSpecificView()) {
      return { x: t('chart.specificX'), y: t('chart.specificY'), xShort: t('chart.specificXShort'), yShort: t('chart.specificYShort') };
    }
    return { x: t('chart.x'), y: t('chart.y'), xShort: t('chart.xShort'), yShort: t('chart.yShort') };
  }

  function applyTheme(theme = localStorage.getItem('aibivaTheme') || 'light') {
    const normalized = theme === 'dark' ? 'dark' : 'light';
    localStorage.setItem('aibivaTheme', normalized);
    document.documentElement.classList.toggle('dark', normalized === 'dark');
    const label = document.getElementById('themeLabel');
    if (label) label.textContent = normalized === 'dark' ? t('theme.light') : t('theme.dark');
    const icon = document.getElementById('themeIcon');
    if (icon) icon.setAttribute('data-lucide', normalized === 'dark' ? 'sun' : 'moon');
    if (window.lucide) window.lucide.createIcons();
  }

  function toggleTheme() {
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
  }

  function readAxisSettingsFromInputs() {
    const value = (id) => {
      const raw = document.getElementById(id)?.value;
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : null;
    };
    const settings = {
      xMin: value('axisXMin'),
      xMax: value('axisXMax'),
      yMin: value('axisYMin'),
      yMax: value('axisYMax')
    };
    return Object.values(settings).some((item) => item !== null) ? settings : null;
  }

  function applyAxisSettings() {
    axisSettings = readAxisSettingsFromInputs();
    if (axisSettings) localStorage.setItem('aibivaAxisSettings', JSON.stringify(axisSettings));
    else localStorage.removeItem('aibivaAxisSettings');
    updateDatasetLabels();
    if (bivaChart) bivaChart.update();
  }

  function clearAxisSettings() {
    axisSettings = null;
    localStorage.removeItem('aibivaAxisSettings');
    ['axisXMin', 'axisXMax', 'axisYMin', 'axisYMax'].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.value = '';
    });
    updateDatasetLabels();
    if (bivaChart) bivaChart.update();
  }

  function togglePhaseLine(checked) {
    showPhaseLine = Boolean(checked);
    localStorage.setItem('aibivaShowPhaseLine', showPhaseLine ? 'true' : 'false');
    updateEllipses();
  }

  function formatNumber(value, digits = 3) {
    return Number.isFinite(value) ? value.toFixed(digits) : '-';
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function byMethod(pop) {
    if (METHOD === 'combined') return pop.source === 'tolerance' || pop.source === 'confidence';
    return pop.source === METHOD;
  }

  function inferSex(pop, legend) {
    const raw = String(pop.sex || '').trim().toLowerCase();
    if (raw === 'm' || raw === 'male' || raw === 'masculino') return 'M';
    if (raw === 'f' || raw === 'female' || raw === 'feminino') return 'F';
    if (/^females?\b/i.test(legend)) return 'F';
    if (/^males?\b/i.test(legend)) return 'M';
    if (/\bfemales?\b/i.test(legend) && !/\bmales?\s*\+\s*females?\b/i.test(legend)) return 'F';
    if (/\bmales?\b/i.test(legend) && !/\bmales?\s*\+\s*females?\b/i.test(legend)) return 'M';
    return 'U';
  }

  function inferCountry(legend) {
    const countries = ['Italy', 'USA', 'Brazil', 'Mexico', 'Spain', 'France', 'Germany', 'Portugal'];
    return countries.find((country) => new RegExp(`\\b${country}\\b`, 'i').test(legend)) || 'Unknown';
  }

  function inferAgeRange(legend) {
    const ranged = legend.match(/(\d+)\s*age\s*(\d+)\s*(yr|years?|days?)/i);
    if (ranged) return `${ranged[1]}-${ranged[2]} ${ranged[3].toLowerCase().replace('yr', 'years')}`;
    const single = legend.match(/age\s*(\d+)\s*(yr|years?|days?)/i);
    if (single) return `${single[1]} ${single[2].toLowerCase().replace('yr', 'years')}`;
    if (/\badult\b/i.test(legend)) return 'Adult';
    return 'Unknown';
  }

  function inferEquipment(legend) {
    const match = legend.match(/\(([^)]*(?:Akern|RJL|BIA|Bodystat|InBody|Tanita|SEAC)[^)]*)\)/i);
    if (match) return match[1].replace(/\s+/g, ' ').trim();
    if (/akern/i.test(legend)) return 'Akern-RJL Systems';
    if (/rjl/i.test(legend)) return 'RJL Systems';
    return 'Unknown';
  }

  function inferPopulationType(legend) {
    if (/athlet|sport|endurance|velocity|power|team-sports/i.test(legend)) return 'Sport';
    if (/clinical|patient|disease|renal|cardiac|obese|cancer|sarcopen/i.test(legend)) return 'Clinical';
    if (/healthy|reference|adult|children|adolescent/i.test(legend)) return 'Healthy';
    return 'Other';
  }

  function normalizePopulation(pop, index) {
    const legend = String(pop.legend || `População ${index + 1}`).replace(/\s+/g, ' ').trim();
    const source = pop.source === 'confidence' ? 'confidence' : 'tolerance';
    const sexCode = inferSex(pop, legend);
    const sourceLabel = source === 'confidence' ? 'Confiança' : 'Tolerância';
    const name = `${sourceLabel} ${pop.code || index + 1} - ${legend} (N=${pop.n || '?'})`;

    return {
      ...pop,
      key: `${source}:${pop.code || index + 1}:${index}`,
      legend,
      source,
      name,
      sex_code: sexCode,
      country: pop.country || inferCountry(legend),
      age_range: pop.age_range || inferAgeRange(legend),
      equipment: pop.equipment || inferEquipment(legend),
      population_type: pop.population_type || inferPopulationType(legend),
      n: Number(pop.n) || 1,
      r_h_mean: Number(pop.r_h_mean),
      r_h_sd: Number(pop.r_h_sd),
      xc_h_mean: Number(pop.xc_h_mean),
      xc_h_sd: Number(pop.xc_h_sd),
      correlation: Math.max(-0.999, Math.min(0.999, Number(pop.correlation) || 0))
    };
  }

  function hasCompleteEllipseData(pop) {
    return [pop.n, pop.r_h_mean, pop.r_h_sd, pop.xc_h_mean, pop.xc_h_sd, pop.correlation]
      .every((value) => Number.isFinite(Number(value)))
      && Number(pop.n) > P
      && Number(pop.r_h_sd) > 0
      && Number(pop.xc_h_sd) > 0
      && Math.abs(Number(pop.correlation)) < 1;
  }

  function shouldKeepReference(pop) {
    const legend = String(pop.legend || '');
    if (!hasCompleteEllipseData(pop)) return false;
    if (/^Piccoli\s+1995$/i.test(legend)) return false;
    if (pop.source === 'confidence' && /(braço|braco|arm)/i.test(legend)) return false;
    return true;
  }

  function selectedPopulation() {
    const select = document.getElementById('referenceGroup');
    if (!select) return null;
    const idx = Number.parseInt(select.value, 10);
    return Number.isInteger(idx) && idx >= 0 ? filteredPopulations[idx] : null;
  }

  function generateEllipse(meanX, meanY, sdX, sdY, r, chiSquareValue) {
    const points = [];
    const steps = 140;
    const c = Math.sqrt(chiSquareValue);
    const safeR = Math.max(-0.999, Math.min(0.999, r || 0));
    const orthogonal = Math.sqrt(1 - safeR * safeR);

    for (let i = 0; i <= steps; i += 1) {
      const t = (i * 2 * Math.PI) / steps;
      const cos = Math.cos(t);
      const sin = Math.sin(t);
      points.push({
        x: meanX + sdX * c * cos,
        y: meanY + sdY * c * (safeR * cos + orthogonal * sin)
      });
    }
    return points;
  }

  function covarianceDistance(pop, point) {
    const dx = point.r_h - pop.r_h_mean;
    const dy = point.xc_h - pop.xc_h_mean;
    const sx = pop.r_h_sd || 1;
    const sy = pop.xc_h_sd || 1;
    const r = pop.correlation || 0;
    const denom = Math.max(0.000001, 1 - r * r);
    return ((dx / sx) ** 2 - (2 * r * dx * dy) / (sx * sy) + (dy / sy) ** 2) / denom;
  }

  function displayPoint(point, pop = selectedPopulation()) {
    if (METHOD === 'tolerance' && tolerancePlotMode === 'zscore' && pop) {
      return {
        x: (point.r_h - pop.r_h_mean) / pop.r_h_sd,
        y: (point.xc_h - pop.xc_h_mean) / pop.xc_h_sd,
        group: point.group,
        id: point.id
      };
    }
    return { x: point.r_h, y: point.xc_h, group: point.group, id: point.id };
  }

  function meanVector(items) {
    const n = items.length || 1;
    return [
      items.reduce((sum, item) => sum + item.r_h, 0) / n,
      items.reduce((sum, item) => sum + item.xc_h, 0) / n
    ];
  }

  function covarianceMatrix(items, mean = meanVector(items)) {
    const denom = items.length - 1;
    if (denom <= 0) return null;
    return items.reduce((matrix, item) => {
      const dx = item.r_h - mean[0];
      const dy = item.xc_h - mean[1];
      matrix[0][0] += dx * dx / denom;
      matrix[0][1] += dx * dy / denom;
      matrix[1][0] += dx * dy / denom;
      matrix[1][1] += dy * dy / denom;
      return matrix;
    }, [[0, 0], [0, 0]]);
  }

  function covarianceFromPopulation(pop) {
    return [
      [pop.r_h_sd ** 2, pop.correlation * pop.r_h_sd * pop.xc_h_sd],
      [pop.correlation * pop.r_h_sd * pop.xc_h_sd, pop.xc_h_sd ** 2]
    ];
  }

  function invert2(matrix) {
    if (!matrix) return null;
    const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    if (!Number.isFinite(det) || Math.abs(det) < 1e-10) return null;
    return [
      [matrix[1][1] / det, -matrix[0][1] / det],
      [-matrix[1][0] / det, matrix[0][0] / det]
    ];
  }

  function quadratic(vector, matrix) {
    return vector[0] * (matrix[0][0] * vector[0] + matrix[0][1] * vector[1])
      + vector[1] * (matrix[1][0] * vector[0] + matrix[1][1] * vector[1]);
  }

  function subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  }

  function pooledCovariance(groupA, groupB) {
    const meanA = meanVector(groupA);
    const meanB = meanVector(groupB);
    const covA = covarianceMatrix(groupA, meanA);
    const covB = covarianceMatrix(groupB, meanB);
    if (!covA || !covB) return null;
    const denom = groupA.length + groupB.length - 2;
    if (denom <= 0) return null;
    return [
      [
        ((groupA.length - 1) * covA[0][0] + (groupB.length - 1) * covB[0][0]) / denom,
        ((groupA.length - 1) * covA[0][1] + (groupB.length - 1) * covB[0][1]) / denom
      ],
      [
        ((groupA.length - 1) * covA[1][0] + (groupB.length - 1) * covB[1][0]) / denom,
        ((groupA.length - 1) * covA[1][1] + (groupB.length - 1) * covB[1][1]) / denom
      ]
    ];
  }

  function logGamma(z) {
    const coeff = [
      676.5203681218851,
      -1259.1392167224028,
      771.32342877765313,
      -176.61502916214059,
      12.507343278686905,
      -0.13857109526572012,
      9.9843695780195716e-6,
      1.5056327351493116e-7
    ];
    if (z < 0.5) return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    let x = 0.99999999999980993;
    const shifted = z - 1;
    for (let i = 0; i < coeff.length; i += 1) x += coeff[i] / (shifted + i + 1);
    const g = 7;
    const tValue = shifted + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (shifted + 0.5) * Math.log(tValue) - tValue + Math.log(x);
  }

  function betaContinuedFraction(a, b, x) {
    const maxIterations = 120;
    const eps = 3e-9;
    const fpmin = 1e-30;
    let qab = a + b;
    let qap = a + 1;
    let qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if (Math.abs(d) < fpmin) d = fpmin;
    d = 1 / d;
    let h = d;

    for (let m = 1; m <= maxIterations; m += 1) {
      const m2 = 2 * m;
      let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < fpmin) d = fpmin;
      c = 1 + aa / c;
      if (Math.abs(c) < fpmin) c = fpmin;
      d = 1 / d;
      h *= d * c;

      aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
      d = 1 + aa * d;
      if (Math.abs(d) < fpmin) d = fpmin;
      c = 1 + aa / c;
      if (Math.abs(c) < fpmin) c = fpmin;
      d = 1 / d;
      const del = d * c;
      h *= del;
      if (Math.abs(del - 1) < eps) break;
    }
    return h;
  }

  function regularizedBeta(x, a, b) {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
    if (x < (a + 1) / (a + b + 2)) return (bt * betaContinuedFraction(a, b, x)) / a;
    return 1 - (bt * betaContinuedFraction(b, a, 1 - x)) / b;
  }

  function fSurvival(fValue, df1, df2) {
    if (!Number.isFinite(fValue) || fValue < 0 || df1 <= 0 || df2 <= 0) return NaN;
    const x = (df1 * fValue) / (df1 * fValue + df2);
    return Math.max(0, Math.min(1, 1 - regularizedBeta(x, df1 / 2, df2 / 2)));
  }

  function hotellingIndependent(groupA, groupB) {
    if (groupA.length < 3 || groupB.length < 3) return { error: t('analysis.needSamples') };
    const meanA = meanVector(groupA);
    const meanB = meanVector(groupB);
    const pooled = pooledCovariance(groupA, groupB);
    const inverse = invert2(pooled);
    if (!inverse) return { error: t('analysis.singular') };
    const diff = subtract(meanA, meanB);
    const d2 = quadratic(diff, inverse);
    const t2 = (groupA.length * groupB.length / (groupA.length + groupB.length)) * d2;
    const df1 = P;
    const df2 = groupA.length + groupB.length - P - 1;
    const fValue = (df2 / (P * (groupA.length + groupB.length - 2))) * t2;
    return { mode: 'cross', nA: groupA.length, nB: groupB.length, meanA, meanB, diff, d2, t2, fValue, df1, df2, pValue: fSurvival(fValue, df1, df2) };
  }

  function hotellingFromPopulations(popA, popB) {
    if (popA.n <= P || popB.n <= P) return { error: t('analysis.needSamples') };
    const covA = covarianceFromPopulation(popA);
    const covB = covarianceFromPopulation(popB);
    const denom = popA.n + popB.n - 2;
    if (denom <= 0) return { error: t('analysis.needSamples') };
    const pooled = [
      [
        ((popA.n - 1) * covA[0][0] + (popB.n - 1) * covB[0][0]) / denom,
        ((popA.n - 1) * covA[0][1] + (popB.n - 1) * covB[0][1]) / denom
      ],
      [
        ((popA.n - 1) * covA[1][0] + (popB.n - 1) * covB[1][0]) / denom,
        ((popA.n - 1) * covA[1][1] + (popB.n - 1) * covB[1][1]) / denom
      ]
    ];
    const inverse = invert2(pooled);
    if (!inverse) return { error: t('analysis.singular') };
    const meanA = [popA.r_h_mean, popA.xc_h_mean];
    const meanB = [popB.r_h_mean, popB.xc_h_mean];
    const diff = subtract(meanA, meanB);
    const d2 = quadratic(diff, inverse);
    const t2 = (popA.n * popB.n / (popA.n + popB.n)) * d2;
    const df1 = P;
    const df2 = popA.n + popB.n - P - 1;
    const fValue = (df2 / (P * (popA.n + popB.n - 2))) * t2;
    return { popA, popB, nA: popA.n, nB: popB.n, meanA, meanB, diff, d2, t2, fValue, df1, df2, pValue: fSurvival(fValue, df1, df2) };
  }

  function hotellingPairedFromEllipses(momentA, momentB) {
    const ellipses = selectedEllipsePopulations();
    const groupA = ellipses.filter((item) => item.moment === momentA);
    const groupB = ellipses.filter((item) => item.moment === momentB);
    const pairs = [];
    groupA.forEach((a) => {
      const b = groupB.find((item) => item.pairId && item.pairId === a.pairId) || (groupA.length === 1 && groupB.length === 1 ? groupB[0] : null);
      if (b) pairs.push([a, b]);
    });
    if (!pairs.length) return { error: t('analysis.needPairs') };
    const results = pairs.map(([popA, popB]) => ({ ...hotellingFromPopulations(popA, popB), mode: 'paired', popA, popB }));
    const valid = results.filter((result) => !result.error);
    if (!valid.length) return results[0];
    if (valid.length === 1) return valid[0];
    return {
      mode: 'paired',
      pairs: valid,
      nPairs: valid.length,
      d2: valid.reduce((sum, result) => sum + result.d2, 0) / valid.length,
      t2: valid.reduce((sum, result) => sum + result.t2, 0) / valid.length,
      fValue: valid.reduce((sum, result) => sum + result.fValue, 0) / valid.length,
      df1: valid[0].df1,
      df2: valid.reduce((sum, result) => sum + result.df2, 0) / valid.length,
      pValue: Math.min(...valid.map((result) => result.pValue))
    };
  }

  function hotellingPaired(momentA, momentB) {
    const byIdA = new Map(momentA.filter((item) => item.id).map((item) => [item.id, item]));
    const paired = momentB
      .filter((item) => item.id && byIdA.has(item.id))
      .map((item) => {
        const baseline = byIdA.get(item.id);
        return { id: item.id, r_h: item.r_h - baseline.r_h, xc_h: item.xc_h - baseline.xc_h };
      });
    if (paired.length < 3) return { error: t('analysis.needPairs') };
    const meanDiff = meanVector(paired);
    const cov = covarianceMatrix(paired, meanDiff);
    const inverse = invert2(cov);
    if (!inverse) return { error: t('analysis.singular') };
    const d2 = quadratic(meanDiff, inverse);
    const t2 = paired.length * d2;
    const df1 = P;
    const df2 = paired.length - P;
    const fValue = (df2 / (P * (paired.length - 1))) * t2;
    return { mode: 'longitudinal', nPairs: paired.length, meanDiff, d2, t2, fValue, df1, df2, pValue: fSurvival(fValue, df1, df2) };
  }

  function classifyDistance(d2) {
    if (d2 <= CHI_SQUARE.tolerance50) return 'dentro da elipse 50%';
    if (d2 <= CHI_SQUARE.tolerance75) return 'dentro da elipse 75%';
    if (d2 <= CHI_SQUARE.tolerance95) return 'dentro da elipse 95%';
    return 'fora da elipse 95%';
  }

  function populateFilter(selectId, values, emptyLabel) {
    const select = document.getElementById(selectId);
    if (!select) return;
    const currentValue = select.value;
    select.innerHTML = `<option value="">${emptyLabel}</option>`;
    values
      .filter(Boolean)
      .sort((a, b) => {
        if (a === 'Unknown') return 1;
        if (b === 'Unknown') return -1;
        return String(a).localeCompare(String(b));
      })
      .forEach((value) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
      });
    if ([...select.options].some((option) => option.value === currentValue)) select.value = currentValue;
  }

  function populateEllipseFilters() {
    const confidence = [...allPopulations.filter((pop) => pop.source === 'confidence'), ...userEllipses];
    populateFilter('ellipseFilterCountry', [...new Set(confidence.map((pop) => pop.country))], t('filters.all'));
    populateFilter('ellipseFilterAge', [...new Set(confidence.map((pop) => pop.age_range))], t('filters.allFem'));
    populateFilter('ellipseFilterEquipment', [...new Set(confidence.map((pop) => pop.equipment))], t('filters.all'));
    populateFilter('ellipseFilterPopulation', [...new Set(confidence.map((pop) => pop.population_type))], t('filters.all'));
  }

  function loadReferencePopulations() {
    allPopulations = SOURCE_DATA.map(normalizePopulation)
      .filter(byMethod)
      .filter(shouldKeepReference);

    populateFilter('filterCountry', [...new Set(allPopulations.map((pop) => pop.country))], t('filters.all'));
    populateFilter('filterAge', [...new Set(allPopulations.map((pop) => pop.age_range))], t('filters.allFem'));
    populateEllipseFilters();
    applyFilters();
  }

  function applyFilters() {
    const select = document.getElementById('referenceGroup');
    if (!select) {
      filteredPopulations = allPopulations;
      renderEllipseSelectionList();
      if (bivaChart) updateEllipses();
      return;
    }
    const searchTerm = document.getElementById('searchPop').value.trim().toLowerCase();
    const sexFilter = document.getElementById('filterSex').value;
    const countryFilter = document.getElementById('filterCountry').value;
    const ageFilter = document.getElementById('filterAge').value;

    filteredPopulations = allPopulations.filter((pop) => {
      const searchable = `${pop.name} ${pop.legend} ${pop.country} ${pop.age_range}`.toLowerCase();
      const matchSearch = !searchTerm || searchable.includes(searchTerm);
      const matchSex = !sexFilter || pop.sex_code === sexFilter;
      const matchCountry = !countryFilter || pop.country === countryFilter;
      const matchAge = !ageFilter || pop.age_range === ageFilter;
      return matchSearch && matchSex && matchCountry && matchAge;
    });

    select.innerHTML = '';

    if (!filteredPopulations.length) {
      const option = document.createElement('option');
      option.value = '';
      option.textContent = t('filters.none');
      select.appendChild(option);
      document.getElementById('refStats').classList.add('hidden');
      renderEllipseSelectionList();
      if (bivaChart) updateEllipses();
      return;
    }

    filteredPopulations.forEach((pop, idx) => {
      const option = document.createElement('option');
      option.value = idx;
      option.textContent = pop.name;
      select.appendChild(option);
    });

    select.value = '0';
    renderEllipseSelectionList();
    updateReferencePopulation();
  }

  function updateReferencePopulation() {
    const pop = selectedPopulation();
    if (!pop) return;

    const refStats = document.getElementById('refStats');
    if (refStats) {
      document.getElementById('refRHMean').textContent = pop.r_h_mean.toFixed(2);
      document.getElementById('refRHSD').textContent = pop.r_h_sd.toFixed(2);
      document.getElementById('refXcHMean').textContent = pop.xc_h_mean.toFixed(2);
      document.getElementById('refXcHSD').textContent = pop.xc_h_sd.toFixed(2);
      refStats.classList.remove('hidden');
    }
    updateEllipses();
  }

  function makeLineDataset(id, label, color, fillColor) {
    return {
      id,
      label,
      data: [],
      borderColor: color,
      backgroundColor: fillColor,
      type: 'line',
      fill: true,
      pointRadius: 0,
      tension: 0,
      borderWidth: 2
    };
  }

  function measurementDataset() {
    return bivaChart.data.datasets.find((dataset) => dataset.id === 'measurements');
  }

  function confidenceEllipseComparisonEnabled() {
    return METHOD === 'confidence' || METHOD === 'combined';
  }

  function confidenceCandidates() {
    const base = METHOD === 'confidence' || METHOD === 'combined'
      ? [...allPopulations.filter((pop) => pop.source === 'confidence'), ...userEllipses]
      : allPopulations.filter((pop) => pop.source === 'confidence');
    const value = (id) => document.getElementById(id)?.value || '';
    const search = value('ellipseSearch').trim().toLowerCase();
    const sex = value('ellipseFilterSex');
    const country = value('ellipseFilterCountry');
    const age = value('ellipseFilterAge');
    const equipment = value('ellipseFilterEquipment');
    const populationType = value('ellipseFilterPopulation');
    return base.filter((pop) => {
      const searchable = `${pop.name} ${pop.legend} ${pop.country} ${pop.age_range} ${pop.equipment} ${pop.population_type}`.toLowerCase();
      return (!search || searchable.includes(search))
        && (!sex || pop.sex_code === sex)
        && (!country || pop.country === country)
        && (!age || pop.age_range === age)
        && (!equipment || pop.equipment === equipment)
        && (!populationType || pop.population_type === populationType);
    });
  }

  function selectedEllipsePopulations() {
    const byKey = new Map([...allPopulations, ...userEllipses].map((pop) => [pop.key, pop]));
    return [...selectedEllipseKeys].map((key) => byKey.get(key)).filter(Boolean);
  }

  function ellipseColor(index) {
    const colors = [
      '#0ea5e9',
      '#8b5cf6',
      '#f97316',
      '#14b8a6',
      '#ec4899',
      '#64748b',
      '#84cc16',
      '#f43f5e'
    ];
    return colors[index % colors.length];
  }

  function ellipseDash(value) {
    if (value === 'dash') return [8, 5];
    if (value === 'dot') return [2, 4];
    return [];
  }

  function ellipseStyle(pop, index = 0) {
    return {
      color: pop.style?.color || ellipseColor(index),
      dash: pop.style?.dash || 'dash',
      width: Number(pop.style?.width) || 2
    };
  }

  function specificGeometryFactor(armCm, waistCm, calfCm) {
    const areas = [armCm, waistCm, calfCm].map((cm) => {
      const meters = cm / 100;
      return (meters * meters) / (4 * Math.PI);
    });
    return areas.reduce((sum, area) => sum + area, 0) / areas.length;
  }

  function compareSelectedEllipses() {
    const selected = selectedEllipsePopulations();
    ellipseComparisonResults = [];
    for (let i = 0; i < selected.length; i += 1) {
      for (let j = i + 1; j < selected.length; j += 1) {
        ellipseComparisonResults.push(hotellingFromPopulations(selected[i], selected[j]));
      }
    }
    renderEllipseComparisonResults();
  }

  function renderEllipseSelectionList() {
    const panel = document.getElementById('ellipseSelectionPanel');
    const list = document.getElementById('ellipseSelectionList');
    if (!panel || !list || !confidenceEllipseComparisonEnabled()) return;

    const candidates = confidenceCandidates();
    if (!candidates.length) {
      list.innerHTML = `<div class="p-3 text-sm text-gray-500">${t('ellipseCompare.none')}</div>`;
      renderEllipseComparisonResults();
      return;
    }

    const selected = selectedEllipsePopulations();
    list.innerHTML = `${candidates.map((pop) => `
      <label class="flex gap-2 p-2 text-xs text-gray-700 hover:bg-white cursor-pointer">
        <input type="checkbox" value="${pop.key}" ${selectedEllipseKeys.has(pop.key) ? 'checked' : ''} onchange="toggleEllipseComparison(this.value, this.checked)" class="mt-0.5 rounded border-gray-300">
        <span class="flex-1">${escapeHtml(pop.name)}</span>
      </label>
    `).join('')}
    ${selected.length ? `
      <div class="bg-white p-3">
        <div class="mb-2 text-xs font-semibold text-gray-800">${t('ellipseCompare.styles')}</div>
        <div class="space-y-2">
          ${selected.map((pop, index) => {
            const style = ellipseStyle(pop, index);
            return `
              <div class="rounded border border-gray-200 p-2">
                <div class="mb-2 truncate text-xs font-medium text-gray-700">${escapeHtml(pop.name)}</div>
                <div class="grid grid-cols-3 gap-2">
                  <input type="color" value="${style.color}" onchange="updateEllipseStyle('${escapeHtml(pop.key)}', 'color', this.value)" class="h-9 w-full rounded border border-gray-300 p-1">
                  <select onchange="updateEllipseStyle('${escapeHtml(pop.key)}', 'dash', this.value)" class="rounded border border-gray-300 p-1 text-xs">
                    <option value="solid" ${style.dash === 'solid' ? 'selected' : ''}>${t('ellipseStyle.solid')}</option>
                    <option value="dash" ${style.dash === 'dash' ? 'selected' : ''}>${t('ellipseStyle.dash')}</option>
                    <option value="dot" ${style.dash === 'dot' ? 'selected' : ''}>${t('ellipseStyle.dot')}</option>
                  </select>
                  <input type="number" min="1" max="6" step="1" value="${style.width}" onchange="updateEllipseStyle('${escapeHtml(pop.key)}', 'width', this.value)" class="rounded border border-gray-300 p-1 text-xs">
                </div>
                ${pop.custom ? `<button type="button" onclick="removeCustomEllipse('${escapeHtml(pop.key)}')" class="mt-2 text-xs font-medium text-red-600 hover:text-red-700">${t('ellipseCompare.remove')}</button>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}`;
    renderEllipseComparisonResults();
  }

  function renderEllipseComparisonResults() {
    const target = document.getElementById('ellipseComparisonResults');
    if (!target || !confidenceEllipseComparisonEnabled()) return;
    const selected = selectedEllipsePopulations();
    target.classList.remove('hidden');
    if (selected.length < 2) {
      target.textContent = selected.length
        ? t('ellipseCompare.selected').replace('{n}', selected.length)
        : t('ellipseCompare.needTwo');
      updateFloatingStats();
      return;
    }

    const rows = ellipseComparisonResults.map((result) => {
      if (result.error) {
        return `<tr><td class="py-1 pr-2">${result.popA ? result.popA.code : '-'}</td><td class="py-1 pr-2">${result.popB ? result.popB.code : '-'}</td><td colspan="5" class="py-1 text-red-700">${result.error}</td></tr>`;
      }
      return `<tr>
        <td class="py-1 pr-2">${result.popA.code}</td>
        <td class="py-1 pr-2">${result.popB.code}</td>
        <td class="py-1 pr-2">${formatNumber(Math.sqrt(result.d2), 3)}</td>
        <td class="py-1 pr-2">${formatNumber(result.t2, 3)}</td>
        <td class="py-1 pr-2">${formatNumber(result.fValue, 3)}</td>
        <td class="py-1 pr-2">${formatNumber(result.pValue, 5)}</td>
      </tr>`;
    }).join('');

    target.innerHTML = `
      <div class="font-semibold mb-2">${t('ellipseCompare.pairwise')}</div>
      <div class="text-xs text-sky-800 mb-2">${t('ellipseCompare.selected').replace('{n}', selected.length)}</div>
      <div class="overflow-x-auto">
        <table class="min-w-full text-xs">
          <thead><tr>
            <th class="text-left py-1 pr-2">${t('ellipseCompare.ellipseA')}</th>
            <th class="text-left py-1 pr-2">${t('ellipseCompare.ellipseB')}</th>
            <th class="text-left py-1 pr-2">${t('analysis.mahalanobis')}</th>
            <th class="text-left py-1 pr-2">${t('analysis.hotelling')}</th>
            <th class="text-left py-1 pr-2">${t('analysis.f')}</th>
            <th class="text-left py-1 pr-2">${t('analysis.p')}</th>
          </tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    `;
    updateFloatingStats();
  }

  function ensureFloatingStats() {
    const chartArea = document.getElementById('bivaChart')?.parentElement;
    if (!chartArea || document.getElementById('floatingStats')) return;
    const panel = document.createElement('div');
    panel.id = 'floatingStats';
    panel.className = 'absolute top-3 right-3 z-20 max-w-xs rounded-lg border border-gray-200 bg-white/95 p-3 text-xs text-gray-800 shadow-lg hidden';
    chartArea.appendChild(panel);
  }

  function applyFloatingStatsPosition(panel) {
    if (!floatingStatsPosition) {
      panel.style.left = '';
      panel.style.top = '';
      panel.style.right = '';
      return;
    }
    panel.style.left = `${floatingStatsPosition.x}px`;
    panel.style.top = `${floatingStatsPosition.y}px`;
    panel.style.right = 'auto';
  }

  function moveFloatingStats(panel, x, y) {
    const parent = panel.parentElement;
    if (!parent) return;
    const maxX = Math.max(0, parent.clientWidth - panel.offsetWidth);
    const maxY = Math.max(0, parent.clientHeight - panel.offsetHeight);
    floatingStatsPosition = {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY)
    };
    applyFloatingStatsPosition(panel);
  }

  function bindFloatingStatsControls(panel, signature) {
    const closeButton = panel.querySelector('[data-floating-close]');
    const handle = panel.querySelector('[data-floating-handle]');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        floatingStatsClosedSignature = signature;
        panel.classList.add('hidden');
      });
    }
    if (!handle) return;
    const startDrag = (event) => {
      if (event.target?.closest?.('[data-floating-close]')) return;
      if (event.button !== undefined && event.button !== 0) return;
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const rect = panel.getBoundingClientRect();
      floatingStatsDrag = {
        offsetX: point.clientX - rect.left,
        offsetY: point.clientY - rect.top
      };
      document.addEventListener('mousemove', dragMove);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', dragMove, { passive: false });
      document.addEventListener('touchend', stopDrag);
      event.preventDefault();
    };
    const dragMove = (event) => {
      if (!floatingStatsDrag) return;
      const point = event.touches ? event.touches[0] : event;
      if (!point) return;
      const parentRect = panel.parentElement.getBoundingClientRect();
      moveFloatingStats(
        panel,
        point.clientX - parentRect.left - floatingStatsDrag.offsetX,
        point.clientY - parentRect.top - floatingStatsDrag.offsetY
      );
      if (event.cancelable) event.preventDefault();
    };
    const stopDrag = () => {
      floatingStatsDrag = null;
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', dragMove);
      document.removeEventListener('touchend', stopDrag);
    };
    handle.addEventListener('pointerdown', (event) => {
      startDrag(event);
      handle.setPointerCapture?.(event.pointerId);
    });
    handle.addEventListener('pointermove', dragMove);
    handle.addEventListener('pointerup', stopDrag);
    handle.addEventListener('pointercancel', stopDrag);
    handle.addEventListener('mousedown', startDrag);
    handle.addEventListener('touchstart', startDrag, { passive: false });
  }

  function updateFloatingStats() {
    const panel = document.getElementById('floatingStats');
    if (!panel) return;
    const rows = [];
    if (currentAnalysisResult && !currentAnalysisResult.error) {
      const label = currentAnalysisResult.mode === 'paired'
        ? t('analysis.pairedResult')
        : currentAnalysisResult.mode === 'longitudinal'
        ? t('analysis.resultLongitudinal')
        : t('analysis.resultCross');
      rows.push(`${label}: ${t('analysis.p')}=${formatNumber(currentAnalysisResult.pValue, 5)}`);
    }
    ellipseComparisonResults
      .filter((result) => !result.error)
      .forEach((result) => {
        rows.push(`${result.popA.code} vs ${result.popB.code}: ${t('analysis.p')}=${formatNumber(result.pValue, 5)}`);
      });

    if (!rows.length) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }

    const signature = rows.join('|');
    if (floatingStatsClosedSignature === signature) {
      panel.classList.add('hidden');
      return;
    }

    panel.classList.remove('hidden');
    panel.innerHTML = `
      <div data-floating-handle class="mb-2 flex cursor-move select-none items-center justify-between gap-3 font-semibold text-gray-900 touch-none">
        <span>${t('floating.title')}</span>
        <button type="button" data-floating-close title="${t('floating.close')}" class="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="${t('floating.close')}">&times;</button>
      </div>
      <div class="space-y-1">${rows.map((row) => `<div>${escapeHtml(row)}</div>`).join('')}</div>
    `;
    applyFloatingStatsPosition(panel);
    bindFloatingStatsControls(panel, signature);
  }

  function toggleEllipseComparison(key, checked) {
    if (checked) selectedEllipseKeys.add(key);
    else selectedEllipseKeys.delete(key);
    compareSelectedEllipses();
    updateEllipses();
    updateStats();
    updateFloatingStats();
  }

  function clearEllipseComparison() {
    selectedEllipseKeys = new Set();
    ellipseComparisonResults = [];
    renderEllipseSelectionList();
    updateEllipses();
    updateStats();
    updateFloatingStats();
  }

  function selectCurrentEllipseForComparison() {
    const pop = selectedPopulation();
    if (!pop || pop.source !== 'confidence') {
      window.alert(t('ellipseCompare.currentNotConfidence'));
      return;
    }
    selectedEllipseKeys.add(pop.key);
    renderEllipseSelectionList();
    compareSelectedEllipses();
    updateEllipses();
    updateStats();
  }

  function findEllipseByKey(key) {
    return [...allPopulations, ...userEllipses].find((pop) => pop.key === key);
  }

  function updateEllipseStyle(key, prop, value) {
    const pop = findEllipseByKey(key);
    if (!pop) return;
    pop.style = pop.style || {};
    if (prop === 'width') pop.style.width = Math.max(1, Math.min(6, Number(value) || 2));
    else pop.style[prop] = value;
    renderEllipseSelectionList();
    updateEllipses();
  }

  function removeCustomEllipse(key) {
    userEllipses = userEllipses.filter((pop) => pop.key !== key);
    selectedEllipseKeys.delete(key);
    compareSelectedEllipses();
    populateEllipseFilters();
    renderEllipseSelectionList();
    updateEllipses();
    updateStats();
  }

  function updateConfidenceInputMode() {
    const isSpecific = document.getElementById('ellipseType')?.value === 'specific';
    const fields = document.getElementById('specificFields');
    if (fields) fields.classList.toggle('hidden', !isSpecific);
    ['ellipseArm', 'ellipseWaist', 'ellipseCalf'].forEach((id) => {
      const input = document.getElementById(id);
      if (input) input.required = isSpecific;
    });
    const axisLabels = isSpecific
      ? { xShort: t('chart.specificXShort'), yShort: t('chart.specificYShort') }
      : { xShort: t('chart.xShort'), yShort: t('chart.yShort') };
    const fieldLabels = [
      ['ellipseMeanXLabel', `${axisLabels.xShort} média`],
      ['ellipseSdXLabel', `${axisLabels.xShort} DP`],
      ['ellipseMeanYLabel', `${axisLabels.yShort} média`],
      ['ellipseSdYLabel', `${axisLabels.yShort} DP`]
    ];
    fieldLabels.forEach(([id, text]) => {
      const label = document.getElementById(id);
      if (label) label.textContent = text;
    });
    if (bivaChart) updateDatasetLabels();
    renderChartOptionsPanel();
  }

  function parseLocaleNumber(value) {
    if (typeof value === 'number') return value;
    const text = String(value ?? '').trim();
    if (!text) return NaN;
    const normalized = text.replace(/\./g, '').replace(',', '.');
    const direct = Number.parseFloat(text);
    const localized = Number.parseFloat(normalized);
    return Number.isFinite(direct) && !/,/.test(text) ? direct : localized;
  }

  function sanitizeKey(value) {
    return String(value ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_|_$/g, '');
  }

  function readRowValue(row, aliases) {
    const normalized = Object.fromEntries(Object.entries(row).map(([key, value]) => [sanitizeKey(key), value]));
    for (const alias of aliases) {
      const key = sanitizeKey(alias);
      if (Object.prototype.hasOwnProperty.call(normalized, key)) return normalized[key];
    }
    return '';
  }

  function validEllipseRaw(raw, type) {
    const baseValid = [raw.r_h_mean, raw.r_h_sd, raw.xc_h_mean, raw.xc_h_sd, raw.correlation, raw.n].every(Number.isFinite)
      && raw.r_h_sd > 0
      && raw.xc_h_sd > 0
      && raw.n > P
      && Math.abs(raw.correlation) < 1;
    if (!baseValid) return false;
    if (type !== 'specific') return true;
    return [raw.arm, raw.waist, raw.calf].every((value) => Number.isFinite(value) && value > 0);
  }

  function makeCustomEllipse(raw, type = 'classic', style = {}) {
    let geometryFactor = 1;
    if (type === 'specific') geometryFactor = specificGeometryFactor(raw.arm, raw.waist, raw.calf);
    const key = `custom:${Date.now()}:${customEllipseCounter}`;
    const pop = normalizePopulation({
      code: `C${customEllipseCounter}`,
      n: raw.n,
      r_h_mean: raw.r_h_mean * geometryFactor,
      r_h_sd: raw.r_h_sd * geometryFactor,
      xc_h_mean: raw.xc_h_mean * geometryFactor,
      xc_h_sd: raw.xc_h_sd * geometryFactor,
      correlation: raw.correlation,
      sex: raw.sex || 'U',
      legend: `${raw.name} (${type})`,
      source: 'confidence',
      country: raw.country || 'Custom',
      age_range: raw.age_range || (type === 'specific' ? 'Specific' : 'Classic'),
      equipment: raw.equipment || 'Custom',
      population_type: raw.population_type || 'Custom'
    }, SOURCE_DATA.length + customEllipseCounter);
    pop.key = key;
    pop.custom = true;
    pop.type = type;
    pop.moment = raw.moment || 'T1';
    pop.pairId = raw.pairId || raw.name;
    pop.raw = { ...raw, geometryFactor };
    pop.style = {
      color: style.color || raw.color || ellipseColor(customEllipseCounter - 1),
      dash: style.dash || raw.dash || 'solid',
      width: Number.parseInt(style.width || raw.width, 10) || 2
    };
    customEllipseCounter += 1;
    return pop;
  }

  function addConfidenceEllipse(event) {
    event.preventDefault();
    const type = document.getElementById('ellipseType').value;
    const raw = {
      name: document.getElementById('ellipseName').value.trim() || `Elipse ${customEllipseCounter}`,
      moment: document.getElementById('ellipseMoment').value.trim() || 'T1',
      pairId: document.getElementById('ellipsePairId').value.trim(),
      r_h_mean: Number.parseFloat(document.getElementById('ellipseRHMean').value),
      r_h_sd: Number.parseFloat(document.getElementById('ellipseRHSD').value),
      xc_h_mean: Number.parseFloat(document.getElementById('ellipseXcHMean').value),
      xc_h_sd: Number.parseFloat(document.getElementById('ellipseXcHSD').value),
      correlation: Number.parseFloat(document.getElementById('ellipseCorrelation').value),
      n: Number.parseInt(document.getElementById('ellipseN').value, 10),
      arm: Number.parseFloat(document.getElementById('ellipseArm')?.value),
      waist: Number.parseFloat(document.getElementById('ellipseWaist')?.value),
      calf: Number.parseFloat(document.getElementById('ellipseCalf')?.value)
    };
    if (![raw.r_h_mean, raw.r_h_sd, raw.xc_h_mean, raw.xc_h_sd, raw.correlation, raw.n].every(Number.isFinite)
      || raw.r_h_sd <= 0 || raw.xc_h_sd <= 0 || raw.n <= P || Math.abs(raw.correlation) >= 1) {
      window.alert(t('ellipseInput.invalid'));
      return;
    }
    if (type === 'specific' && !validEllipseRaw(raw, type)) {
      window.alert(t('ellipseInput.invalidSpecific'));
      return;
    }

    const pop = makeCustomEllipse(raw, type, {
      color: document.getElementById('ellipseColor').value,
      dash: document.getElementById('ellipseDash').value,
      width: Number.parseInt(document.getElementById('ellipseWidth').value, 10) || 2
    });
    userEllipses.push(pop);
    selectedEllipseKeys.add(pop.key);
    document.getElementById('measurementForm').reset();
    document.getElementById('ellipseName').value = `Elipse ${customEllipseCounter}`;
    document.getElementById('ellipseMoment').value = raw.moment;
    document.getElementById('ellipseType').value = type;
    document.getElementById('ellipseColor').value = ellipseColor(customEllipseCounter - 1);
    updateConfidenceInputMode();
    populateEllipseFilters();
    compareSelectedEllipses();
    renderEllipseSelectionList();
    updateEllipses();
    updateStats();
    refreshAnalysisControls();
  }

  function updateDatasetLabels() {
    if (!bivaChart) return;
    const toleranceLabel = METHOD_LABELS.tolerance[currentLanguage] || METHOD_LABELS.tolerance['pt-BR'];
    const confidenceLabel = METHOD_LABELS.confidence[currentLanguage] || METHOD_LABELS.confidence['pt-BR'];
    const labels = {
      tolerance95: `95% ${toleranceLabel}`,
      tolerance75: `75% ${toleranceLabel}`,
      tolerance50: `50% ${toleranceLabel}`,
      confidence95: `95% ${confidenceLabel}`,
      measurements: t('chart.measurements')
    };
    bivaChart.data.datasets.forEach((dataset) => {
      if (labels[dataset.id]) dataset.label = labels[dataset.id];
    });
    if (bivaChart.options?.scales) {
      const axisLabels = axisLabelSet();
      bivaChart.options.scales.x.title.text = axisLabels.x;
      bivaChart.options.scales.y.title.text = axisLabels.y;
      if (METHOD === 'tolerance' && tolerancePlotMode === 'zscore') {
        bivaChart.options.scales.x.min = -4;
        bivaChart.options.scales.x.max = 4;
        bivaChart.options.scales.y.min = -4;
        bivaChart.options.scales.y.max = 4;
      } else if (METHOD === 'tolerance') {
        bivaChart.options.scales.x.min = 0;
        bivaChart.options.scales.y.min = 0;
        delete bivaChart.options.scales.x.max;
        delete bivaChart.options.scales.y.max;
      } else {
        delete bivaChart.options.scales.x.min;
        delete bivaChart.options.scales.x.max;
        delete bivaChart.options.scales.y.min;
        delete bivaChart.options.scales.y.max;
      }
      if (axisSettings) {
        ['x', 'y'].forEach((axis) => {
          const min = axisSettings[`${axis}Min`];
          const max = axisSettings[`${axis}Max`];
          if (min !== null && min !== undefined) bivaChart.options.scales[axis].min = min;
          if (max !== null && max !== undefined) bivaChart.options.scales[axis].max = max;
        });
      }
    }
  }

  function createCanvasChart(canvas, datasets) {
    const ctx = canvas.getContext('2d');
    const chart = {
      canvas,
      data: { datasets },
      update: draw
    };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(720, Math.round(rect.width || canvas.parentElement.clientWidth || 720));
      const height = Math.max(420, Math.round(rect.height || canvas.parentElement.clientHeight || 420));
      const ratio = window.devicePixelRatio || 1;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      return { width, height };
    }

    function collectBounds() {
      if (axisSettings) {
        const fallback = METHOD === 'tolerance' && tolerancePlotMode === 'zscore'
          ? { minX: -4, maxX: 4, minY: -4, maxY: 4 }
          : null;
        if (fallback) {
          return {
            minX: axisSettings.xMin ?? fallback.minX,
            maxX: axisSettings.xMax ?? fallback.maxX,
            minY: axisSettings.yMin ?? fallback.minY,
            maxY: axisSettings.yMax ?? fallback.maxY
          };
        }
      }
      if (METHOD === 'tolerance' && tolerancePlotMode === 'zscore') {
        return { minX: -4, maxX: 4, minY: -4, maxY: 4 };
      }
      const xs = [];
      const ys = [];
      datasets.forEach((dataset) => {
        dataset.data.forEach((point) => {
          if (Number.isFinite(point.x) && Number.isFinite(point.y)) {
            xs.push(point.x);
            ys.push(point.y);
          }
        });
      });
      if (!xs.length) return { minX: 0, maxX: 800, minY: 0, maxY: 120 };
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const padX = Math.max(20, (maxX - minX) * 0.12);
      const padY = Math.max(5, (maxY - minY) * 0.16);
      if (METHOD === 'tolerance') {
        return {
          minX: axisSettings?.xMin ?? 0,
          maxX: axisSettings?.xMax ?? Math.max(700, Math.ceil((maxX + padX) / 100) * 100),
          minY: axisSettings?.yMin ?? 0,
          maxY: axisSettings?.yMax ?? Math.max(70, Math.ceil((maxY + padY) / 10) * 10)
        };
      }
      return {
        minX: axisSettings?.xMin ?? minX - padX,
        maxX: axisSettings?.xMax ?? maxX + padX,
        minY: axisSettings?.yMin ?? minY - padY,
        maxY: axisSettings?.yMax ?? maxY + padY
      };
    }

    function draw() {
      const { width, height } = resize();
      const pad = { left: 70, right: 24, top: 24, bottom: 84 };
      const plotW = width - pad.left - pad.right;
      const plotH = height - pad.top - pad.bottom;
      const bounds = collectBounds();
      const xScale = plotW / Math.max(1, bounds.maxX - bounds.minX);
      const yScale = plotH / Math.max(1, bounds.maxY - bounds.minY);
      const xFor = (x) => pad.left + (x - bounds.minX) * xScale;
      const yFor = (y) => pad.top + plotH - (y - bounds.minY) * yScale;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);

      ctx.strokeStyle = 'rgba(17, 24, 39, 0.12)';
      ctx.fillStyle = '#4b5563';
      ctx.lineWidth = 1;
      ctx.font = '12px Segoe UI, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let i = 0; i <= 5; i += 1) {
        const gx = pad.left + (plotW * i) / 5;
        const xValue = bounds.minX + ((bounds.maxX - bounds.minX) * i) / 5;
        ctx.beginPath();
        ctx.moveTo(gx, pad.top);
        ctx.lineTo(gx, pad.top + plotH);
        ctx.stroke();
        ctx.fillText(xValue.toFixed(0), gx, pad.top + plotH + 8);

        const gy = pad.top + (plotH * i) / 5;
        const yValue = bounds.maxY - ((bounds.maxY - bounds.minY) * i) / 5;
        ctx.beginPath();
        ctx.moveTo(pad.left, gy);
        ctx.lineTo(pad.left + plotW, gy);
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(yValue.toFixed(0), pad.left - 8, gy);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
      }

      ctx.strokeStyle = '#111827';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(pad.left, pad.top, plotW, plotH);

      datasets.filter((dataset) => dataset.id !== 'measurements').forEach((dataset) => {
        if (!dataset.data.length) return;
        ctx.beginPath();
        dataset.data.forEach((point, index) => {
          const x = xFor(point.x);
          const y = yFor(point.y);
          if (index === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = dataset.backgroundColor || 'rgba(0,0,0,0.04)';
        ctx.strokeStyle = dataset.borderColor || '#111827';
        ctx.lineWidth = dataset.borderWidth || 2;
        ctx.setLineDash(dataset.borderDash || []);
        if (dataset.fill) ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      });

      const points = measurementDataset().data;
      points.forEach((point, index) => {
        const item = measurements[index];
        const style = getGroupStyle(item ? item.group : point.group);
        drawCanvasSymbol(ctx, xFor(point.x), yFor(point.y), style);
      });

      ctx.fillStyle = '#111827';
      ctx.font = '600 12px Segoe UI, Arial, sans-serif';
      const axisLabels = axisLabelSet();
      ctx.fillText(axisLabels.x, pad.left + plotW / 2, height - 26);

      ctx.save();
      ctx.translate(18, pad.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(axisLabels.y, 0, 0);
      ctx.restore();

      let legendX = pad.left;
      const legendY = height - 58;
      datasets.forEach((dataset) => {
        if (dataset.id !== 'measurements' && !dataset.data.length) return;
        if (dataset.id === 'measurements' && !dataset.data.length) return;
        ctx.fillStyle = dataset.borderColor || dataset.backgroundColor || '#111827';
        ctx.fillRect(legendX, legendY, 18, 3);
        ctx.fillStyle = '#374151';
        ctx.font = '12px Segoe UI, Arial, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(dataset.label, legendX + 24, legendY + 2);
        legendX += Math.min(180, dataset.label.length * 7 + 42);
      });
    }

    window.addEventListener('resize', draw);
    return chart;
  }

  function updateEllipses() {
    if (!bivaChart) return;
    updateDatasetLabels();
    const pop = selectedPopulation();

    for (let i = bivaChart.data.datasets.length - 1; i >= 0; i -= 1) {
      if (bivaChart.data.datasets[i].compareEllipse || bivaChart.data.datasets[i].phaseLine) bivaChart.data.datasets.splice(i, 1);
    }

    bivaChart.data.datasets
      .filter((dataset) => dataset.id !== 'measurements' && !dataset.compareEllipse && !dataset.phaseLine)
      .forEach((dataset) => {
        dataset.data = [];
      });

    const byId = Object.fromEntries(bivaChart.data.datasets.map((dataset) => [dataset.id, dataset]));

    if (pop && byId.tolerance95) {
      const centerX = METHOD === 'tolerance' && tolerancePlotMode === 'zscore' ? 0 : pop.r_h_mean;
      const centerY = METHOD === 'tolerance' && tolerancePlotMode === 'zscore' ? 0 : pop.xc_h_mean;
      const sdX = METHOD === 'tolerance' && tolerancePlotMode === 'zscore' ? 1 : pop.r_h_sd;
      const sdY = METHOD === 'tolerance' && tolerancePlotMode === 'zscore' ? 1 : pop.xc_h_sd;
      byId.tolerance95.data = generateEllipse(centerX, centerY, sdX, sdY, pop.correlation, CHI_SQUARE.tolerance95);
      byId.tolerance75.data = generateEllipse(centerX, centerY, sdX, sdY, pop.correlation, CHI_SQUARE.tolerance75);
      byId.tolerance50.data = generateEllipse(centerX, centerY, sdX, sdY, pop.correlation, CHI_SQUARE.tolerance50);
    }

    if (pop && byId.confidence95) {
      byId.confidence95.data = generateEllipse(
        pop.r_h_mean,
        pop.xc_h_mean,
        pop.r_h_sd / Math.sqrt(pop.n),
        pop.xc_h_sd / Math.sqrt(pop.n),
        pop.correlation,
        CHI_SQUARE.confidence95
      );
    }

    selectedEllipsePopulations().forEach((selectedPop, index) => {
      const style = ellipseStyle(selectedPop, index);
      const dataset = makeLineDataset(
        `compare-${selectedPop.key}`,
        `${selectedPop.code} - ${selectedPop.legend}`,
        style.color,
        `${style.color}14`
      );
      dataset.compareEllipse = true;
      dataset.borderWidth = style.width;
      dataset.borderDash = ellipseDash(style.dash);
      dataset.fill = false;
      dataset.data = generateEllipse(
        selectedPop.r_h_mean,
        selectedPop.xc_h_mean,
        selectedPop.r_h_sd / Math.sqrt(selectedPop.n),
        selectedPop.xc_h_sd / Math.sqrt(selectedPop.n),
        selectedPop.correlation,
        CHI_SQUARE.confidence95
      );
      const measurementIndex = bivaChart.data.datasets.findIndex((existing) => existing.id === 'measurements');
      bivaChart.data.datasets.splice(Math.max(0, measurementIndex), 0, dataset);
    });

    updatePhaseLines(pop);
    syncMeasurementStyles();
    bivaChart.update();
  }

  function initChart() {
    const canvas = document.getElementById('bivaChart');
    if (!canvas) {
      return;
    }

    const datasets = [];
    if (METHOD === 'tolerance' || METHOD === 'combined') {
      datasets.push(
        makeLineDataset('tolerance95', `95% ${METHOD_LABELS.tolerance[currentLanguage] || METHOD_LABELS.tolerance['pt-BR']}`, 'rgba(239, 68, 68, 0.85)', 'rgba(239, 68, 68, 0.04)'),
        makeLineDataset('tolerance75', `75% ${METHOD_LABELS.tolerance[currentLanguage] || METHOD_LABELS.tolerance['pt-BR']}`, 'rgba(245, 158, 11, 0.9)', 'rgba(245, 158, 11, 0.08)'),
        makeLineDataset('tolerance50', `50% ${METHOD_LABELS.tolerance[currentLanguage] || METHOD_LABELS.tolerance['pt-BR']}`, 'rgba(34, 197, 94, 0.9)', 'rgba(34, 197, 94, 0.12)')
      );
    }
    if (METHOD === 'combined') {
      datasets.push(makeLineDataset('confidence95', `95% ${METHOD_LABELS.confidence[currentLanguage] || METHOD_LABELS.confidence['pt-BR']}`, 'rgba(37, 99, 235, 0.9)', 'rgba(37, 99, 235, 0.10)'));
    }
    datasets.push({
      id: 'measurements',
      label: t('chart.measurements'),
      data: [],
      backgroundColor: '#111827',
      borderColor: '#111827',
      pointRadius: 6,
      pointHoverRadius: 8,
      hidden: METHOD === 'confidence'
    });

    if (!window.Chart) {
      bivaChart = createCanvasChart(canvas, datasets);
      updateEllipses();
      return;
    }

    bivaChart = new Chart(canvas.getContext('2d'), {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label(context) {
                if (context.dataset.id !== 'measurements') return null;
                const item = measurements[context.dataIndex];
                if (!item) return null;
                const pop = selectedPopulation();
                const d2 = pop ? covarianceDistance(pop, item) : null;
                const suffix = d2 === null ? '' : ` | D2=${d2.toFixed(2)} (${classifyDistance(d2)})`;
                return `${item.id}: R/H=${item.r_h.toFixed(1)}, Xc/H=${item.xc_h.toFixed(1)}${suffix}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: { display: true, text: axisLabelSet().x, font: { weight: 'bold' } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          },
          y: {
            title: { display: true, text: axisLabelSet().y, font: { weight: 'bold' } },
            grid: { color: 'rgba(0,0,0,0.05)' }
          }
        }
      }
    });

    updateEllipses();
  }

  function updateStats() {
    if (METHOD === 'confidence') {
      const count = selectedEllipseKeys.size;
      document.getElementById('graphDesc').textContent = count === 1 ? '1 elipse' : `${count} elipses`;
      document.getElementById('statsPanel').classList.add('hidden');
      document.getElementById('exportButtons').style.display = count ? 'flex' : 'none';
      document.getElementById('clearBtn').style.display = userEllipses.length || count ? 'block' : 'none';
      return;
    }
    const count = measurements.length;
    document.getElementById('sampleCount').textContent = count;
    document.getElementById('graphDesc').textContent = count === 1 ? t('chart.countSingular') : t('chart.countPlural').replace('{n}', count);

    if (!count) {
      document.getElementById('statsPanel').classList.add('hidden');
      document.getElementById('exportButtons').style.display = 'none';
      document.getElementById('clearBtn').style.display = 'none';
      return;
    }

    const meanRH = measurements.reduce((sum, item) => sum + item.r_h, 0) / count;
    const meanXcH = measurements.reduce((sum, item) => sum + item.xc_h, 0) / count;
    document.getElementById('meanRH').textContent = meanRH.toFixed(2);
    document.getElementById('meanXcH').textContent = meanXcH.toFixed(2);
    document.getElementById('statsPanel').classList.remove('hidden');
    document.getElementById('exportButtons').style.display = 'flex';
    document.getElementById('clearBtn').style.display = 'block';
  }

  function getGroupStyle(group) {
    return groupStyles.get(group) || { color: '#111827', symbol: 'circle' };
  }

  function chartPointStyle(symbol) {
    return {
      circle: 'circle',
      square: 'rect',
      triangle: 'triangle',
      diamond: 'rectRot',
      cross: 'cross'
    }[symbol] || 'circle';
  }

  function syncMeasurementStyles() {
    if (!bivaChart) return;
    const dataset = measurementDataset();
    if (!dataset) return;
    dataset.data = measurements.map((item) => displayPoint(item));
    dataset.backgroundColor = measurements.map((item) => getGroupStyle(item.group).color);
    dataset.borderColor = measurements.map((item) => getGroupStyle(item.group).color);
    dataset.pointStyle = measurements.map((item) => chartPointStyle(getGroupStyle(item.group).symbol));
    bivaChart.update();
  }

  function drawCanvasSymbol(ctx, x, y, style, size = 6) {
    ctx.fillStyle = style.color;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (style.symbol === 'square') {
      ctx.rect(x - size, y - size, size * 2, size * 2);
    } else if (style.symbol === 'triangle') {
      ctx.moveTo(x, y - size - 1);
      ctx.lineTo(x + size + 1, y + size);
      ctx.lineTo(x - size - 1, y + size);
      ctx.closePath();
    } else if (style.symbol === 'diamond') {
      ctx.moveTo(x, y - size - 2);
      ctx.lineTo(x + size + 2, y);
      ctx.lineTo(x, y + size + 2);
      ctx.lineTo(x - size - 2, y);
      ctx.closePath();
    } else if (style.symbol === 'cross') {
      ctx.moveTo(x - size, y);
      ctx.lineTo(x + size, y);
      ctx.moveTo(x, y - size);
      ctx.lineTo(x, y + size);
      ctx.strokeStyle = style.color;
      ctx.lineWidth = 3;
      ctx.stroke();
      return;
    } else {
      ctx.arc(x, y, size, 0, 2 * Math.PI);
    }
    ctx.fill();
    ctx.stroke();
  }

  function renderRelatedStylePanel() {
    if (METHOD !== 'tolerance') return;
    let panel = document.getElementById('relatedStylePanel');
    if (!panel) {
      const aside = document.querySelector('aside');
      const clearBtn = document.getElementById('clearBtn');
      panel = document.createElement('div');
      panel.id = 'relatedStylePanel';
      panel.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100';
      aside.insertBefore(panel, clearBtn);
    }
    const groups = uniqueSorted(measurements.map((item) => item.group));
    const options = groups.length
      ? groups.map((group) => `<option value="${escapeHtml(group)}">${escapeHtml(group)}</option>`).join('')
      : `<option value="">${t('style.none')}</option>`;
    panel.innerHTML = `
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <i data-lucide="palette" class="w-5 h-5 text-rose-500"></i>
        <span>${t('style.title')}</span>
      </h2>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">${t('style.group')}</label>
          <select id="relatedGroupSelect" onchange="loadRelatedStyleControls()" class="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2">${options}</select>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">${t('style.color')}</label>
            <input id="relatedColor" type="color" value="#111827" class="h-10 w-full rounded-md border border-gray-300 bg-white p-1">
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">${t('style.symbol')}</label>
            <select id="relatedSymbol" class="w-full bg-gray-50 border border-gray-300 text-sm rounded-lg p-2">
              <option value="circle">${t('style.circle')}</option>
              <option value="square">${t('style.square')}</option>
              <option value="triangle">${t('style.triangle')}</option>
              <option value="diamond">${t('style.diamond')}</option>
              <option value="cross">${t('style.cross')}</option>
            </select>
          </div>
        </div>
        <button type="button" onclick="applyRelatedStyle()" class="w-full py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-md transition">${t('style.apply')}</button>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    loadRelatedStyleControls();
  }

  function renderChartOptionsPanel() {
    const aside = document.querySelector('aside');
    const clearBtn = document.getElementById('clearBtn');
    if (!aside || !clearBtn) return;
    let panel = document.getElementById('chartOptionsPanel');
    if (!panel) {
      panel = document.createElement('div');
      panel.id = 'chartOptionsPanel';
      panel.className = 'bg-white p-5 rounded-xl shadow-sm border border-gray-100';
      aside.insertBefore(panel, clearBtn);
    }
    const axisLabels = axisLabelSet();
    const axisText = (key, label) => t(key).replace('{axis}', label);
    panel.innerHTML = `
      <h2 class="text-lg font-semibold mb-4 flex items-center gap-2">
        <i data-lucide="settings-2" class="w-5 h-5 text-cyan-500"></i>
        <span>${t('axis.title')}</span>
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <label class="text-xs font-medium text-gray-700">${axisText('axis.xMin', axisLabels.xShort)}<input id="axisXMin" type="number" step="any" value="${axisSettings?.xMin ?? ''}" class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"></label>
        <label class="text-xs font-medium text-gray-700">${axisText('axis.xMax', axisLabels.xShort)}<input id="axisXMax" type="number" step="any" value="${axisSettings?.xMax ?? ''}" class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"></label>
        <label class="text-xs font-medium text-gray-700">${axisText('axis.yMin', axisLabels.yShort)}<input id="axisYMin" type="number" step="any" value="${axisSettings?.yMin ?? ''}" class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"></label>
        <label class="text-xs font-medium text-gray-700">${axisText('axis.yMax', axisLabels.yShort)}<input id="axisYMax" type="number" step="any" value="${axisSettings?.yMax ?? ''}" class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"></label>
      </div>
      <div class="mt-3 flex gap-2">
        <button type="button" onclick="applyAxisSettings()" class="flex-1 rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium text-white hover:bg-cyan-700">${t('axis.apply')}</button>
        <button type="button" onclick="clearAxisSettings()" class="rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">${t('axis.auto')}</button>
      </div>
      <label class="mt-3 flex items-start gap-2 text-xs text-gray-700">
        <input type="checkbox" ${showPhaseLine ? 'checked' : ''} onchange="togglePhaseLine(this.checked)" class="mt-0.5 rounded border-gray-300">
        <span>${t('axis.phaseLine')}</span>
      </label>
      <div id="phaseInfoPanel" class="mt-3 hidden rounded-lg border border-cyan-200 bg-cyan-50 p-2 text-xs text-cyan-950"></div>
      ${METHOD !== 'combined' ? `<button type="button" onclick="openCombinedWithCurrentData()" class="mt-3 w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700">${t('mixed.open')}</button>` : ''}
    `;
    if (window.lucide) window.lucide.createIcons();
    renderPhaseInfo();
  }

  function loadRelatedStyleControls() {
    const group = document.getElementById('relatedGroupSelect')?.value;
    if (!group) return;
    const style = getGroupStyle(group);
    document.getElementById('relatedColor').value = style.color;
    document.getElementById('relatedSymbol').value = style.symbol;
  }

  function applyRelatedStyle() {
    const group = document.getElementById('relatedGroupSelect')?.value;
    if (!group) return;
    groupStyles.set(group, {
      color: document.getElementById('relatedColor').value,
      symbol: document.getElementById('relatedSymbol').value
    });
    syncMeasurementStyles();
  }

  function setTolerancePlotMode(mode) {
    tolerancePlotMode = mode === 'zscore' ? 'zscore' : 'classic';
    localStorage.setItem('aibivaToleranceMode', tolerancePlotMode);
    updateDatasetLabels();
    syncMeasurementStyles();
    updateEllipses();
  }

  function phaseAngle(pop) {
    return Math.atan2(pop.xc_h_mean, pop.r_h_mean) * 180 / Math.PI;
  }

  function displayCenter(pop) {
    if (METHOD === 'tolerance' && tolerancePlotMode === 'zscore') return { x: 0, y: 0 };
    return { x: pop.r_h_mean, y: pop.xc_h_mean };
  }

  function phaseTargets(pop) {
    const targets = [];
    if (pop && (METHOD === 'tolerance' || METHOD === 'combined')) targets.push(pop);
    selectedEllipsePopulations().forEach((item) => targets.push(item));
    return targets;
  }

  function updatePhaseLines(pop = selectedPopulation()) {
    bivaChart.data.datasets = bivaChart.data.datasets.filter((dataset) => !dataset.phaseLine);
    if (!showPhaseLine) {
      renderPhaseInfo();
      return;
    }
    const targets = phaseTargets(pop);
    targets.forEach((target, index) => {
      const center = displayCenter(target);
      const color = target.style?.color || (target.source === 'confidence' ? ellipseColor(index) : '#111827');
      bivaChart.data.datasets.unshift({
        id: `phase-${target.key || index}`,
        phaseLine: true,
        label: `${target.code || index + 1} ${t('axis.phase')} ${formatNumber(phaseAngle(target), 2)}°`,
        type: 'line',
        data: [{ x: 0, y: 0 }, center],
        borderColor: color,
        backgroundColor: color,
        borderWidth: 1.5,
        borderDash: [4, 4],
        fill: false,
        pointRadius: 0,
        tension: 0
      });
    });
    renderPhaseInfo(targets);
  }

  function renderPhaseInfo(targets = phaseTargets()) {
    const panel = document.getElementById('phaseInfoPanel');
    if (!panel) return;
    const rows = showPhaseLine
      ? targets.map((target) => `${target.code || target.name}: ${formatNumber(phaseAngle(target), 2)}°`)
      : [];
    if (!rows.length) {
      panel.classList.add('hidden');
      panel.innerHTML = '';
      return;
    }
    panel.classList.remove('hidden');
    panel.innerHTML = `<div class="font-semibold">${t('axis.phase')}</div>${rows.map((row) => `<div>${escapeHtml(row)}</div>`).join('')}`;
  }

  function serializeCurrentState() {
    return {
      sourceMethod: METHOD,
      measurements,
      userEllipses,
      selectedEllipseKeys: [...selectedEllipseKeys],
      groupStyles: [...groupStyles.entries()],
      tolerancePlotMode,
      axisSettings,
      showPhaseLine,
      language: currentLanguage
    };
  }

  function restoreTransferredState() {
    if (METHOD !== 'combined') return;
    let state = null;
    try { state = JSON.parse(localStorage.getItem('aibivaTransferToCombined') || 'null'); }
    catch (_) { state = null; }
    if (!state) return;
    measurements = Array.isArray(state.measurements) ? state.measurements : [];
    userEllipses = Array.isArray(state.userEllipses) ? state.userEllipses : [];
    selectedEllipseKeys = new Set(Array.isArray(state.selectedEllipseKeys) ? state.selectedEllipseKeys : []);
    groupStyles = new Map(Array.isArray(state.groupStyles) ? state.groupStyles : []);
    tolerancePlotMode = state.tolerancePlotMode || tolerancePlotMode;
    axisSettings = state.axisSettings || axisSettings;
    showPhaseLine = state.showPhaseLine !== false;
    if (state.language) currentLanguage = state.language;
    customEllipseCounter = Math.max(customEllipseCounter, userEllipses.length + 1);
    localStorage.removeItem('aibivaTransferToCombined');
  }

  function openCombinedWithCurrentData() {
    localStorage.setItem('aibivaTransferToCombined', JSON.stringify(serializeCurrentState()));
    localStorage.setItem('selectedLanguage', currentLanguage);
    window.location.href = 'aiBIVA-combined.html';
  }

  function uniqueSorted(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
  }

  function fillSelect(select, values) {
    select.innerHTML = '';
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    });
  }

  function fillSelectOptions(select, options) {
    select.innerHTML = '';
    options.forEach((item) => {
      const option = document.createElement('option');
      option.value = item.value;
      option.textContent = item.label;
      select.appendChild(option);
    });
  }

  function confidenceAnalysisEnabled() {
    return METHOD === 'confidence' || METHOD === 'combined';
  }

  function refreshAnalysisControls() {
    const panel = document.getElementById('confidenceAnalysisPanel');
    if (!panel || !confidenceAnalysisEnabled()) return;
    const mode = document.getElementById('analysisMode').value;
    const selectA = document.getElementById('analysisA');
    const selectB = document.getElementById('analysisB');
    let values = [];
    let options = null;
    if (METHOD === 'confidence') {
      const ellipses = selectedEllipsePopulations();
      if (mode === 'paired') {
        values = uniqueSorted(ellipses.map((item) => item.moment));
      } else {
        options = ellipses.map((item) => ({ value: item.key, label: item.name }));
        values = options.map((item) => item.value);
      }
    } else {
      values = mode === 'longitudinal'
        ? uniqueSorted(measurements.map((item) => item.moment))
        : uniqueSorted(measurements.map((item) => item.group));
    }

    const previousA = selectA.value;
    const previousB = selectB.value;
    if (options) {
      fillSelectOptions(selectA, options);
      fillSelectOptions(selectB, options);
    } else {
      fillSelect(selectA, values);
      fillSelect(selectB, values);
    }
    if (values.includes(previousA)) selectA.value = previousA;
    if (values.includes(previousB)) selectB.value = previousB;
    if (!selectB.value && values.length > 1) selectB.value = values[1];

    document.getElementById('analysisALabel').textContent = mode === 'paired' || mode === 'longitudinal'
      ? t('analysis.momentA')
      : (METHOD === 'confidence' ? t('analysis.ellipseA') : t('analysis.groupA'));
    document.getElementById('analysisBLabel').textContent = mode === 'paired' || mode === 'longitudinal'
      ? t('analysis.momentB')
      : (METHOD === 'confidence' ? t('analysis.ellipseB') : t('analysis.groupB'));

    const result = document.getElementById('analysisResults');
    if (values.length < 2) {
      result.classList.remove('hidden');
      result.textContent = mode === 'paired' || mode === 'longitudinal' ? t('analysis.needTwoMoments') : t('analysis.needTwoGroups');
    } else if (!currentAnalysisResult) {
      result.classList.add('hidden');
    }
  }

  function renderAnalysisResult(result) {
    const target = document.getElementById('analysisResults');
    if (!target) return;
    target.classList.remove('hidden');

    if (result.error) {
      target.textContent = result.error;
      updateFloatingStats();
      return;
    }

    const title = result.mode === 'paired'
      ? t('analysis.pairedResult')
      : (result.mode === 'longitudinal' ? t('analysis.resultLongitudinal') : t('analysis.resultCross'));
    const nText = result.mode === 'longitudinal' || result.mode === 'paired'
      ? `${t('analysis.n')} ${t('analysis.pairs')}=${result.nPairs}`
      : `${t('analysis.n')} A=${result.nA}, ${t('analysis.n')} B=${result.nB}`;
    target.innerHTML = [
      `<div class="font-semibold mb-2">${title}</div>`,
      `<div>${nText}</div>`,
      `<div>${t('analysis.hotelling')}: <strong>${formatNumber(result.t2, 4)}</strong></div>`,
      `<div>${t('analysis.mahalanobis')}: <strong>${formatNumber(Math.sqrt(result.d2), 4)}</strong></div>`,
      `<div>${t('analysis.mahalanobis2')}: <strong>${formatNumber(result.d2, 4)}</strong></div>`,
      `<div>${t('analysis.f')}: <strong>${formatNumber(result.fValue, 4)}</strong> (${t('analysis.df')} ${formatNumber(result.df1, 0)}, ${formatNumber(result.df2, 0)})</div>`,
      `<div>${t('analysis.p')}: <strong>${formatNumber(result.pValue, 5)}</strong></div>`
    ].join('');
    updateFloatingStats();
  }

  function runConfidenceAnalysis() {
    if (!confidenceAnalysisEnabled()) return;
    const mode = document.getElementById('analysisMode').value;
    const a = document.getElementById('analysisA').value;
    const b = document.getElementById('analysisB').value;
    if (!a || !b || a === b) {
      currentAnalysisResult = { error: mode === 'longitudinal' || mode === 'paired' ? t('analysis.needTwoMoments') : t('analysis.needTwoGroups') };
      renderAnalysisResult(currentAnalysisResult);
      return;
    }

    if (METHOD === 'confidence') {
      currentAnalysisResult = mode === 'paired'
        ? hotellingPairedFromEllipses(a, b)
        : hotellingFromPopulations(findEllipseByKey(a), findEllipseByKey(b));
      currentAnalysisResult.mode = mode === 'paired' ? 'paired' : 'cross';
    } else {
      currentAnalysisResult = mode === 'longitudinal'
        ? hotellingPaired(measurements.filter((item) => item.moment === a), measurements.filter((item) => item.moment === b))
        : hotellingIndependent(measurements.filter((item) => item.group === a), measurements.filter((item) => item.group === b));
    }
    currentAnalysisResult.selectionA = a;
    currentAnalysisResult.selectionB = b;
    renderAnalysisResult(currentAnalysisResult);
  }

  function addMeasurement(event) {
    event.preventDefault();

    const r = Number.parseFloat(document.getElementById('inputR').value);
    const xc = Number.parseFloat(document.getElementById('inputXc').value);
    const h = Number.parseFloat(document.getElementById('inputH').value);
    const group = document.getElementById('inputGroup').value.trim() || 'A';
    const moment = document.getElementById('inputMoment').value.trim() || 'T1';
    const id = document.getElementById('inputId').value.trim() || `Medição ${measurements.length + 1}`;

    if (![r, xc, h].every(Number.isFinite) || r <= 0 || xc <= 0 || h <= 0) {
      window.alert(t('input.invalid'));
      return;
    }

    const measure = { id, group, moment, R: r, Xc: xc, H: h, r_h: r / h, xc_h: xc / h };
    measurements.push(measure);
    syncMeasurementStyles();

    document.getElementById('measurementForm').reset();
    document.getElementById('inputGroup').value = group;
    document.getElementById('inputMoment').value = moment;
    document.getElementById('inputR').focus();
    updateStats();
    refreshAnalysisControls();
    renderRelatedStylePanel();
  }

  function parseDelimited(text) {
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (!lines.length) return [];
    const separator = lines[0].includes('\t') ? '\t' : (lines[0].includes(';') ? ';' : ',');
    const split = (line) => {
      const cells = [];
      let current = '';
      let quoted = false;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"' && line[i + 1] === '"') {
          current += '"';
          i += 1;
        } else if (char === '"') {
          quoted = !quoted;
        } else if (char === separator && !quoted) {
          cells.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      cells.push(current.trim());
      return cells;
    };
    const headers = split(lines[0]);
    return lines.slice(1).map((line) => {
      const values = split(line);
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
  }

  function parseHtmlTable(text) {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    const table = doc.querySelector('table');
    if (!table) return [];
    const trs = [...table.querySelectorAll('tr')];
    const headers = [...trs.shift()?.children || []].map((cell) => cell.textContent.trim());
    return trs.map((tr) => {
      const values = [...tr.children].map((cell) => cell.textContent.trim());
      return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
    });
  }

  function readSpreadsheet(file) {
    return new Promise((resolve, reject) => {
      const useXlsx = window.XLSX && /\.(xlsx|xls|xlsm)$/i.test(file.name);
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        try {
          if (useXlsx) {
            const workbook = window.XLSX.read(reader.result, { type: 'array' });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            resolve(window.XLSX.utils.sheet_to_json(sheet, { defval: '' }));
            return;
          }
          const text = String(reader.result || '');
          resolve(/<table/i.test(text) ? parseHtmlTable(text) : parseDelimited(text));
        } catch (error) {
          reject(error);
        }
      };
      if (useXlsx) reader.readAsArrayBuffer(file);
      else reader.readAsText(file);
    });
  }

  function downloadWorkbook(filenameBase, sheets) {
    if (window.XLSX) {
      const workbook = window.XLSX.utils.book_new();
      sheets.forEach((sheet) => {
        const worksheet = window.XLSX.utils.aoa_to_sheet(sheet.rows);
        window.XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name.slice(0, 31));
      });
      window.XLSX.writeFile(workbook, `${filenameBase}.xlsx`);
      return;
    }
    const html = [
      '<html><head><meta charset="UTF-8"></head><body>',
      ...sheets.map((sheet) => `<h2>${escapeHtml(sheet.name)}</h2><table border="1">${sheet.rows.map((row, index) => htmlRow(row, index === 0)).join('')}</table>`),
      '</body></html>'
    ].join('\n');
    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filenameBase}.xls`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  }

  function rowToEllipseRaw(row) {
    const type = String(readRowValue(row, ['tipo', 'type']) || 'classic').trim().toLowerCase() === 'specific' ? 'specific' : 'classic';
    const raw = {
      name: String(readRowValue(row, ['nome', 'name', 'elipse', 'ellipse']) || `Elipse ${customEllipseCounter}`).trim(),
      moment: String(readRowValue(row, ['momento', 'moment', 'time']) || 'T1').trim(),
      pairId: String(readRowValue(row, ['id_pareado', 'paired_id', 'pair_id']) || '').trim(),
      r_h_mean: parseLocaleNumber(readRowValue(row, ['r_h_media', 'r_h_mean', 'rh_mean', 'media_r_h', 'rsp_media', 'rsp_mean'])),
      r_h_sd: parseLocaleNumber(readRowValue(row, ['r_h_dp', 'r_h_sd', 'rh_sd', 'dp_r_h', 'rsp_dp', 'rsp_sd'])),
      xc_h_mean: parseLocaleNumber(readRowValue(row, ['xc_h_media', 'xc_h_mean', 'xch_mean', 'media_xc_h', 'xcsp_media', 'xcsp_mean'])),
      xc_h_sd: parseLocaleNumber(readRowValue(row, ['xc_h_dp', 'xc_h_sd', 'xch_sd', 'dp_xc_h', 'xcsp_dp', 'xcsp_sd'])),
      correlation: parseLocaleNumber(readRowValue(row, ['correlacao', 'correlation', 'r', 'rho'])),
      n: Number.parseInt(parseLocaleNumber(readRowValue(row, ['n'])), 10),
      arm: parseLocaleNumber(readRowValue(row, ['braco_direito_cm', 'right_arm_cm', 'arm_cm'])),
      waist: parseLocaleNumber(readRowValue(row, ['cintura_cm', 'waist_cm'])),
      calf: parseLocaleNumber(readRowValue(row, ['panturrilha_direita_cm', 'right_calf_cm', 'calf_cm'])),
      sex: String(readRowValue(row, ['sexo', 'sex']) || 'U').trim(),
      country: String(readRowValue(row, ['pais', 'country']) || 'Custom').trim(),
      age_range: String(readRowValue(row, ['faixa_etaria', 'age_range', 'age']) || (type === 'specific' ? 'Specific' : 'Classic')).trim(),
      equipment: String(readRowValue(row, ['equipamento', 'equipment']) || 'Custom').trim(),
      population_type: String(readRowValue(row, ['populacao', 'population', 'population_type']) || 'Custom').trim(),
      color: String(readRowValue(row, ['cor', 'color']) || '').trim(),
      dash: String(readRowValue(row, ['traco', 'dash', 'line']) || 'solid').trim(),
      width: parseLocaleNumber(readRowValue(row, ['espessura', 'width']))
    };
    return { type, raw };
  }

  async function importConfidenceEllipses(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const imported = [];
      rows.forEach((row) => {
        const { raw, type } = rowToEllipseRaw(row);
        if (!validEllipseRaw(raw, type)) return;
        const pop = makeCustomEllipse(raw, type, { color: raw.color, dash: raw.dash, width: raw.width });
        imported.push(pop);
      });
      if (!imported.length) {
        window.alert(t('ellipseInput.emptyImport'));
        return;
      }
      userEllipses.push(...imported);
      imported.forEach((pop) => selectedEllipseKeys.add(pop.key));
      populateEllipseFilters();
      compareSelectedEllipses();
      renderEllipseSelectionList();
      updateEllipses();
      updateStats();
      refreshAnalysisControls();
      window.alert(t('ellipseInput.imported').replace('{n}', imported.length));
    } catch (_) {
      window.alert(t('ellipseInput.importError'));
    }
  }

  function downloadEllipseTemplate() {
    downloadWorkbook('aiBIVA-modelo-elipses', [{
      name: 'elipses',
      rows: [
        ['nome', 'tipo', 'momento', 'id_pareado', 'r_h_media', 'r_h_dp', 'xc_h_media', 'xc_h_dp', 'correlacao', 'n', 'sexo', 'faixa_etaria', 'pais', 'equipamento', 'populacao', 'cor', 'traco', 'espessura', 'braco_direito_cm', 'cintura_cm', 'panturrilha_direita_cm'],
        ['Grupo A T1', 'classic', 'T1', 'Grupo A', 310, 45, 32, 6, 0.72, 40, 'M', 'Adult', 'Brazil', 'Akern', 'Healthy', '#0ea5e9', 'solid', 2, '', '', ''],
        ['Grupo A T2 specific', 'specific', 'T2', 'Grupo A', 315, 42, 34, 5.5, 0.70, 40, 'M', 'Adult', 'Brazil', 'Akern', 'Healthy', '#f97316', 'dash', 2, 31, 82, 36]
      ]
    }]);
  }

  function rowToMeasurement(row) {
    const r = parseLocaleNumber(readRowValue(row, ['r', 'resistencia', 'resistance']));
    const xc = parseLocaleNumber(readRowValue(row, ['xc', 'reatancia', 'reactance']));
    const h = parseLocaleNumber(readRowValue(row, ['h', 'estatura', 'height']));
    if (![r, xc, h].every(Number.isFinite) || r <= 0 || xc <= 0 || h <= 0) return null;
    return {
      id: String(readRowValue(row, ['id', 'identificacao', 'identifier']) || `Medição ${measurements.length + 1}`).trim(),
      group: String(readRowValue(row, ['grupo', 'group']) || 'A').trim(),
      moment: String(readRowValue(row, ['momento', 'moment', 'time']) || 'T1').trim(),
      R: r,
      Xc: xc,
      H: h,
      r_h: r / h,
      xc_h: xc / h
    };
  }

  async function importToleranceMeasurements(input) {
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const rows = await readSpreadsheet(file);
      const imported = rows.map(rowToMeasurement).filter(Boolean);
      if (!imported.length) {
        window.alert(t('toleranceImport.empty'));
        return;
      }
      measurements.push(...imported);
      syncMeasurementStyles();
      updateStats();
      refreshAnalysisControls();
      renderRelatedStylePanel();
      window.alert(t('toleranceImport.imported').replace('{n}', imported.length));
    } catch (_) {
      window.alert(t('toleranceImport.error'));
    }
  }

  function downloadToleranceTemplate() {
    downloadWorkbook('aiBIVA-modelo-participantes', [{
      name: 'participantes',
      rows: [
        ['id', 'grupo', 'momento', 'r', 'xc', 'h'],
        ['P001', 'Controle', 'T1', 520, 52, 1.72],
        ['P002', 'Controle', 'T1', 498, 49, 1.68],
        ['P001', 'Controle', 'T2', 505, 50, 1.72]
      ]
    }]);
  }

  function clearAllMeasurements() {
    if (METHOD === 'confidence') {
      userEllipses = [];
      selectedEllipseKeys = new Set();
      ellipseComparisonResults = [];
      currentAnalysisResult = null;
      populateEllipseFilters();
      renderEllipseSelectionList();
      updateEllipses();
      updateStats();
      refreshAnalysisControls();
      updateFloatingStats();
      return;
    }
    measurements = [];
    if (bivaChart) {
      measurementDataset().data = [];
      bivaChart.update();
    }
    updateStats();
    currentAnalysisResult = null;
    refreshAnalysisControls();
    renderRelatedStylePanel();
  }

  function csvValue(value) {
    return `"${String(value ?? '').replace(/"/g, '""')}"`;
  }

  function exportCSV() {
    if (METHOD === 'confidence') {
      const header = ['Elipse', 'Tipo', 'Momento', 'ID pareado', 'N', 'R/H media', 'R/H DP', 'Xc/H media', 'Xc/H DP', 'Correlacao', 'Cor', 'Traco'];
      const rows = selectedEllipsePopulations().map((item) => [
        item.name,
        item.type || 'reference',
        item.moment || '',
        item.pairId || '',
        item.n,
        item.r_h_mean,
        item.r_h_sd,
        item.xc_h_mean,
        item.xc_h_sd,
        item.correlation,
        item.style?.color || '',
        item.style?.dash || ''
      ].map(csvValue).join(','));
      const csv = [header.map(csvValue).join(','), ...rows].join('\n');
      const link = document.createElement('a');
      link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
      link.download = `aiBIVA-${METHOD}-${new Date().toISOString().slice(0, 10)}.csv`;
      link.click();
      return;
    }
    const pop = selectedPopulation();
    const header = ['Medição', 'Grupo', 'Momento', 'R (Ω)', 'Xc (Ω)', 'H (m)', 'R/H', 'Xc/H', 'D² Mahalanobis', 'Classificação', 'População'];
    const rows = measurements.map((item) => {
      const d2 = pop ? covarianceDistance(pop, item) : null;
      return [
        item.id,
        item.group,
        item.moment,
        item.R,
        item.Xc,
        item.H,
        item.r_h.toFixed(4),
        item.xc_h.toFixed(4),
        d2 === null ? '' : d2.toFixed(4),
        d2 === null ? '' : classifyDistance(d2),
        pop ? pop.name : ''
      ].map(csvValue).join(',');
    });

    const csv = [header.map(csvValue).join(','), ...rows].join('\n');
    const link = document.createElement('a');
    link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(csv)}`;
    link.download = `aiBIVA-${METHOD}-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  }

  function exportPNG() {
    if (!bivaChart) return;
    const link = document.createElement('a');
    link.href = chartImageDataURL();
    link.download = `aiBIVA-${METHOD}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  }

  function chartImageDataURL() {
    const source = bivaChart.canvas;
    const output = document.createElement('canvas');
    output.width = source.width;
    output.height = source.height;
    const ctx = output.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, output.width, output.height);
    ctx.drawImage(source, 0, 0);
    return output.toDataURL('image/png');
  }

  function exportEllipsePNG() {
    if (!bivaChart) return;
    const dataset = measurementDataset();
    const saved = [...dataset.data];
    dataset.data = [];
    bivaChart.update();
    const link = document.createElement('a');
    link.href = chartImageDataURL();
    link.download = `aiBIVA-elipse-${METHOD}-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    dataset.data = saved;
    bivaChart.update();
  }

  function htmlCell(value) {
    return `<td>${String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</td>`;
  }

  function htmlRow(values, header = false) {
    const tag = header ? 'th' : 'td';
    return `<tr>${values.map((value) => `<${tag}>${String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${tag}>`).join('')}</tr>`;
  }

  function ellipseRows() {
    if (!bivaChart) return [];
    return bivaChart.data.datasets
      .filter((dataset) => dataset.id !== 'measurements' && dataset.data.length)
      .flatMap((dataset) => dataset.data.map((point, index) => [dataset.label, index + 1, point.x, point.y]));
  }

  function exportExcel() {
    const pop = selectedPopulation();
    const sheets = [];
    const referenceRows = [['Campo', 'Valor']];
    if (pop) {
      referenceRows.push(['Nome', pop.name]);
      referenceRows.push(['N', pop.n]);
      referenceRows.push(['R/H média', pop.r_h_mean]);
      referenceRows.push(['R/H DP', pop.r_h_sd]);
      referenceRows.push(['Xc/H média', pop.xc_h_mean]);
      referenceRows.push(['Xc/H DP', pop.xc_h_sd]);
      referenceRows.push(['Correlação', pop.correlation]);
    }
    if (referenceRows.length > 1) sheets.push({ name: t('sidebar.population'), rows: referenceRows });

    sheets.push({ name: 'Pontos das elipses', rows: [['Elipse', 'Ponto', axisLabelSet().xShort, axisLabelSet().yShort], ...ellipseRows()] });

    if (METHOD === 'confidence') {
      const axisLabels = axisLabelSet();
      const ellipseSheet = [['Elipse', 'Tipo', 'Momento', 'ID pareado', 'N', `${axisLabels.xShort} média`, `${axisLabels.xShort} DP`, `${axisLabels.yShort} média`, `${axisLabels.yShort} DP`, 'Correlação', 'Sexo', 'Faixa etária', 'País', 'Equipamento', 'População', 'Cor', 'Traço', 'Espessura', 'Fator Specific']];
      selectedEllipsePopulations().forEach((item) => {
        ellipseSheet.push([
          item.name,
          item.type || 'reference',
          item.moment || '',
          item.pairId || '',
          item.n,
          item.r_h_mean,
          item.r_h_sd,
          item.xc_h_mean,
          item.xc_h_sd,
          item.correlation,
          item.sex_code || '',
          item.age_range || '',
          item.country || '',
          item.equipment || '',
          item.population_type || '',
          item.style?.color || '',
          item.style?.dash || '',
          item.style?.width || '',
          item.raw?.geometryFactor || ''
        ]);
      });
      sheets.push({ name: 'Elipses', rows: ellipseSheet });
    }

    const measurementSheet = [['ID', 'Grupo', 'Momento', 'R', 'Xc', 'H', 'R/H', 'Xc/H', 'D² Mahalanobis', 'Classificação']];
    measurements.forEach((item) => {
      const d2 = pop ? covarianceDistance(pop, item) : null;
      measurementSheet.push([
        item.id,
        item.group,
        item.moment,
        item.R,
        item.Xc,
        item.H,
        item.r_h,
        item.xc_h,
        d2 === null ? '' : d2,
        d2 === null ? '' : classifyDistance(d2)
      ]);
    });
    if (measurements.length) sheets.push({ name: t('chart.measurements'), rows: measurementSheet });

    if (ellipseComparisonResults.length) {
      const comparisonSheet = [[
        t('ellipseCompare.ellipseA'),
        t('ellipseCompare.ellipseB'),
        'N A',
        'N B',
        t('analysis.mahalanobis'),
        t('analysis.mahalanobis2'),
        t('analysis.hotelling'),
        t('analysis.f'),
        t('analysis.df'),
        t('analysis.p')
      ]];
      ellipseComparisonResults.forEach((result) => {
        comparisonSheet.push([
          result.popA ? result.popA.name : '',
          result.popB ? result.popB.name : '',
          result.nA || '',
          result.nB || '',
          result.error ? result.error : Math.sqrt(result.d2),
          result.error ? '' : result.d2,
          result.error ? '' : result.t2,
          result.error ? '' : result.fValue,
          result.error ? '' : `${result.df1}, ${result.df2}`,
          result.error ? '' : result.pValue
        ]);
      });
      sheets.push({ name: 'Comparações pareadas', rows: comparisonSheet });
    }

    if (currentAnalysisResult && !currentAnalysisResult.error) {
      sheets.push({
        name: t('analysis.title'),
        rows: [
          ['Teste', 'Valor'],
          ['Modo', currentAnalysisResult.mode],
          ['A', currentAnalysisResult.selectionA],
          ['B', currentAnalysisResult.selectionB],
          [t('analysis.hotelling'), currentAnalysisResult.t2],
          [t('analysis.mahalanobis'), Math.sqrt(currentAnalysisResult.d2)],
          [t('analysis.mahalanobis2'), currentAnalysisResult.d2],
          [t('analysis.f'), currentAnalysisResult.fValue],
          [t('analysis.df'), `${currentAnalysisResult.df1}, ${currentAnalysisResult.df2}`],
          [t('analysis.p'), currentAnalysisResult.pValue]
        ]
      });
    }

    downloadWorkbook(`aiBIVA-${METHOD}-${new Date().toISOString().slice(0, 10)}`, sheets);
  }

  function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('selectedLanguage', lang);
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      el.setAttribute('title', t(el.getAttribute('data-i18n-title')));
    });
    if (allPopulations.length && document.getElementById('filterCountry')) {
      const selectedCountry = document.getElementById('filterCountry').value;
      const selectedAge = document.getElementById('filterAge').value;
      populateFilter('filterCountry', [...new Set(allPopulations.map((pop) => pop.country))], t('filters.all'));
      populateFilter('filterAge', [...new Set(allPopulations.map((pop) => pop.age_range))], t('filters.allFem'));
      document.getElementById('filterCountry').value = selectedCountry;
      document.getElementById('filterAge').value = selectedAge;
      applyFilters();
    } else {
      populateEllipseFilters();
    }
    if (bivaChart) {
      updateDatasetLabels();
      if (bivaChart.options) {
        const axisLabels = axisLabelSet();
        bivaChart.options.scales.x.title.text = axisLabels.x;
        bivaChart.options.scales.y.title.text = axisLabels.y;
      }
      bivaChart.update();
    }
    updateStats();
    refreshAnalysisControls();
    renderEllipseSelectionList();
    renderRelatedStylePanel();
    renderChartOptionsPanel();
    updateConfidenceInputMode();
    compareSelectedEllipses();
    updateFloatingStats();
    if (currentAnalysisResult) renderAnalysisResult(currentAnalysisResult);
    applyTheme();
  }

  function goHome() {
    window.location.href = 'aiBIVA-index.html';
  }

  function init() {
    if (window.lucide) window.lucide.createIcons();
    applyTheme();
    document.getElementById('languageSelect').value = currentLanguage;
    const toleranceModeSelect = document.getElementById('toleranceMode');
    if (toleranceModeSelect) toleranceModeSelect.value = tolerancePlotMode;
    loadReferencePopulations();
    restoreTransferredState();
    initChart();
    ensureFloatingStats();
    updateStats();
    const panel = document.getElementById('confidenceAnalysisPanel');
    if (panel && confidenceAnalysisEnabled()) panel.classList.remove('hidden');
    const ellipsePanel = document.getElementById('ellipseSelectionPanel');
    if (ellipsePanel && confidenceEllipseComparisonEnabled()) ellipsePanel.classList.remove('hidden');
    refreshAnalysisControls();
    renderEllipseSelectionList();
    renderRelatedStylePanel();
    renderChartOptionsPanel();
    updateConfidenceInputMode();
    changeLanguage(currentLanguage);
  }

  window.goHome = goHome;
  window.changeLanguage = changeLanguage;
  window.toggleTheme = toggleTheme;
  window.setTolerancePlotMode = setTolerancePlotMode;
  window.applyAxisSettings = applyAxisSettings;
  window.clearAxisSettings = clearAxisSettings;
  window.togglePhaseLine = togglePhaseLine;
  window.openCombinedWithCurrentData = openCombinedWithCurrentData;
  window.applyFilters = applyFilters;
  window.updateEllipses = updateReferencePopulation;
  window.addMeasurement = addMeasurement;
  window.clearAllMeasurements = clearAllMeasurements;
  window.exportCSV = exportCSV;
  window.exportPNG = exportPNG;
  window.exportEllipsePNG = exportEllipsePNG;
  window.exportExcel = exportExcel;
  window.refreshAnalysisControls = refreshAnalysisControls;
  window.runConfidenceAnalysis = runConfidenceAnalysis;
  window.toggleEllipseComparison = toggleEllipseComparison;
  window.renderEllipseSelectionList = renderEllipseSelectionList;
  window.clearEllipseComparison = clearEllipseComparison;
  window.selectCurrentEllipseForComparison = selectCurrentEllipseForComparison;
  window.updateEllipseStyle = updateEllipseStyle;
  window.removeCustomEllipse = removeCustomEllipse;
  window.addConfidenceEllipse = addConfidenceEllipse;
  window.importConfidenceEllipses = importConfidenceEllipses;
  window.downloadEllipseTemplate = downloadEllipseTemplate;
  window.importToleranceMeasurements = importToleranceMeasurements;
  window.downloadToleranceTemplate = downloadToleranceTemplate;
  window.updateConfidenceInputMode = updateConfidenceInputMode;
  window.loadRelatedStyleControls = loadRelatedStyleControls;
  window.applyRelatedStyle = applyRelatedStyle;

  init();
})();
