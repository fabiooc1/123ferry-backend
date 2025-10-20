/*
  Warnings:

  - You are about to drop the column `valorPagoEmCentavos` on the `passagem_passageiros` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "passagem_passageiros" DROP COLUMN "valorPagoEmCentavos",
ADD COLUMN     "precoPagoEmCentavos" BIGINT;

-- AlterTable
ALTER TABLE "passagem_veiculos" ADD COLUMN     "precoPagoEmCentavos" BIGINT;
