# Test Cases — Permission Approval Workflow

---

## TC-01: Happy Path Approve

**Цель:** Проверить полный флоу submit → approve

**Шаги:**
1. POST submit-request (TEST-TC01-001, gelmelv@gmail.com)
2. Проверить: Request создан в DB, status=pending
3. Проверить: Email ушёл manager (am_us_...)
4. POST approve-request (TEST-TC01-001)
5. Проверить: status=approved
6. Проверить: GitHub API вызван (user добавлен в org)
7. Проверить: Email "Approved" ушёл requester

**Ожидание:**
- Request: pending → approved
- GitHub: user добавлен в Allpply org
- Email: 2 письма (manager, requester)

---

## TC-02: Happy Path Deny

**Цель:** Проверить полный флоу submit → deny

**Шаги:**
1. POST submit-request (TEST-TC02-001, am_us_660@agentmail.to)
2. Проверить: Request создан, status=pending
3. Проверить: Email ушёл manager
4. POST deny-request (TEST-TC02-001)
5. Проверить: status=denied
6. Проверить: GitHub API НЕ вызван
7. Проверить: Email "Denied" ушёл requester

**Ожидание:**
- Request: pending → denied
- GitHub: без изменений
- Email: 2 письма (manager, requester)

---

## TC-03: Idempotency — Double Approve

**Цель:** Проверить что второй approve ничего не делает

**Шаги:**
1. POST submit-request (TEST-TC03-001, am_us_987@agentmail.to)
2. Проверить: Request создан, status=pending
3. POST approve-request (TEST-TC03-001) — первый раз
4. Проверить: status=approved, GitHub API вызван
5. POST approve-request (TEST-TC03-001) — второй раз
6. Проверить: status остался approved, GitHub API НЕ вызван второй раз
7. Проверить: Только 1 email "Approved" ушёл

**Ожидание:**
- Первый approve: status=approved, GitHub API ✅
- Второй approve: без изменений, GitHub API ❌
- Email: только 1 "Approved"

---

## TC-04: Idempotency — Double Deny

**Цель:** Проверить что второй deny ничего не делает

**Шаги:**
1. POST submit-request (TEST-TC04-001, am_us_721@agentmail.to)
2. Проверить: Request создан, status=pending
3. POST deny-request (TEST-TC04-001) — первый раз
4. Проверить: status=denied, GitHub API НЕ вызван
5. POST deny-request (TEST-TC04-001) — второй раз
6. Проверить: status остался denied, без изменений
7. Проверить: Только 1 email "Denied" ушёл

**Ожидание:**
- Первый deny: status=denied ✅
- Второй deny: без изменений ✅
- Email: только 1 "Denied"

---

## TC-05: GitHub 404 Error

**Цель:** Проверить обработку когда user не найден в GitHub

**Шаги:**
1. POST submit-request (TEST-TC05-001, gelmelv@gmail.com)
2. Проверить: Request создан
3. POST approve-request (TEST-TC05-001)
4. Проверить: status=approved
5. Проверить: GitHub API вернул 404 (username not in org)
6. Проверить: Email "Approved, but GitHub setup failed" ушёл requester

**Ожидание:**
- Request: approved
- GitHub: 404 error returned
- Email: "Approved, but GitHub setup failed"

---

## TC-06: Non-existent Request ID

**Цель:** Проверить graceful handling несуществующего request

**Шаги:**
1. POST submit-request (TEST-TC06-001, am_us_660@agentmail.to)
2. Проверить: Request создан
3. POST approve-request (id=UNKNOWN-123) — несуществующий
4. Проверить: Нет ошибки системы, graceful handling
5. POST deny-request (id=UNKNOWN-456) — несуществующий
6. Проверить: Нет ошибки системы, graceful handling

**Ожидание:**
- Система: без ошибок
- Response: понятное сообщение или редирект

---

## TC-07: Manager Not Found

**Цель:** Проверить fallback когда manager email пустой

**Шаги:**
1. POST submit-request (TEST-TC07-001, unknown@test.com)
2. Проверить: Email не в managers.csv
3. Проверить: Request либо отклонён, либо ушёл fallback адресату

**Ожидание:**
- Либо: Request не создан
- Либо: Email ушёл fallback (IT/admin)

---

## Test Data CSV

```csv
action,requestId,requesterName,requesterEmail,resource,justification,testCase
submit-request,TEST-TC01-001,Wladimir Helm,gelmelv@gmail.com,GitHub Organization Access,TC-01 Happy path submit,TC-01-HAPPY
approve-request,TEST-TC01-001,N/A,N/A,N/A,N/A,TC-01-APPROVE
submit-request,TEST-TC02-001,Alice Agent,am_us_733289_1771706269570@agentmail.to,GitHub Organization Access,TC-02 Submit for deny,TC-02-DENY
deny-request,TEST-TC02-001,N/A,N/A,N/A,N/A,TC-02-DENY
submit-request,TEST-TC03-001,Bob Agent,am_us_733289_1771701590387@agentmail.to,GitHub Organization Access,TC-03 For double approve idempotency,TC-03-IDEM-APPROVE
approve-request,TEST-TC03-001,N/A,N/A,N/A,N/A,TC-03-IDEM-APPROVE-FIRST
approve-request,TEST-TC03-001,N/A,N/A,N/A,N/A,TC-03-IDEM-APPROVE-SECOND
submit-request,TEST-TC04-001,Charlie Agent,am_us_733289_1771700024721@agentmail.to,GitHub Organization Access,TC-04 For double deny idempotency,TC-04-IDEM-DENY
deny-request,TEST-TC04-001,N/A,N/A,N/A,N/A,TC-04-IDEM-DENY-FIRST
deny-request,TEST-TC04-001,N/A,N/A,N/A,N/A,TC-04-IDEM-DENY-SECOND
submit-request,TEST-TC05-001,Diana Agent,gelmelv@gmail.com,GitHub Organization Access,TC-05 GitHub 404 expected,TC-05-GITHUB-404
approve-request,TEST-TC05-001,N/A,N/A,N/A,N/A,TC-05-GITHUB-404
submit-request,TEST-TC06-001,Eve Agent,am_us_733289_1771706269570@agentmail.to,GitHub Organization Access,TC-06 Non-existent request test,TC-06-NONEXISTENT
approve-request,UNKNOWN-123,N/A,N/A,N/A,N/A,TC-06-NONEXISTENT-APPROVE
deny-request,UNKNOWN-456,N/A,N/A,N/A,N/A,TC-06-NONEXISTENT-DENY
submit-request,TEST-TC07-001,Frank Agent,unknown@test.com,GitHub Organization Access,TC-07 Manager not found test,TC-07-MGR-NOT-FOUND
```

---

## Coverage Matrix

| TC | Submit | Approve | Deny | GitHub API | Email |
|----|--------|---------|------|------------|-------|
| TC-01 | ✅ | ✅ | — | ✅ (success) | ✅ (2) |
| TC-02 | ✅ | — | ✅ | — | ✅ (2) |
| TC-03 | ✅ | ✅ (2x) | — | ✅ (1x) | ✅ (1) |
| TC-04 | ✅ | — | ✅ (2x) | — | ✅ (1) |
| TC-05 | ✅ | ✅ | — | 404 | ✅ |
| TC-06 | ✅ | ✅ | ✅ | — | — |
| TC-07 | ✅ | — | — | — | fallback |
