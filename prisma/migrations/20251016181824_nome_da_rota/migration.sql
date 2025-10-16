/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `rotas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `rotas` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."rotas_origemId_destinoId_idx";

-- AlterTable
ALTER TABLE "rotas" ADD COLUMN     "nome" VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rotas_nome_key" ON "rotas"("nome");

-- CreateIndex
CREATE INDEX "rotas_nome_origemId_destinoId_idx" ON "rotas"("nome", "origemId", "destinoId");
