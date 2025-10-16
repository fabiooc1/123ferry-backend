/*
  Warnings:

  - Added the required column `atualizadaEm` to the `viagens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "viagens" ADD COLUMN     "atualizadaEm" TIMESTAMP(3) NOT NULL;
