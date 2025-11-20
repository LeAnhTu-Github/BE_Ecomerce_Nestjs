/*
  Warnings:

  - The primary key for the `categories` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `parent_id` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `categories` table. All the data in the column will be lost.
  - The primary key for the `colors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `colors` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `colors` table. All the data in the column will be lost.
  - The primary key for the `products` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `is_published` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `main_image` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `store_id` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `products` table. All the data in the column will be lost.
  - The primary key for the `sizes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `sizes` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sizes` table. All the data in the column will be lost.
  - The primary key for the `stores` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `city_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `country_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `stores` table. All the data in the column will be lost.
  - You are about to drop the `cities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `colors_on_sizes_on_products` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_images` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[storeId,name]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,value]` on the table `colors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,name]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[storeId,value]` on the table `sizes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userId]` on the table `stores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `billboardId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `colors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `colors` table without a default value. This is not possible if the table is not empty.
  - Added the required column `colorId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sizeId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `categoryId` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `storeId` to the `sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `sizes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `stores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cities" DROP CONSTRAINT "cities_country_id_fkey";

-- DropForeignKey
ALTER TABLE "colors_on_sizes_on_products" DROP CONSTRAINT "colors_on_sizes_on_products_color_id_fkey";

-- DropForeignKey
ALTER TABLE "colors_on_sizes_on_products" DROP CONSTRAINT "colors_on_sizes_on_products_product_id_fkey";

-- DropForeignKey
ALTER TABLE "colors_on_sizes_on_products" DROP CONSTRAINT "colors_on_sizes_on_products_size_id_fkey";

-- DropForeignKey
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_product_id_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_store_id_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_city_id_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_country_id_fkey";

-- DropForeignKey
ALTER TABLE "stores" DROP CONSTRAINT "stores_user_id_fkey";

-- DropIndex
DROP INDEX "categories_name_key";

-- DropIndex
DROP INDEX "categories_slug_key";

-- DropIndex
DROP INDEX "products_slug_key";

-- DropIndex
DROP INDEX "stores_address_key";

-- DropIndex
DROP INDEX "stores_name_key";

-- DropIndex
DROP INDEX "stores_user_id_key";

-- AlterTable
ALTER TABLE "categories" DROP CONSTRAINT "categories_pkey",
DROP COLUMN "created_at",
DROP COLUMN "parent_id",
DROP COLUMN "slug",
DROP COLUMN "updated_at",
ADD COLUMN     "billboardId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "categories_id_seq";

-- AlterTable
ALTER TABLE "colors" DROP CONSTRAINT "colors_pkey",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "colors_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "colors_id_seq";

-- AlterTable
ALTER TABLE "products" DROP CONSTRAINT "products_pkey",
DROP COLUMN "created_at",
DROP COLUMN "discount",
DROP COLUMN "is_published",
DROP COLUMN "main_image",
DROP COLUMN "slug",
DROP COLUMN "store_id",
DROP COLUMN "title",
DROP COLUMN "updated_at",
ADD COLUMN     "colorId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "sizeId" TEXT NOT NULL,
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "categoryId" SET NOT NULL,
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "products_id_seq";

-- AlterTable
ALTER TABLE "sizes" DROP CONSTRAINT "sizes_pkey",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "storeId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "sizes_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "sizes_id_seq";

-- AlterTable
ALTER TABLE "stores" DROP CONSTRAINT "stores_pkey",
DROP COLUMN "city_id",
DROP COLUMN "country_id",
DROP COLUMN "created_at",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "logo" DROP NOT NULL,
ADD CONSTRAINT "stores_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "stores_id_seq";

-- DropTable
DROP TABLE "cities";

-- DropTable
DROP TABLE "colors_on_sizes_on_products";

-- DropTable
DROP TABLE "countries";

-- DropTable
DROP TABLE "product_images";

-- CreateTable
CREATE TABLE "billboards" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billboards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "userId" INTEGER,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "userId" INTEGER,
    "storeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_items" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "billboards_storeId_idx" ON "billboards"("storeId");

-- CreateIndex
CREATE INDEX "images_productId_idx" ON "images"("productId");

-- CreateIndex
CREATE INDEX "orders_storeId_idx" ON "orders"("storeId");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "orders_storeId_userId_idx" ON "orders"("storeId", "userId");

-- CreateIndex
CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");

-- CreateIndex
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");

-- CreateIndex
CREATE INDEX "carts_userId_idx" ON "carts"("userId");

-- CreateIndex
CREATE INDEX "carts_storeId_idx" ON "carts"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "carts_userId_storeId_key" ON "carts"("userId", "storeId");

-- CreateIndex
CREATE INDEX "cart_items_cartId_idx" ON "cart_items"("cartId");

-- CreateIndex
CREATE INDEX "cart_items_productId_idx" ON "cart_items"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_cartId_productId_key" ON "cart_items"("cartId", "productId");

-- CreateIndex
CREATE INDEX "categories_storeId_idx" ON "categories"("storeId");

-- CreateIndex
CREATE INDEX "categories_billboardId_idx" ON "categories"("billboardId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_storeId_name_key" ON "categories"("storeId", "name");

-- CreateIndex
CREATE INDEX "colors_storeId_idx" ON "colors"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "colors_storeId_value_key" ON "colors"("storeId", "value");

-- CreateIndex
CREATE INDEX "products_storeId_idx" ON "products"("storeId");

-- CreateIndex
CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");

-- CreateIndex
CREATE INDEX "products_sizeId_idx" ON "products"("sizeId");

-- CreateIndex
CREATE INDEX "products_colorId_idx" ON "products"("colorId");

-- CreateIndex
CREATE UNIQUE INDEX "products_storeId_name_key" ON "products"("storeId", "name");

-- CreateIndex
CREATE INDEX "sizes_storeId_idx" ON "sizes"("storeId");

-- CreateIndex
CREATE UNIQUE INDEX "sizes_storeId_value_key" ON "sizes"("storeId", "value");

-- CreateIndex
CREATE INDEX "stores_userId_idx" ON "stores"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "stores_name_userId_key" ON "stores"("name", "userId");

-- AddForeignKey
ALTER TABLE "stores" ADD CONSTRAINT "stores_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "billboards" ADD CONSTRAINT "billboards_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_billboardId_fkey" FOREIGN KEY ("billboardId") REFERENCES "billboards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "sizes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "colors_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "sizes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_colorId_fkey" FOREIGN KEY ("colorId") REFERENCES "colors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
