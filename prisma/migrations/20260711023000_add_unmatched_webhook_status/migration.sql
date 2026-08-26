-- Valid signed events without a local order are finalised for later reconciliation.
ALTER TABLE `RazorpayWebhookEvent`
  MODIFY `status` ENUM('PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED', 'UNMATCHED') NOT NULL DEFAULT 'PROCESSING';
