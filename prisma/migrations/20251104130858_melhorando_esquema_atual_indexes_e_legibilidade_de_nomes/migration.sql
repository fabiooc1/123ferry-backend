/*
  Warnings:

  - You are about to drop the column `passageiroId` on the `passagem_veiculos` table. All the data in the column will be lost.
  - You are about to drop the column `veiculoId` on the `passagem_veiculos` table. All the data in the column will be lost.
  - You are about to drop the `veiculos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[origemId,destinoId]` on the table `rotas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `motoristaId` to the `passagem_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `veiculoCategoriaId` to the `passagem_veiculos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `portos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."passagem_veiculos" DROP CONSTRAINT "passagem_veiculos_passageiroId_fkey";

-- DropForeignKey
ALTER TABLE "public"."passagem_veiculos" DROP CONSTRAINT "passagem_veiculos_veiculoId_fkey";

-- DropIndex
DROP INDEX "public"."passagem_veiculos_passagemId_veiculoId_passageiroId_idx";

-- DropIndex
DROP INDEX "public"."portos_nome_idx";

-- AlterTable
ALTER TABLE "passagem_veiculos" DROP COLUMN "passageiroId",
DROP COLUMN "veiculoId",
ADD COLUMN     "motoristaId" INTEGER NOT NULL,
ADD COLUMN     "veiculoCategoriaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "portos" ADD COLUMN     "cidade" VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE "public"."veiculos";

-- CreateTable
CREATE TABLE "veiculo_categoria" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "tamanhoEmM2" DECIMAL(10,2) NOT NULL,
    "precoPassagemEmCentavos" INTEGER NOT NULL,

    CONSTRAINT "veiculo_categoria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "veiculo_categoria_nome_key" ON "veiculo_categoria"("nome");

-- CreateIndex
CREATE INDEX "veiculo_categoria_nome_idx" ON "veiculo_categoria"("nome");

-- CreateIndex
CREATE INDEX "passagem_veiculos_passagemId_veiculoCategoriaId_motoristaId_idx" ON "passagem_veiculos"("passagemId", "veiculoCategoriaId", "motoristaId");

-- CreateIndex
CREATE INDEX "portos_nome_cidade_idx" ON "portos"("nome", "cidade");

-- CreateIndex
CREATE UNIQUE INDEX "rotas_origemId_destinoId_key" ON "rotas"("origemId", "destinoId");

-- AddForeignKey
ALTER TABLE "passagem_veiculos" ADD CONSTRAINT "passagem_veiculos_veiculoCategoriaId_fkey" FOREIGN KEY ("veiculoCategoriaId") REFERENCES "veiculo_categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "passagem_veiculos" ADD CONSTRAINT "passagem_veiculos_motoristaId_fkey" FOREIGN KEY ("motoristaId") REFERENCES "passagem_passageiros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
