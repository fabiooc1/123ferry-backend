- Usuario
 - [x] Registro (Auto-cadastro de Cliente): POST /usuario
 - [x] Autenticação (Login): POST /auth/login
 - [x] Buscar Próprios Dados: GET /usuario
 - [ ] Atualizar Próprio Perfil: PUT /usuario
 - [ ] Desativar Conta: DELETE /usuario
 - [ ] Buscar Usuário por ID: GET /admin/usuario/:id
 - [ ] Criar Usuário Interno: POST /admin/usuario
 - [ ] Atualizar Perfil: PUT /admin/usuario/:id
 - [ ] Desativar Conta (admin): DELETE /admin/usuario/:id

- FERRY
 - [ ] Cadastrar Novo Ferry: POST /admin/ferr
 - [ ] Atualizar Informações: PUT /admin/ferry/:id
 - [ ] Desativar: DELETE /admin/ferry/:id
 - [ ] Listar Todos (Paginado): GET /ferry
 - [ ] Buscar por ID: GET /ferry/:id

- PORTO
 - [ ] Cadastrar Novo Porto: POST /admin/porto
 - [ ] Atualizar Informações: PUT /admin/porto/:id
 - [ ] Desativar porto DELETE /admin/porto/:id
 - [ ] Listar Todos (Paginado): GET /porto
 - [ ] Buscar por ID: GET /porto/:id

- ROTA
 - [ ] Cadastrar Nova Rota: POST /admin/rota
 - [ ] Atualizar Rota: PUT /admin/rota/:id
 - [ ] Deletar Rota: DELETE /admin/rota/:id
 - [ ] Listar Rotas (Paginado): GET /rota
 - [ ] Buscar por ID: GET /rota/:id

- VIAGEM
 - [ ] Cadastrar Nova Viagem: POST /admin/viagem
 - [ ] Atualizar Viagem: PUT /admin/viagem/:id
 - [ ] Listar Viagens Disponíveis com filtros: GET /viagem
 - [ ] Buscar por ID (Detalhes): GET /viagem/:id
 - [ ] Desativar: DELETE /admin/viagem/:id

- PASSAGEM
 - [ ] Reservar/Comprar Passagem: POST /passagem
 - [ ] Listar passagens adquiridas: GET /passagem
 - [ ] Cancelar Passagem: PUT /passagem/:codigo/cancelar
 - [ ] Ver Passagem por Código: GET /admin/passagem/:codigo
 - [ ] Auditar Passagem: PUT /admin/passagem/:codigo/auditar
 - [ ] Cancelar Passagem: PUT /admin/passagem/:codigo/cancelar
