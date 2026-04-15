# Quick Start — Self-Service Permission Portal

## 1. Запустить Mock API

```bash
cd self-service-portal
node n8n/mock-api-server.js
```
Ожидаем: `Mock API Server running on port 3000`

---

## 2. Запустить Approval Server (новый terminal)

```bash
cd self-service-portal
node n8n/approval-server.js
```
Ожидаем: `Permission Approval Server running on port 8080`

---

## 3. Открыть Frontend

Открой в браузере:
```
self-service-portal/frontend/index.html
```

---

## 4. Заполнить форму

1. **Resource**: Выбери что-нибудь из dropdown
2. **Justification**: Напиши "Test request"
3. **Submit**

---

## 5. Проверить Terminals

**Mock API** покажет:
```
GET /api/manager/employee@company.com
```

**Approval Server** покажет:
```
NEW REQUEST: REQ-XXXXX
From: John Doe (employee@company.com)
Resource: Analytics Software License
```

---

## 6. Симулировать Approval

В браузере открой:
```
http://localhost:8080/approve?id=REQ-XXXXX
```
(подставь реальный ID из шага 4)

---

## 7. Проверить результат

Approval Server покажет:
```
APPROVAL: Provisioning access for request: REQ-XXXXX
...
NOTIFICATION: Sending email to employee@company.com
```

---

## 8. Симулировать Deny (опционально)

Отправь новый request и открой:
```
http://localhost:8080/deny?id=REQ-YYYYY
```

---

## Стоп/Рестарт

Просто Ctrl+C в каждом terminal и перезапусти.

---

## Проверить N8N workflow (опционально)

Если хочешь видеть workflow в действии:

1. Открой https://n8n-production-d20d.up.railway.app
2. Активируй "Permission Approval Workflow"
3. Submit форму — увидишь execution в N8N

---

## Troubleshooting

| Проблема | Решение |
|----------|---------|
| `localhost:5678` connection failed | N8N workflow не активирован или не на Railway |
| Форма не отправляется | Проверь что approval-server запущен |
| Request ID not found | Скопируй точный ID из terminal |

---

## Быстрая очистка

Approval Server держит requests в памяти. При рестарте — всё стирается.