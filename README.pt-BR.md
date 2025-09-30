# mcp-arivo

English | [Português](README.pt-BR.md)

Um servidor Model Context Protocol (MCP) para integração com Arivo CRM, permitindo que assistentes de IA interajam com seus dados do Arivo CRM através de uma interface padronizada.

## Exemplo de Uso

Uma vez conectado, você pode pedir ao seu assistente/agente de IA para interagir com seu Arivo CRM:

```
"Liste 100 contatos que foram atualizados recentemente"
"Crie um novo contato chamado João Silva com email joao@exemplo.com e telefone (11) 98765-4321"
"Adicione as tags 'vip' e 'ouro' ao contato João Silva"
"Quantas oportunidades estão abertas na última etapa do funil 'Funil de vendas'?"
"Crie uma tarefa para fazer follow-up com a empresa Acme na próxima semana"
"Adicione uma nota à oportunidade ID 71 dizendo 'Cliente solicitou preço customizado'"
"Liste todos os produtos na categoria 'eletrônicos'"
"Crie um registro customizado para Pizza com cobertura de pepperoni"
"Mostre todos os usuários da equipe de vendas"
"Quais são os tipos de tarefas disponíveis?"
```

## Requisitos

- Node.js 18.0.0 ou superior
- Chave de API do Arivo CRM (obtenha nas configurações da sua conta Arivo CRM)
- Compatível com clientes MCP:
  - Claude Desktop
  - Claude Code
  - Cursor
  - VSCode com extensão MCP
  - Windsurf
  - Outros clientes compatíveis com MCP

## Instalação

<details>
<summary><b>Claude Desktop</b></summary>

1. Abra o arquivo de configuração do Claude Desktop:
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   - **macOS/Linux**: `~/Library/Application Support/Claude/claude_desktop_config.json`

2. Adicione a configuração do servidor MCP:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "sua-chave-api-arivo"
      }
    }
  }
}
```

3. Reinicie o Claude Desktop

</details>

<details>
<summary><b>Claude Code</b></summary>

1. Abra o arquivo de configurações MCP do Claude Code:
   - **Windows**: `%APPDATA%\Claude\claude_code_mcp_settings.json`
   - **macOS/Linux**: `~/Library/Application Support/Claude/claude_code_mcp_settings.json`

2. Adicione a configuração do servidor MCP:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "sua-chave-api-arivo"
      }
    }
  }
}
```

3. Reinicie o Claude Code ou recarregue as configurações MCP

</details>

<details>
<summary><b>Cursor</b></summary>

1. Abra as Configurações do Cursor (Ctrl+Shift+J ou Cmd+Shift+J)

2. Navegue até "Features" → "Model Context Protocol"

3. Clique em "Add MCP Server" e configure:
   - **Name**: `arivo-crm`
   - **Command**: `npx`
   - **Arguments**: `-y mcp-arivo`
   - **Environment Variables**:
     ```
     ARIVO_API_KEY=sua-chave-api-arivo
     ```

4. Reinicie o Cursor

</details>

<details>
<summary><b>VS Code</b></summary>

1. Instale a [extensão MCP para VS Code](https://marketplace.visualstudio.com/items?itemName=ModelContextProtocol.mcp)

2. Abra as configurações do VS Code (Ctrl+, ou Cmd+,) e busque por "MCP"

3. Edite o arquivo de configuração MCP ou adicione via interface:
```json
{
  "mcp.servers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "sua-chave-api-arivo"
      }
    }
  }
}
```

4. Recarregue a janela do VS Code

</details>

<details>
<summary><b>Windsurf</b></summary>

1. Abra as configurações do Windsurf e navegue até a configuração MCP

2. Adicione a configuração do servidor:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "sua-chave-api-arivo"
      }
    }
  }
}
```

3. Reinicie o Windsurf

</details>

<details>
<summary><b>Gemini CLI</b></summary>

Configure o servidor MCP para Gemini CLI:

```bash
# macOS/Linux
export MCP_SERVERS='{"arivo-crm":{"command":"npx","args":["-y","mcp-arivo"],"env":{"ARIVO_API_KEY":"sua-chave-api-arivo"}}}'

# Windows (PowerShell)
$env:MCP_SERVERS='{"arivo-crm":{"command":"npx","args":["-y","mcp-arivo"],"env":{"ARIVO_API_KEY":"sua-chave-api-arivo"}}}'
```

Em seguida, execute o Gemini CLI com suporte MCP habilitado.

**Nota para Windows**: Para configuração persistente, adicione a variável de ambiente às variáveis de ambiente do sistema através de Propriedades do Sistema → Avançado → Variáveis de Ambiente

</details>

<details>
<summary><b>GitHub Copilot Coding Agent</b></summary>

1. Crie ou edite o arquivo de configuração MCP do Copilot:
   - **Windows**: `%USERPROFILE%\.github-copilot\mcp-servers.json`
   - **macOS/Linux**: `~/.github-copilot/mcp-servers.json`

2. Adicione a configuração do servidor MCP:
```json
{
  "mcpServers": {
    "arivo-crm": {
      "command": "npx",
      "args": ["-y", "mcp-arivo"],
      "env": {
        "ARIVO_API_KEY": "sua-chave-api-arivo"
      }
    }
  }
}
```

3. Reinicie sua IDE ou ambiente de desenvolvimento

</details>

## Configuração

### Opção 1: Variáveis de Ambiente (Recomendado)

```bash
export ARIVO_API_KEY="sua-chave-api-arivo"
export ARIVO_API_URL="https://arivo.com.br/api/v2"  # Opcional, padrão é esta URL
```

### Opção 2: Arquivo de Configuração

Crie um arquivo `config.json` no diretório do seu projeto:

```json
{
  "apiKey": "sua-chave-api-arivo",
  "apiUrl": "https://arivo.com.br/api/v2"
}
```

### Opção 3: Argumentos de Linha de Comando

```bash
mcp-arivo --api-key sua-chave-api --api-url https://arivo.com.br/api/v2
```


## Ferramentas Disponíveis

### Contatos

- `list_contacts` - Listar todos os contatos com filtragem opcional (tipo, nome, email, telefone, tags, etc.)
- `get_contact` - Obter um contato específico por ID
- `create_contact` - Criar um novo contato com telefones, emails e endereços
- `update_contact` - Atualizar um contato existente
- `delete_contact` - Deletar um contato

### Oportunidades

- `list_deals` - Listar todas as oportunidades com filtragem opcional (status, temperatura, funil, tags, etc.)
- `get_deal` - Obter uma oportunidade específica por ID
- `create_deal` - Criar uma nova oportunidade com itens de cotação
- `update_deal` - Atualizar uma oportunidade existente
- `delete_deal` - Deletar uma oportunidade

### Tarefas

- `list_tasks` - Listar todas as tarefas com filtragem opcional (status de conclusão, contato, oportunidade, etc.)
- `get_task` - Obter uma tarefa específica por ID
- `create_task` - Criar uma nova tarefa com recorrência opcional
- `update_task` - Atualizar uma tarefa existente
- `delete_task` - Deletar uma tarefa

### Notas

- `list_notes` - Listar todas as notas com filtragem opcional
- `get_note` - Obter uma nota específica por ID
- `create_note` - Criar uma nova nota
- `update_note` - Atualizar uma nota existente
- `delete_note` - Deletar uma nota

### Produtos e Categorias

- `list_products` - Listar todos os produtos com filtragem opcional
- `get_product` - Obter um produto específico por ID
- `create_product` - Criar um novo produto
- `update_product` - Atualizar um produto existente
- `delete_product` - Deletar um produto
- `list_product_categories` - Listar todas as categorias de produtos
- `get_product_category` - Obter uma categoria de produto específica por ID
- `create_product_category` - Criar uma nova categoria de produto
- `update_product_category` - Atualizar uma categoria de produto existente
- `delete_product_category` - Deletar uma categoria de produto

### Registros Customizados

- `list_custom_record_definitions` - Listar todos os tipos de registros customizados
- `get_custom_record_definition` - Obter um tipo de registro customizado específico por ID
- `create_custom_record_definition` - Criar um novo tipo de registro customizado
- `update_custom_record_definition` - Atualizar um tipo de registro customizado existente
- `delete_custom_record_definition` - Deletar um tipo de registro customizado
- `list_custom_records` - Listar registros customizados para um tipo específico
- `get_custom_record` - Obter um registro customizado específico
- `create_custom_record` - Criar uma nova instância de registro customizado
- `update_custom_record` - Atualizar um registro customizado existente
- `delete_custom_record` - Deletar um registro customizado

### Dados de Referência (Somente Leitura)

- `list_users` - Listar todos os usuários com filtragem opcional
- `get_user` - Obter um usuário específico por ID
- `list_teams` - Listar todas as equipes
- `get_team` - Obter uma equipe específica por ID
- `list_pipelines` - Listar todos os funis de vendas com suas etapas
- `get_pipeline` - Obter um funil específico por ID
- `list_task_types` - Listar todos os tipos de tarefas disponíveis
- `get_custom_fields` - Obter definições de campos customizados para um tipo de registro

### Anexos

- `list_attachment_files` - Listar arquivos anexos com filtragem opcional
- `get_attachment_file` - Obter um arquivo anexo específico por ID
- `delete_attachment_file` - Deletar um arquivo anexo

## Cobertura da API

Este servidor MCP fornece cobertura completa da API REST do Arivo CRM:

| Recurso | GET (Lista) | GET (Individual) | POST (Criar) | PUT (Atualizar) | DELETE |
|---------|-------------|------------------|--------------|-----------------|--------|
| Contatos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Oportunidades | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tarefas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Produtos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Categorias de Produtos | ✅ | ✅ | ✅ | ✅ | ✅ |
| Definições de Registros Customizados | ✅ | ✅ | ✅ | ✅ | ✅ |
| Registros Customizados | ✅ | ✅ | ✅ | ✅ | ✅ |
| Usuários | ✅ | ✅ | - | - | - |
| Equipes | ✅ | ✅ | - | - | - |
| Funis | ✅ | ✅ | - | - | - |
| Tipos de Tarefas | ✅ | - | - | - | - |
| Campos Customizados | ✅ | - | - | - | - |
| Arquivos Anexos | ✅ | ✅ | - | - | ✅ |

## Desenvolvimento

### Compilando do Código Fonte

```bash
git clone https://github.com/your-username/mcp-arivo.git
cd mcp-arivo
npm install
npm run build
```

### Executando em Modo de Desenvolvimento

```bash
npm run dev
```

### Testes

```bash
npm test
```

## Segurança

- Chaves de API são armazenadas localmente e nunca transmitidas exceto para a API do Arivo
- Todas as requisições usam HTTPS
- Nenhum dado sensível é registrado em logs ou em cache

## Contribuindo

1. Faça um fork do repositório
2. Crie uma branch de feature (`git checkout -b feature/funcionalidade-incrivel`)
3. Commit suas mudanças (`git commit -m 'Adiciona funcionalidade incrível'`)
4. Push para a branch (`git push origin feature/funcionalidade-incrivel`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## Suporte

- [Documentação da API do Arivo CRM](https://arivo.docs.apiary.io)
- [Especificação MCP](https://modelcontextprotocol.io)
- [Rastreador de Issues](https://github.com/arivo-crm/mcp-arivo/issues)