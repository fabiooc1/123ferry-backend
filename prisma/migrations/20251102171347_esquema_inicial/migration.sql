-- CreateEnum
CREATE TYPE "PerfilTypes" AS ENUM ('CLIENTE', 'ATENDENTE', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "PassagemStatus" AS ENUM ('RESERVADA', 'PAGA', 'CANCELADA');

-- CreateTable
CREATE TABLE "perfils" (
    "id" SERIAL NOT NULL,
    "nome" "PerfilTypes" NOT NULL DEFAULT 'CLIENTE',

    CONSTRAINT "perfils_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nomeCompleto" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "telefone" CHAR(15) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "senhaCriptografada" VARCHAR(255) NOT NULL,
    "registradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,
    "perfilId" INTEGER NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ferrys" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "maximoDePessoas" INTEGER NOT NULL,
    "maximoDeVeiculosEmM2" DECIMAL(10,2) NOT NULL,
    "registradoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ferrys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "portos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,

    CONSTRAINT "portos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rotas" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "origemId" INTEGER NOT NULL,
    "destinoId" INTEGER NOT NULL,

    CONSTRAINT "rotas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "viagens" (
    "id" SERIAL NOT NULL,
    "ferryId" INTEGER NOT NULL,
    "rotaId" INTEGER NOT NULL,
    "dataPartida" TIMESTAMP(3) NOT NULL,
    "dataChegada" TIMESTAMP(3) NOT NULL,
    "criadaPorId" INTEGER NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "viagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passagens" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(255) NOT NULL,
    "status" "PassagemStatus" NOT NULL DEFAULT 'RESERVADA',
    "adquiridaPorId" INTEGER NOT NULL,
    "viagemId" INTEGER NOT NULL,
    "reservadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pagaEm" TIMESTAMP(3),
    "canceladaEm" TIMESTAMP(3),
    "auditadaPorId" INTEGER,

    CONSTRAINT "passagens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_passageiro" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "precoEmCentavos" INTEGER NOT NULL,

    CONSTRAINT "tipos_passageiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passagem_passageiros" (
    "id" SERIAL NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "passagemId" INTEGER NOT NULL,
    "nomeCompleto" VARCHAR(100) NOT NULL,
    "cpf" CHAR(14) NOT NULL,
    "dataNascimento" DATE NOT NULL,
    "precoPagoEmCentavos" INTEGER,

    CONSTRAINT "passagem_passageiros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veiculos" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tamanhoEmM2" DECIMAL(10,2) NOT NULL,
    "precoPassagemEmCentavos" INTEGER NOT NULL,

    CONSTRAINT "veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "passagem_veiculos" (
    "id" SERIAL NOT NULL,
    "placa" VARCHAR(10) NOT NULL,
    "passagemId" INTEGER NOT NULL,
    "passageiroId" INTEGER NOT NULL,
    "veiculoId" INTEGER NOT NULL,
    "precoPagoEmCentavos" INTEGER,

    CONSTRAINT "passagem_veiculos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE INDEX "usuarios_nomeCompleto_idx" ON "usuarios"("nomeCompleto");

-- CreateIndex
CREATE UNIQUE INDEX "ferrys_nome_key" ON "ferrys"("nome");

-- CreateIndex
CREATE INDEX "ferrys_nome_idx" ON "ferrys"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "portos_nome_key" ON "portos"("nome");

-- CreateIndex
CREATE INDEX "portos_nome_idx" ON "portos"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "rotas_nome_key" ON "rotas"("nome");

-- CreateIndex
CREATE INDEX "rotas_nome_origemId_destinoId_idx" ON "rotas"("nome", "origemId", "destinoId");

-- CreateIndex
CREATE INDEX "viagens_ferryId_rotaId_dataPartida_dataChegada_idx" ON "viagens"("ferryId", "rotaId", "dataPartida", "dataChegada");

-- CreateIndex
CREATE UNIQUE INDEX "passagens_codigo_key" ON "passagens"("codigo");

-- CreateIndex
CREATE INDEX "passagens_adquiridaPorId_viagemId_idx" ON "passagens"("adquiridaPorId", "viagemId");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_passageiro_nome_key" ON "tipos_passageiro"("nome");

-- CreateIndex
CREATE INDEX "tipos_passageiro_nome_idx" ON "tipos_passageiro"("nome");

-- CreateIndex
CREATE INDEX "passagem_passageiros_tipoId_passagemId_nomeCompleto_cpf_idx" ON "passagem_passageiros"("tipoId", "passagemId", "nomeCompleto", "cpf");

-- CreateIndex
CREATE UNIQUE INDEX "veiculos_nome_key" ON "veiculos"("nome");

-- CreateIndex
CREATE INDEX "veiculos_nome_idx" ON "veiculos"("nome");

-- CreateIndex
CREATE INDEX "passagem_veiculos_passagemId_veiculoId_passageiroId_idx" ON "passagem_veiculos"("passagemId", "veiculoId", "passageiroId");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_perfilId_fkey" FOREIGN KEY ("perfilId") REFERENCES "perfils"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotas" ADD CONSTRAINT "rotas_origemId_fkey" FOREIGN KEY ("origemId") REFERENCES "portos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rotas" ADD CONSTRAINT "rotas_destinoId_fkey" FOREIGN KEY ("destinoId") REFERENCES "portos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_ferryId_fkey" FOREIGN KEY ("ferryId") REFERENCES "ferrys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_rotaId_fkey" FOREIGN KEY ("rotaId") REFERENCES "rotas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "viagens" ADD CONSTRAINT "viagens_criadaPorId_fkey" FOREIGN KEY ("criadaPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagens" ADD CONSTRAINT "passagens_adquiridaPorId_fkey" FOREIGN KEY ("adquiridaPorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagens" ADD CONSTRAINT "passagens_viagemId_fkey" FOREIGN KEY ("viagemId") REFERENCES "viagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagens" ADD CONSTRAINT "passagens_auditadaPorId_fkey" FOREIGN KEY ("auditadaPorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_passageiros" ADD CONSTRAINT "passagem_passageiros_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipos_passageiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_passageiros" ADD CONSTRAINT "passagem_passageiros_passagemId_fkey" FOREIGN KEY ("passagemId") REFERENCES "passagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_veiculos" ADD CONSTRAINT "passagem_veiculos_passagemId_fkey" FOREIGN KEY ("passagemId") REFERENCES "passagens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_veiculos" ADD CONSTRAINT "passagem_veiculos_veiculoId_fkey" FOREIGN KEY ("veiculoId") REFERENCES "veiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_veiculos" ADD CONSTRAINT "passagem_veiculos_passageiroId_fkey" FOREIGN KEY ("passageiroId") REFERENCES "passagem_passageiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
