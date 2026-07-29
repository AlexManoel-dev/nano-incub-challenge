## Desafio

### Como subir o projeto
1. Clone o repositório
2. Entre na pasta:
    ```
    cd nano-incub-challenge
    ```
3. Copie o arquivo de ambiente:
   Linux
   ```
   cp .env.example .env
   ```
   Windows
   ```
   copy .env.example .env
   ```
4. Edite o `.env` e preencha as credenciais do banco (precisam bater com o que está em `docker-compose.yml`):
   ```
   DB_CONNECTION=mysql
   DB_HOST=mysql
   DB_PORT=3306
   DB_DATABASE=nano_incub
   DB_USERNAME=laravel
   DB_PASSWORD=laravel
   ```
5. Suba os containers:
   ```
   docker-compose up -d --build
   ```
6. Rode as migrations com o seeder:
   ```
   docker-compose exec app php artisan migrate:fresh --seed
   ```
7. Acesse http://localhost:8000/login

### Credenciais de acesso

email: admin@admin.com\
senha: 12345678

### Decisões técnicas

**Persistência do saldo:**
Optei por manter balance como coluna na tabela employees, atualizada a cada movimentação, em vez de calcular SUM(entradas) - SUM(saídas) toda vez que a tela carrega
- Contra: existe redundância — o saldo é, teoricamente, derivável do histórico de movimentações. Se algum dia um registro for alterado manualmente no banco, saldo e histórico podem ficar diferentes
- A favor: consultar employees (leitura de uma coluna) é O(1); calcular a soma exigiria calcular as movimentações do funcionário toda vez que a listagem fosse exibida, o que em larga escala ficaria ruim
- Pra mitigar o risco da divergência, a escrita é sempre atômica: MovementController::store roda dentro de uma DB::transaction(), com lockForUpdate() no funcionário antes de ler o saldo atual. Isso garante que, mesmo com duas requisições concorrentes pro mesmo funcionário, uma espera a outra terminar antes de ler o saldo — sem isso, duas saídas simultâneas poderiam passar pela validação de saldo suficiente ao mesmo tempo e deixar o saldo negativo, deixando possível acontecer uma race condition, e também habilitando que uma operação do todo pudesse acontecer, sem que tudo acontecesse junto

**Valores em centavos internamente:**
Antes de somar/subtrair, o MovementController converte os valores pra inteiro (centavos) e só formata de volta pra decimal no final. Evita erro de arredondamento de float em operação repetida de dinheiro

**Docker:**
Dockerizei (PHP-FPM + MySQL 8 em containers separados) pra padronizar o ambiente entre quem for rodar o projeto, sem depender de versão de PHP/MySQL instalada localmente. O docker-compose.yml não tem nenhuma credencial hardcoded — ele lê as variáveis do próprio .env do Laravel (${DB_DATABASE}, ${DB_USERNAME}, etc.), então o mesmo arquivo de ambiente serve tanto pra aplicação quanto pra subir o banco, sem duplicar segredo em dois lugares

**Sem tela de registro nem recuperação de senha:**
É um painel restrito a administradores, criados via seeder — não faz sentido expor cadastro público nem fluxo de "esqueci minha senha". Mantive o starter kit oficial do Laravel (React + Inertia) como base de autenticação, só removendo as rotas de register/forgot-password/reset-password de routes/auth.php e ajustando a paleta de cores/tema — não reescrevi login do zero, como o desafio pede

**Modais em vez de páginas separadas pra criar/editar:**
Cadastro e edição de funcionário, e lançamento de movimentação, acontecem em modal na própria listagem, em vez de navegar pra uma rota /create separada. Reduz o número de cliques e mantém o contexto da lista visível, e evita o problema de estado desatualizado que existe ao navegar entre páginas diferentes no Inertia

**Uso de IA:**
Usei Claude principalmente para estilo/UI (paleta de cores, componentes React/Tailwind, revisão de UX) e ChatGPT como apoio na lógica geral do backend. Não usei nenhuma ferramenta agente autônoma (tipo Cursor/opencodex) escrevendo código sem eu revisar linha a linha — toda regra de negócio (transação atômica, lock, validação de saldo negativo, conversão pra centavos) foi decidida e conferida por mim.

### O que ficou de fora / o que eu faria com mais tempo

- **Testes automatizados:** O projeto ficou só com o teste de auth do starter kit (AuthenticationTest) — removi RegistrationTest, DashboardTest, ProfileUpdateTest e PasswordUpdateTest porque testavam rotas que não existem mais (/register, /dashboard e /profile). Não escrevi teste nenhum pra MovementController, que é justamente a parte que mais importa: saldo não pode ficar negativo, saldo bate com a soma das movimentações, e — o mais importante de testar e o mais fácil de quebrar sem perceber — duas movimentações concorrentes no mesmo funcionário não podem os dois lerem o mesmo saldo antes de gravar. Com mais tempo, o primeiro teste que eu escreveria é exatamente esse último, simulando duas transações em paralelo

- **Paginação na listagem de movimentações:** Hoje MovementController::index traz todo o histórico de uma vez (Movement::query()->with('employee:id,name')->latest()->get()). Funciona bem com o volume de dados de teste, mas cresce sem limite — em produção isso viraria uma query cada vez mais pesada. Trocaria por paginate() e paginação client-side

- **Autorização baseada em papel:** Todo FormRequest retorna authorize(): true — hoje faz sentido porque a única persona é "administrador autenticado", sem hierarquia. Se o sistema crescesse pra ter mais de um nível de admin (ex: alguém que só visualiza vs. alguém que lança movimentação), eu introduziria Policies do Laravel em vez de deixar tudo liberado por padrão

- **Índices no banco:** movements.employee_id já tem índice (é foreignId), mas não adicionei índice em movements.created_at, que é o campo usado pra ordenar a listagem (latest()). Não é gargalo com poucos registros, mas seria o primeiro ajuste de performance com mais dados

- **CI:** Não configurei GitHub Actions pra rodar os testes/lint automaticamente a cada push
