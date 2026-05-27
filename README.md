# aiBIVA - Software de Análise BIVA

Ferramenta web para análise de Bioimpedância Vetorial (BIVA) com suporte a múltiplos métodos e populações de referência.

## 📋 Conteúdo

- **aiBIVA-index.html** - Página inicial com seleção de método
- **aiBIVA-tolerance.html** - Análise de Tolerância (42 populações)
- **aiBIVA-confidence.html** - Análise de Confiança (141 populações)
- **aiBIVA-combined.html** - Análise Mista (183 populações)
- **reference_populations_final.json** - Base de dados com 183 populações completas
- **aibiva-data.js** - Base JSON empacotada para uso direto no navegador
- **aibiva-app.js** - Lógica compartilhada dos métodos, filtros, gráficos e exportações

## 🚀 Como Usar

1. Extraia os arquivos do ZIP
2. Abra **aiBIVA-index.html** em um navegador web
3. Escolha o método de análise (Tolerância, Confiança ou Mista)
4. Selecione a população de referência usando os filtros quando estiver em Tolerância ou Mista
5. Em tolerância, escolha elipse tradicional deslocada ou z-score centrado no zero
6. Em confiança, adicione elipses manualmente ou importe várias elipses por Excel
7. Em confiança, escolha Classic ou Specific; no Specific, informe perímetros de braço direito, cintura e panturrilha direita
8. Marque múltiplas elipses de confiança para comparar elipses inteiras; a tela inicia sem elipse pré-desenhada
9. Use paired confidence para indicar T1 e T2 nas elipses marcadas
10. Na tolerância, selecione indivíduos relacionados pelo campo Grupo/Momento para alterar cor e símbolo
11. Em tolerância, importe participantes em lote por Excel quando necessário
12. Exporte a elipse em PNG, o gráfico em PNG, CSV ou Excel editável
13. Ajuste manualmente os eixos, se precisar padronizar a escala dos gráficos
14. Use "Abrir na mista" para levar tolerance/confidence para a análise mista já carregada

## 🎯 Métodos Disponíveis

### Tolerância
- Análise de variabilidade populacional
- 3 elipses (50%, 75%, 95%)
- 42 populações de referência
- Modos tradicional deslocado e z-score centrado no zero

### Confiança
- Intervalo de confiança (95%)
- Erro padrão = DP/√N
- Entrada manual ou importação em lote de elipses Classic ou Specific
- Banco de elipses de confiança disponível no painel "Elipses para comparar"

### Mista
- Combinação de Tolerância + Confiança
- Visão completa e comparativa
- 183 populações

## 🌐 Idiomas Suportados

- Português (Brasil)
- Inglês
- Espanhol

## 📊 Populações de Referência

Total de **183 populações completas** após limpeza de registros incompletos, Piccoli solto e elipses de braço digitadas manualmente, com referências atléticas adicionadas de Campa et al. 2019:
- **BIVAtolerance25042024.xlsm** e artigo Campa 2019 (42 populações)
- **BIVAconfidenceBonegeometryfemaleathletes.xls** e artigo Campa 2019 (141 populações)

Cada população contém:
- Código e identificação
- Tamanho da amostra (N)
- Média e desvio padrão de R/H
- Média e desvio padrão de Xc/H
- Correlação entre R/H e Xc/H
- Sexo e país de origem

## 📈 Funcionalidades

✅ Entrada de dados individual ou em grupo
✅ Gráfico RXc com elipses e fallback Canvas local
✅ Tema claro/escuro em todo o software
✅ Tolerance tradicional deslocada ou centrada em z-score
✅ Eixos dos gráficos editáveis manualmente
✅ Atalho para abrir análise mista mantendo medições, elipses, estilos e eixos
✅ Linha do centro da elipse à origem com cálculo do ângulo de fase
✅ Confidence com entrada de elipses por média, DP, correlação e N
✅ Importação em lote de elipses por Excel/CSV com modelo baixável
✅ Importação em lote de participantes na tolerância com modelo baixável
✅ Modos Classic e Specific com ajuste por perímetros corporais
✅ Estilo editável por elipse: cor, traço e espessura
✅ Filtros avançados (sexo, país, faixa etária, equipamento e população)
✅ Cálculos estatísticos (distância de Mahalanobis D² e classificação por elipse)
✅ Export de gráficos em PNG
✅ Export PNG com fundo branco consistente
✅ Export da elipse atual em PNG
✅ Export de planilha Excel editável com abas de elipses, medições e comparações pareadas
✅ Export de dados em CSV
✅ Multi-idioma (PT-BR, EN, ES)
✅ Janela flutuante móvel e fechável sobre o gráfico com p-values dos testes estatísticos
✅ Interface responsiva

## 🧪 Análise de Confiança

- **Transversal:** compara duas elipses marcadas usando Hotelling T², F aproximado, p-value e distância de Mahalanobis.
- **Paired confidence:** permite indicar T1 e T2 nas elipses marcadas para comparação pareada por ID.
- **Classic/Specific:** Classic usa diretamente R/H e Xc/H; Specific aplica ajuste geométrico com perímetros de braço direito, cintura e panturrilha direita.
- **Elipses de referência:** permite filtrar e marcar várias elipses de confiança por sexo, faixa etária, país, equipamento e tipo de população, comparando cada par como grupos inteiros.
- **Importação:** o painel de confiança inclui modelo Excel para importar múltiplas elipses já no formato correto.
- **Visualização:** a página de confiança começa sem elipse desenhada; as elipses aparecem quando são selecionadas para comparação ou quando a análise exige referência.
- **Resultados no gráfico:** os p-values dos testes aparecem também em uma janela flutuante, móvel e fechável sobre o gráfico.
- Para resultados estáveis, cada grupo/momento precisa ter amostra suficiente para estimar a matriz de covariância.

## 💻 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Sem necessidade de instalação ou servidor
- Funciona offline após carregamento

## 📝 Notas

- Os dados são armazenados localmente no navegador
- Não há envio de dados para servidores externos
- Compatível com desktop, tablet e mobile

## 🔗 Referências

- Piccoli A, Nigrelli S, Caberlotto A, et al. Bivariate normal values of the bioelectrical impedance vector in adult and elderly populations. Am J Clin Nutr 1995;61:269-270.
- Campa F, Matias C, Gatterer H, et al. Classic Bioelectrical Impedance Vector Reference Values for Assessing Body Composition in Male and Female Athletes. Int J Environ Res Public Health. 2019;16(24):5066.
- Bioelectrical Impedance Vector Analysis (BIVA) - Metodologia científica estabelecida

---

**Versão:** 8.0
**Data:** Maio 2026
**Desenvolvido com:** HTML5, CSS3, JavaScript, Canvas, Chart.js, Tailwind CSS
