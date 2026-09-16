# combio-manutencao

Sistema simples de gestão de ordens de manutenção de usinas (UPVs) de uma empresa de energia por biomassa.

## Como rodar

```bash
npm run install:all
npm run seed
npm run start:backend
npm run start:frontend
```

- Backend: http://localhost:3000
- Swagger: http://localhost:3000/api/docs
- Frontend: http://localhost:4200

## Scripts da raiz

| Script | Descrição |
| --- | --- |
| `npm run install:all` | Instala dependências do backend e do frontend |
| `npm run start:backend` | Sobe a API NestJS em modo watch |
| `npm run start:frontend` | Sobe o Angular em http://localhost:4200 |
| `npm run seed` | Popula o SQLite com UPVs, equipamentos e ordens |
| `npm test` | Testes do backend (unitários + e2e) |
| `npm run lint` | Lint do backend e do frontend |
