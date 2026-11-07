# Lumiq TV — Phase 0 Security Specification (Payload-First Security TDD)

## 1. Data Invariants
1. **Default-Deny Catch-All**: All unspecified paths are denied (`allow read, write: if false;`).
2. **PII Isolation**: `/profiles/{userId}`, `/orders/{orderId}`, `/trial_requests/{trialId}`, and `/support_requests/{ticketId}` contain PII (`email` / `customerEmail`) and can only be read by the document owner (`resource.data.userId == request.auth.uid` or `userId == request.auth.uid`) or a verified Admin (`isAdmin()`).
3. **Price & Status Integrity on Order Creation**: Customers creating an order in `/orders/{orderId}` MUST set `orderStatus == 'Pending'`, `paymentStatus == 'Awaiting Payment'` or `'Payment Under Review'`, `subscriptionStatus == 'Pending'`, `currency == 'USD'`, and a valid confirmed catalog `amountCents` (`1000`, `2000`, `3000`, `5000`, `9000`, `12000`, `14000`). Customers cannot mark their own order as `'Paid'` or `'Active'`.
4. **Trial Duration Invariant**: Customers creating a `/trial_requests/{trialId}` document MUST set `durationHours == 4` and `status == 'Pending'`.
5. **Immutable Audit Logs**: `/admin_audit_logs/{logId}` can only be created and read by `isAdmin()`, and can never be updated or deleted.
6. **Temporal Integrity**: All `createdAt` and `updatedAt` timestamps must equal `request.time`.

## 2. The "Dirty Dozen" Payloads (Designed to Break Identity, Integrity, and State)
1. **Identity Spoofing on Order Creation**: Authenticated user `uid_attacker` creates an order with `userId: "uid_victim"`. -> `PERMISSION_DENIED`
2. **Self-Activated Subscription on Order Creation**: Customer creates an order with `paymentStatus: "Paid"` and `subscriptionStatus: "Active"`. -> `PERMISSION_DENIED`
3. **Price Tampering on Order Creation**: Customer creates a 12-month order with `amountCents: 100` ($1.00 instead of confirmed catalog price). -> `PERMISSION_DENIED`
4. **Shadow Field Injection on Profile Update**: User updates `/profiles/uid_1` with an extra unauthorized field `isAdmin: true`. -> `PERMISSION_DENIED`
5. **Unverified Email Spoofing for Admin Access**: Attacker token has `email: "getleasecheck@gmail.com"` but `email_verified: false`. -> `PERMISSION_DENIED`
6. **Cross-Tenant Order Scraping (`list`)**: Authenticated non-admin user queries `/orders` without filtering by their own `userId`. -> `PERMISSION_DENIED`
7. **ID Poisoning Attack**: Attacker attempts to create a document with a 500-character ID or special characters (`../admin`). -> `PERMISSION_DENIED`
8. **Terminal State Mutation by Customer**: Customer attempts to update an order after it is `'Cancelled'` or `'Active'` to change `amountCents` or `paymentStatus`. -> `PERMISSION_DENIED`
9. **Trial Duration Escalation**: Customer submits a trial request with `durationHours: 72` instead of `4`. -> `PERMISSION_DENIED`
10. **Client Timestamp Forgery**: Customer sends `createdAt` in the past or future (`request.time - duration.value(1, 'd')`). -> `PERMISSION_DENIED`
11. **Unauthorized CMS Publication**: Non-admin user attempts to create or update `/articles/{articleId}`. -> `PERMISSION_DENIED`
12. **Audit Log Tampering**: Admin or user attempts to `update` or `delete` an existing `/admin_audit_logs/{logId}` entry. -> `PERMISSION_DENIED`
