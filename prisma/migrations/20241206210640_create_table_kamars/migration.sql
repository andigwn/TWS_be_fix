-- CreateTable
CREATE TABLE `kamars` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nomor_kamar` VARCHAR(100) NOT NULL,
    `harga` INTEGER NOT NULL,
    `fasilitas` VARCHAR(100) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `kos_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `kamars` ADD CONSTRAINT `kamars_kos_id_fkey` FOREIGN KEY (`kos_id`) REFERENCES `kos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
