-- Additive production-safety migration. Existing records are preserved.
ALTER TABLE `NewsletterSubscriber`
  ADD COLUMN `consentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  ADD COLUMN `unsubscribedAt` DATETIME(3) NULL;

ALTER TABLE `PaymentOrder`
  ADD COLUMN `idempotencyKey` VARCHAR(191) NULL,
  ADD COLUMN `requestHash` VARCHAR(191) NULL,
  ADD COLUMN `providerCreateStatus` ENUM('PENDING', 'CREATING', 'CREATED', 'FAILED') NOT NULL DEFAULT 'CREATED',
  ADD COLUMN `providerCreateAttempts` INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN `providerCreateError` TEXT NULL;

CREATE UNIQUE INDEX `PaymentOrder_idempotencyKey_key` ON `PaymentOrder`(`idempotencyKey`);

CREATE TABLE `PaymentAttempt` (
  `id` VARCHAR(191) NOT NULL,
  `paymentOrderId` VARCHAR(191) NOT NULL,
  `provider` VARCHAR(191) NOT NULL DEFAULT 'razorpay',
  `providerOrderId` VARCHAR(191) NOT NULL,
  `providerPaymentId` VARCHAR(191) NOT NULL,
  `providerSignature` VARCHAR(191) NULL,
  `amountMinor` INTEGER NOT NULL,
  `currency` VARCHAR(191) NOT NULL,
  `status` ENUM('AUTHORIZED', 'CAPTURED', 'FAILED') NOT NULL,
  `failureCode` VARCHAR(191) NULL,
  `failureReason` TEXT NULL,
  `paidAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `PaymentAttempt_providerPaymentId_key`(`providerPaymentId`),
  INDEX `PaymentAttempt_paymentOrderId_createdAt_idx`(`paymentOrderId`, `createdAt`),
  INDEX `PaymentAttempt_provider_providerOrderId_idx`(`provider`, `providerOrderId`),
  PRIMARY KEY (`id`),
  CONSTRAINT `PaymentAttempt_paymentOrderId_fkey` FOREIGN KEY (`paymentOrderId`) REFERENCES `PaymentOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO `PaymentAttempt` (
  `id`, `paymentOrderId`, `provider`, `providerOrderId`, `providerPaymentId`,
  `providerSignature`, `amountMinor`, `currency`, `status`, `paidAt`, `createdAt`, `updatedAt`
)
SELECT
  CONCAT('legacy_', `id`), `id`, 'razorpay', `providerOrderId`, `providerPaymentId`,
  `providerSignature`, COALESCE(`totalAmountMinor`, `amountMinor`), `currency`,
  CASE WHEN `status` IN ('PAID', 'VERIFIED') THEN 'CAPTURED' ELSE 'FAILED' END,
  `paidAt`, `createdAt`, `updatedAt`
FROM `PaymentOrder`
WHERE `providerOrderId` IS NOT NULL AND `providerPaymentId` IS NOT NULL;

ALTER TABLE `RazorpayWebhookEvent`
  ADD COLUMN `provider` VARCHAR(191) NOT NULL DEFAULT 'razorpay',
  ADD COLUMN `payloadHash` VARCHAR(191) NULL,
  ADD COLUMN `attemptCount` INTEGER NOT NULL DEFAULT 1,
  MODIFY `payload` JSON NULL;

CREATE UNIQUE INDEX `RazorpayWebhookEvent_provider_eventId_key` ON `RazorpayWebhookEvent`(`provider`, `eventId`);

CREATE TABLE `EmailOutbox` (
  `id` VARCHAR(191) NOT NULL,
  `deduplicationKey` VARCHAR(191) NOT NULL,
  `template` VARCHAR(191) NOT NULL,
  `recipientType` VARCHAR(191) NOT NULL,
  `recipient` VARCHAR(191) NOT NULL,
  `subject` VARCHAR(191) NOT NULL,
  `payloadJson` JSON NOT NULL,
  `status` ENUM('PENDING', 'PROCESSING', 'SENT', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `attemptCount` INTEGER NOT NULL DEFAULT 0,
  `availableAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `lockedAt` DATETIME(3) NULL,
  `sentAt` DATETIME(3) NULL,
  `lastError` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `EmailOutbox_deduplicationKey_key`(`deduplicationKey`),
  INDEX `EmailOutbox_status_availableAt_idx`(`status`, `availableAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `AdminSession` (
  `id` VARCHAR(191) NOT NULL,
  `tokenHash` VARCHAR(191) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `lastUsedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `revokedAt` DATETIME(3) NULL,
  `ipAddress` VARCHAR(191) NULL,
  `userAgent` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `AdminSession_tokenHash_key`(`tokenHash`),
  INDEX `AdminSession_expiresAt_revokedAt_idx`(`expiresAt`, `revokedAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `RateLimitBucket` (
  `key` VARCHAR(191) NOT NULL,
  `count` INTEGER NOT NULL DEFAULT 0,
  `windowStart` DATETIME(3) NOT NULL,
  `expiresAt` DATETIME(3) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  INDEX `RateLimitBucket_expiresAt_idx`(`expiresAt`),
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
