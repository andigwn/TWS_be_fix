-- CreateTable
CREATE TABLE `kos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_kos` VARCHAR(100) NOT NULL,
    `pemilik_kos` VARCHAR(100) NOT NULL,
    `alamat_kos` VARCHAR(255) NOT NULL,
    `description` VARCHAR(191) NULL,
    `image` VARCHAR(191) NOT NULL,
    `username` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE InnoDB;

-- AddForeignKey
ALTER TABLE `kos` ADD CONSTRAINT `kos_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;
