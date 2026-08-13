# train_seat
Web Application: 

Online seat booking system for Sri Lanka's most popular train route Colombo -> Ella

Backlog
  https://swelikotuwa-1780299583842.atlassian.net/jira/software/projects/TS/boards/34/backlog?selectedIssue=TS-2&atlOrigin=eyJpIjoiMzM4ZGNmYzQ4MWQyNDI2ZWJiOTNmZGVjM2Y0MGFiYjUiLCJwIjoiaiJ9

Build setup
  - Clone repo
  - Up MySQL server on local machine
  - Create .env same as .env.example and fill it
  - From the repo root: `./start.sh`
    (starts BE, waits until :8080 is ready, SSG-builds FE, then starts FE)
  - App: http://localhost:3000  API: http://localhost:8080
  - If Flyway migrations were rewritten (schema/seed change), reset the DB first:
    `docker compose down -v` then `./start.sh`
    (or drop/recreate the MySQL `train_seat` database) 
---------------------------------------------------
1. Back-end

1.1.Chose Spring Boot as backend framework   
  - Built-in support for concurrency and transactions
  - Handles complex logic, heavy load 
  - Scalability

1.2.Why monolith over microservices - planned to move in future - if need service like payments better integrate it as microservice

1.3. Libraries
  - Spring Security - for JWT Auth
  - Lombok - Reduce repeating code
  - Flyway - minimize migration workload
  - Spring Data JPA / Hibernate - ORM
  - springdoc OpenAPI - Swagger UI
  - MySQL driver - database connectivity

---------------------------------------------------
2.Front-end

2.1. Why Next.js
  - App Router and React for the web UI
  - Good tooling and easy to run next to the API

2.2. Three layers

```text
UI (pages + components)
        ↓ user clicks / types
Services (business rules)
        ↓ calls
API layer (Axios + error handling)
```

2.3.At first I tried to add extra layer "viewModel" to handle state updates but when it was added it didn't help to explain component behavior.
So I removed it

2.4.Libraries
  - Redux Toolkit - State management
  - Axios - Simplify handling network calls, errors
  - Tailwind - lightweight and can add inline classes

2.5. Tried to do Error handling retry option when connection error - not included


---------------------------------------------------
3.RDBMS
  - Planned to use RDS in production

3.1.Why MySQL not MongoDB
  - Most of the data can be stored in a structured way

3.2.EER
  - https://www.figma.com/board/gF6ymVRoJtJK7uarVWjtK0/Entity-relationship--ER--Diagram--Community-?node-id=303-741&t=noQg0OhxDkVo5KBG-1

---------------------------------------------------
4.Containerizing
4.1. To up app with simple command (`./start.sh` — BE must be reachable on host :8080 before FE SSG build)

```text
train_seat/
├── docker-compose.yml
├── .env                 # gitignored — secrets
├── .env.example         # committed — template
├── be/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/main/resources/application.yaml
└── fe/
    ├── Dockerfile
    ├── .dockerignore
    └── ...
```

---------------------------------------------------
5.Challenges

5.1.Prices calculation
  Assume route is a->b->c
  price a->c < price(a->b) + price(b->c)
  Cannot calculate price based on km because prices depend on the route(price 1km in mountain area > price 1km in flat area)
  Price varies with class(1st class > 2nd class)

  So added table called "fare".

| journey | price | class |
|---------|-------|-------|
| a->b    | 10    | 1     |
| a->c    | 15    | 1     |
| b->c    | 12    | 1     |
| a->b    | 15    | 2     |
| a->c    | 20    | 2     |
| b->c    | 17    | 2     |

5.2. Store station order
  When considering train route there are stops but there is an order. Simply cannot add relationship with train station. So added extra table called "StopOrder". Helped to search available seats for chosen journey

  Assume route -> a->b->c

| station | order |
|---------|-------|
| a       | 0     |
| b       | 1     |
| c       | 3     |

5.3. Price and currency
  For simplicity kept price as decimal number. But I think it should be stored along with currency type(ex:LKR)

5.4. Thought about scenario
  route a->b->c->d
  b->c all the seats are booked
  passenger searching seat for a->d
  Do need to show available seats a->b or c->d for user?
  If passenger can book seats like that what should be the price?
    How passenger travel b->c.?
  So I went with if there is no seat for full journey passenger searched. Not preview break/dotted seat plans

5.5. Cancellations - not included in current development
  What if passenger need to cancel. I think there should be cancellation policy
  ex: Can cancel and refund only before 6 hrs before journey. There should be reasonable time to new passenger to do booking

  I thought about feature if there is no available seat user can set notify for chosen journey
  ex: Notify me if one seat available a->b 
  if booking cancelled can notify that user via email. there is a opening for seat

5.6.What if prices changed after booked. 
  So I stored the current price in the booking table. So system know what was the price when user booked

5.7.What if 2 users booked same seat same time.
  Who get chance. How  resolved
  Used transaction + lock on the seat. First successful booking wins. Second user gets conflict (seat no longer available).
