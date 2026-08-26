-- CreateTable
CREATE TABLE `BlogPost` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `excerpt` TEXT NOT NULL,
    `contentJson` JSON NOT NULL,
    `renderedHtml` LONGTEXT NOT NULL,
    `plainText` LONGTEXT NOT NULL,
    `tableOfContents` JSON NULL,
    `focusKeyword` VARCHAR(191) NULL,
    `metaTitle` VARCHAR(191) NULL,
    `metaDescription` VARCHAR(191) NULL,
    `canonicalUrl` VARCHAR(191) NULL,
    `ogTitle` VARCHAR(191) NULL,
    `ogDescription` VARCHAR(191) NULL,
    `ogImage` VARCHAR(191) NULL,
    `twitterTitle` VARCHAR(191) NULL,
    `twitterDescription` VARCHAR(191) NULL,
    `twitterImage` VARCHAR(191) NULL,
    `schemaType` ENUM('ARTICLE', 'BLOG_POSTING', 'FAQ_PAGE') NOT NULL DEFAULT 'ARTICLE',
    `featuredImageUrl` VARCHAR(191) NULL,
    `featuredImageAlt` VARCHAR(191) NULL,
    `tags` JSON NOT NULL,
    `categories` JSON NOT NULL,
    `faqItems` JSON NULL,
    `seoScore` INTEGER NOT NULL DEFAULT 0,
    `readabilityScore` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('DRAFT', 'PUBLISHED', 'ARCHIVED') NOT NULL DEFAULT 'DRAFT',
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `BlogPost_slug_key`(`slug`),
    INDEX `BlogPost_status_publishedAt_idx`(`status`, `publishedAt`),
    INDEX `BlogPost_slug_idx`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `kind` ENUM('LEAD', 'CONTACT') NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `company` VARCHAR(191) NULL,
    `budget` VARCHAR(191) NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ContactSubmission_kind_createdAt_idx`(`kind`, `createdAt`),
    INDEX `ContactSubmission_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `NewsletterSubscriber` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `source` VARCHAR(191) NOT NULL DEFAULT 'website',
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `NewsletterSubscriber_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentOrder` (
    `id` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `amountMinor` INTEGER NOT NULL,
    `subtotalMinor` INTEGER NULL,
    `discountMinor` INTEGER NOT NULL DEFAULT 0,
    `gstRate` DECIMAL(5, 2) NULL,
    `gstAmountMinor` INTEGER NOT NULL DEFAULT 0,
    `taxableAmountMinor` INTEGER NULL,
    `totalAmountMinor` INTEGER NULL,
    `currency` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `billingName` VARCHAR(191) NOT NULL,
    `billingEmail` VARCHAR(191) NOT NULL,
    `billingPhone` VARCHAR(191) NOT NULL,
    `billingAddress` TEXT NOT NULL,
    `billingCountry` VARCHAR(191) NULL,
    `billingState` VARCHAR(191) NULL,
    `billingGstin` VARCHAR(191) NULL,
    `billingCompany` VARCHAR(191) NULL,
    `couponCode` VARCHAR(191) NULL,
    `couponDiscountType` VARCHAR(191) NULL,
    `couponDiscountValue` DECIMAL(10, 2) NULL,
    `providerOrderId` VARCHAR(191) NULL,
    `providerPaymentId` VARCHAR(191) NULL,
    `providerSignature` VARCHAR(191) NULL,
    `receipt` VARCHAR(191) NOT NULL,
    `taxNote` TEXT NOT NULL,
    `taxLabel` VARCHAR(191) NULL,
    `notes` JSON NULL,
    `status` ENUM('CREATED', 'PAID', 'VERIFIED', 'FAILED') NOT NULL DEFAULT 'CREATED',
    `paidAt` DATETIME(3) NULL,
    `verifiedAt` DATETIME(3) NULL,
    `orderEmailSentAt` DATETIME(3) NULL,
    `paymentSuccessEmailSentAt` DATETIME(3) NULL,
    `paymentFailedEmailSentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `PaymentOrder_providerOrderId_key`(`providerOrderId`),
    UNIQUE INDEX `PaymentOrder_providerPaymentId_key`(`providerPaymentId`),
    UNIQUE INDEX `PaymentOrder_receipt_key`(`receipt`),
    INDEX `PaymentOrder_status_createdAt_idx`(`status`, `createdAt`),
    INDEX `PaymentOrder_billingEmail_idx`(`billingEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

