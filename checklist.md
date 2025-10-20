- Usuario
 - [x] Registro (Auto-cadastro de Cliente): POST /usuario
 - [x] Autenticação (Login): POST /auth/login
 - [x] Buscar Próprios Dados: GET /usuario
 - [ ] Desativar Conta: DELETE /usuario
 - [ ] Buscar Usuário por ID: GET /admin/usuario/:id
 - [ ] Criar Usuário Interno: POST /admin/usuario
 - [ ] Atualizar Perfil: PUT /admin/usuario/:id
 - [ ] Desativar Conta (admin): DELETE /admin/usuario/:id

- FERRY
 - [x] Cadastrar Novo Ferry: POST /admin/ferr
 - [x] Atualizar Informações: PUT /admin/ferry/:id
 - [] Desativar: DELETE /admin/ferry/:id (Implementacao futura)
 - [x] Listar Todos (Paginado): GET /ferry
 - [x] Buscar por ID: GET /ferry/:id

- PORTO
 - [x] Cadastrar Novo Porto: POST /admin/porto
 - [x] Atualizar Informações: PUT /admin/porto/:id
 - [ ] Desativar porto DELETE /admin/porto/:id
 - [x] Listar Todos (Paginado): GET /porto
 - [x] Buscar por ID: GET /porto/:id

- ROTA
 - [x] Cadastrar Nova Rota: POST /admin/rota
 - [x] Atualizar Rota: PUT /admin/rota/:id
 - [ ] Deletar Rota: DELETE /admin/rota/:id
 - [x] Listar Rotas (Paginado): GET /rota
 - [x] Buscar por ID: GET /rota/:id

- VIAGEM
 - [x] Cadastrar Nova Viagem: POST /admin/viagem
 - [x] Atualizar Viagem: PUT /admin/viagem/:id
 - [x] Listar Viagens Disponíveis com filtros: GET /viagem
 - [x] Buscar por ID (Detalhes): GET /viagem/:id
 - [ ] Desativar: DELETE /admin/viagem/:id

- PASSAGEM
 - [x] Reservar/Comprar Passagem: POST /passagem
 - [x] Listar passagens adquiridas: GET /passagem
 - [x] Cancelar Passagem: PUT /passagem/:codigo/cancelar
 - [x] Ver Passagem por Código: GET /admin/passagem/:codigo
 - [ ] Auditar Passagem: PUT /admin/passagem/:codigo/auditar
 - [x] Cancelar Passagem: PATCH /admin/passagem/:codigo/cancelar
