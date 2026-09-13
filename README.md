# Meu Estoque

Protótipo de uma central doméstica de compras que reúne recorrência de pedidos,
estoque e oportunidades de economia em uma única tela.

## Executar

O projeto é uma aplicação estática, sem etapa de build:

```bash
python3 -m http.server 4173
```

Depois, acesse <http://localhost:4173>.

## Funcionalidades

- visão geral do estoque da casa;
- lista de compras com itens sugeridos pelo histórico;
- filtros por status e busca por produto;
- atualização rápida de quantidades;
- inclusão de novos itens;
- simulação de sincronização de fontes e alertas de preço;
- dados persistidos localmente no navegador.
