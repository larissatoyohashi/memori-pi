# Memori

Esta API é utilizada para gerenciar o sistema MEMORI, permitindo que administradores realizem operações de CRUD (criar, ler, atualizar e deletar) por meio da página web.

## Endpoints
### GET /checkpoint
Esse endpoint é responsável por retornar a listagem de todos os checkpoints cadastrados no banco de dados.

#### Parâmetros:
Nenhum

#### Respostas:
##### OK! 200
Caso essa resposta aconteça, você vai receber a listagem de todos os checkpoints.

Exemplo de resposta:
```
{
    "nomeCheckpoint": "Edifício K.K.K.K.",
    "latitudeCheckpoint": "-24.4880",
    "longitudeCheckpoint": "-47.8445",
    "tituloRota": "Trilha do Patrimônio",
    "descricaoCheckPoint": "Construído em 1912, foi sede de uma empresa japonesa e hoje é símbolo da imigração no Vale do Ribeira."
    "imagemCheckpoint": "kkk_modelo.extensao"
}
```

##### Erro Interno do Servidor! 500
Caso essa resposta aconteça, significa que ocorreu um erro interno no servidor. Motivos podem incluir falhas na comunicação com o banco de dados.

Exemplo de resposta:
```
{
    "error": "Erro interno do servidor."
}
```


### - POST /checkpoint
Esse endpoint é responsável por cadastrar um novo checkpoint no banco de dados.

#### Parâmetros:
nomeCheckpont: Nome do Checkpoint.<br>
latitudeCheckpoint: Latitude do Checkpoint.<br>
longitudeCheckpoin: Longitude do Checkpoint.<br>
tituloRota: Título da Rota que o Checkpoint pertence.<br>
descricaoCheckpoint: Descrições do Checkpoint.<br>
imagemCheckpoint: Imagem para simbolizar o checkpoint.

Exemplo de requisição:
```
{
    "nomeCheckpoint": "Edifício K.K.K.K.",
    "latitudeCheckpoint": "-24.4880",
    "longitudeCheckpoint": "-47.8445",
    "tituloRota": "Trilha do Patrimônio",
    "descricaoCheckPoint": "Construído em 1912, foi sede de uma empresa japonesa e hoje é símbolo da imigração no Vale do Ribeira."
    "imagemCheckpoint": "kkk_modelo.extensao"
}
```

#### Respostas:
##### Criado! 201
Caso essa resposta aconteça, o novo jogo foi criado com sucesso.

Exemplo de resposta: Nenhum conteúdo retornado.

##### Erro Interno do Servidor! 500
Caso essa resposta aconteça, significa que ocorreu um erro interno no servidor.

Exemplo de resposta:
```
{
    "error": "Erro interno do servidor."
}
```

### - DELETE /checkpoint
Esse endpoint é responsável por deletar um checkpoint específico pelo seu ID.

#### Parâmetros:
id: ID do checkpoint a ser deletado.

#### Respostas:
##### Sem Conteúdo! 204
Caso essa resposta aconteça, o checkpoint foi deletado com sucesso e não há conteúdo para retornar.

Exemplo de resposta: Nenhum conteúdo retornado.

##### Requisição Inválida! 400
Caso essa resposta aconteça, significa que o ID fornecido é inválido.

Exemplo de resposta:
```
{
    "error": "A ID enviada é inválida. "
}
```

##### Erro Interno do Servidor! 500
Caso essa resposta aconteça, significa que ocorreu um erro interno no servidor.

Exemplo de resposta:

```
{
    "error": "Erro interno do servidor."
}
```

### - PUT /game/
Esse endpoint é responsável por atualizar as informações de um checkpoint específico pelo seu ID.

#### Parâmetros:
id: ID do checkpoint a ser atualizado.<br>
nomeCheckpont: Nome do Checkpoint.<br>
latitudeCheckpoint: Latitude do Checkpoint.<br>
longitudeCheckpoin: Longitude do Checkpoint.<br>
tituloRota: Título da Rota que o Checkpoint pertence.<br>
descricaoCheckpoint: Descrições do Checkpoint.

Exemplo de requisição:
```
{
    "nomeCheckpoint": "Edifício K.K.K.K. UPDATE",
    "latitudeCheckpoint": "-24.4880",
    "longitudeCheckpoint": "-47.8445",
    "tituloRota": "Trilha do Patrimônio",
    "descricaoCheckPoint": "Construído em 1912, foi sede de uma empresa japonesa e hoje é símbolo da imigração no Vale do Ribeira."
    "imagemCheckpoint": "kkk_modelo.extensao"
}
```

#### Respostas:
##### OK! 200
Caso essa resposta aconteça, as informações do jogo foram atualizadas com sucesso.

Exemplo de resposta:
```
{
    "nomeCheckpoint": "Edifício K.K.K.K.",
    "latitudeCheckpoint": "-24.4880",
    "longitudeCheckpoint": "-47.8445",
    "tituloRota": "Trilha do Patrimônio",
    "descricaoCheckPoint": "Construído em 1912, foi sede de uma empresa japonesa e hoje é símbolo da imigração no Vale do Ribeira."
    "imagemCheckpoint": "kkk_modelo.extensao"
}
```

##### Requisição Inválida! 400
Caso essa resposta aconteça, significa que o ID fornecido é inválido ou a requisição contém dados malformados.

##### Erro Interno do Servidor! 500
Caso essa resposta aconteça, significa que ocorreu um erro interno no servidor.

Exemplo de resposta:

```
{
    "error": "Erro interno do servidor. "
}
```
### - GET /checkpoint/
Esse endpoint é responsável por retornar as informações de um checkpoint específico pelo seu ID.

#### Parâmetros:
id: ID do checkpoint a ser consultado.

#### Respostas:
##### OK! 200
Caso essa resposta aconteça, você vai receber as informações do checkpoint solicitado.

Exemplo de resposta:
```
{
    "nomeCheckpoint": "Edifício K.K.K.K.",
    "latitudeCheckpoint": "-24.4880",
    "longitudeCheckpoint": "-47.8445",
    "tituloRota": "Trilha do Patrimônio",
    "descricaoCheckPoint": "Construído em 1912, foi sede de uma empresa japonesa e hoje é símbolo da imigração no Vale do Ribeira."
    "imagemCheckpoint": "kkk_modelo.extensao"
}
```

##### Não Encontrado! 404
Caso essa resposta aconteça, significa que o jogo com o ID fornecido não foi encontrado.

Exemplo de resposta:
```
{
    "error": "Checkpoint não encontrado. "
}
```
##### Requisição Inválida! 400
Caso essa resposta aconteça, significa que o ID fornecido é inválido.

Exemplo de resposta:

```
{
    "error": "A ID enviada é inválida. "
}
```

##### Erro Interno do Servidor! 500
Caso essa resposta aconteça, significa que ocorreu um erro interno no servidor.

Exemplo de resposta:

```
{
    "error": "Erro interno do servidor."
}
```
