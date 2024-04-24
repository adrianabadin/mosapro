-- CreateTable
CREATE TABLE `Formulario` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `driveId` LONGTEXT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `date` VARCHAR(191) NULL,
    `description` LONGTEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
