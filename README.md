# 🐔 Avícola Paraíso · Agenda de Pedidos

<div align="center">

![Status](https://img.shields.io/badge/status-ativo-f97316?style=flat-square)
![HTML](https://img.shields.io/badge/HTML5-f97316?style=flat-square&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-f97316?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-f97316?style=flat-square&logo=javascript&logoColor=white)

Sistema web completo de gerenciamento de pedidos para a **Avícola Paraíso** · controle de clientes, entregas, pagamentos, calendário visual, alertas automáticos e exportação de relatório em PDF. Roda 100% no navegador, sem servidor ou banco de dados externo.

[✨ Funcionalidades](#-funcionalidades) · [🚀 Como usar](#-como-usar) · [📁 Estrutura](#-estrutura-do-projeto) · [📱 Responsividade](#-responsividade)

</div>

---

## ✨ Funcionalidades

- **Cadastro completo de pedidos** - cliente, quantidade, data, status de entrega e pagamento
- **Edição e exclusão** de pedidos com confirmação
- **Painel de resumo** com contadores animados em tempo real (frangos, pedidos, entregues, pendentes)
- **Calendário visual mensal** - dias com pedidos destacados em laranja com tooltip e navegação entre meses
- **Alertas proativos automáticos** - pagamentos pendentes há mais de 7 dias e entregas atrasadas há mais de 3 dias
- **Filtros e busca em tempo real** - por nome do cliente, status de entrega e pagamento
- **Botão de observação inteligente** - bolinha vermelha pulsante indica quando há observação cadastrada
- **Confirmação ao trocar tema** - modal de confirmação antes de mudar entre dark e light mode
- **Exportação em PDF profissional** - relatório completo com resumo estatístico e tabela de pedidos
- **Modo escuro / claro** - paleta laranja em ambos os modos, preferência salva automaticamente
- **Persistência de dados** via `localStorage` - pedidos mantidos após fechar o navegador
- **Toast de feedback** - notificação visual em todas as ações

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML5 + CSS3 + JS (ES6+) | Base completa da aplicação |
| [jsPDF](https://github.com/parallax/jsPDF) | Geração do relatório em PDF |
| [Font Awesome 6](https://fontawesome.com/) | Ícones |
| [Google Fonts](https://fonts.google.com/) | Bebas Neue + Outfit |
| localStorage | Persistência de dados no navegador |

---

## 🎨 Design

| Modo | Fundo | Superfície | Destaque |
|---|---|---|---|
| **Escuro** | `#0e0b08` · preto quente | `#17130e` | Laranja `#f97316` |
| **Claro** | `#dde1e7` · cinza-ardósia | `#e8ecf1` | Laranja `#c95c06` |

- **Fonte de títulos e números:** Bebas Neue · forte, industrial e marcante
- **Fonte de corpo:** Outfit · moderna e legível para dados
- **Acento laranja** em botões, badges, calendário, barras laterais dos cards e no PDF

---

## 📁 Estrutura do Projeto

```
avicola_agenda1
├── index.html       # Estrutura da aplicação
├── main.css         # Estilos, temas dark/light e responsividade
├── app.js           # Lógica completa (CRUD, calendário, alertas, PDF)
├── README.md        # Documentação
└── imagens/
    └── Avicola.ico  # Ícone da aba do navegador
```

---

## 🚀 Como usar

### Localmente
1. Baixe ou clone o repositório
2. Abra `index.html` diretamente no navegador
3. Nenhuma instalação, servidor ou conta necessária

```bash
git clone https://github.com/Augusto-dev0/agenda_frangos.git
cd avicola-paraiso
# Abra o index.html no navegador
```

### Hospedado no GitHub Pages
1. Acesse https://augusto-dev0.github.io/agenda_frangos/

> ⚠️ Os dados ficam salvos no `localStorage` do navegador. Limpar os dados do site apagará os pedidos salvos.

---

## 📱 Responsividade

| Tela | Comportamento |
|---|---|
| Desktop ≥ 960px | Formulário em 4 colunas, painel em 4 cards, filtros em linha |
| Tablet ≤ 960px | Formulário em 2 colunas, filtros em 2 colunas |
| Mobile ≤ 640px | Layout em 1 coluna, botões em largura total, calendário compacto |
| Mobile ≤ 420px | Calendário ultra-compacto, tooltip reposicionado abaixo do dia |

---

## 📅 Calendário Visual

O calendário exibe automaticamente os dias com pedidos registrados destacados em **laranja**. Ao passar o mouse sobre um dia com pedido, aparece um tooltip com a quantidade e os nomes dos clientes. A navegação entre meses é feita pelas setas laterais.

---

## 🔔 Alertas Proativos

O painel de alertas aparece automaticamente quando detecta:

| Nível | Condição |
|---|---|
| 🔴 Urgente | Pagamento pendente há **7 dias ou mais** |
| 🟡 Aviso | Entrega pendente há **3 dias ou mais** |

---

## 👁️ Indicador de Observações

O botão de olho na tabela tem dois estados visuais claros:

| Estado | Visual |
|---|---|
| **Com observação** | Laranja com borda e **bolinha vermelha pulsante** no canto |
| **Sem observação** | Cinza semi-transparente e desativado |

---

## 🎨 Confirmação de Tema

Ao clicar no botão de alternância de tema, um modal de confirmação é exibido antes de aplicar a mudança — evitando trocas acidentais. O usuário pode confirmar ou cancelar a alteração.

---

## 📄 PDF Exportado

O relatório gerado inclui:

- Cabeçalho com identidade visual laranja da Avícola Paraíso
- 4 mini-cards de resumo: frangos pedidos, entregues, em processo e pagamentos pendentes
- Tabela completa com todos os pedidos e badges coloridos por status
- Quantidade de frangos destacada em laranja
- Observações de cada pedido (quando houver)
- Paginação automática com cabeçalho de continuação
- Rodapé com número de páginas em todas as folhas

---

## 📬 Contato

**Desenvolvido por Luiz Augusto**

[![GitHub](https://img.shields.io/badge/GitHub-Augusto--dev0-f97316?style=flat-square&logo=github)](https://github.com/Augusto-dev0)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-luiz--augusto7x-f97316?style=flat-square&logo=linkedin)](https://linkedin.com/in/luiz-augusto7x)
[![Instagram](https://img.shields.io/badge/Instagram-luiz--augusto7x-f97316?style=flat-square&logo=instagram)](https://www.instagram.com/luiz.augusto7x/)

---

## 📄 Licença

![License: Proprietary](https://img.shields.io/badge/licen%C3%A7a-Propriet%C3%A1ria-red)

Licença proprietária · todos os direitos reservados ao autor.
Nenhuma permissão é concedida para uso, cópia, modificação ou distribuição deste conteúdo sem autorização prévia e por escrito.

Consulte o arquivo [`LICENSE`](./LICENSE) para os termos completos.

---
