# train_seat
Web Application: 

Online seat booking system for Sri-Lanka most popular train route Colombo-> Ella

Backlog
  https://swelikotuwa-1780299583842.atlassian.net/jira/software/projects/TS/boards/34/backlog?selectedIssue=TS-2&atlOrigin=eyJpIjoiMzM4ZGNmYzQ4MWQyNDI2ZWJiOTNmZGVjM2Y0MGFiYjUiLCJwIjoiaiJ9

Build setup
  - Clone repo
  - Up mySQL server in local machine
  - Create .env same as .env.example and fill it
  - In root folder hit command : docker compose up --build
  
---------------------------------------------------
1. Back-end

1.1.Choosed spring boot as backend framwork   
  - Built in support for concurrency and transaction
  - Handles complex logics , heavy load 
  - Scalability

1.2.Why monolith

1.3.Why monolith over microservices

1.4. Libraries
  - Spring Security - for JWT Auth
  - Lombok - Reduce Boilerplate codes
  - Flyway - minimize migration workload
  - 

---------------------------------------------------
2.Front-end

2.1. Why nextJS

2.2. Three layers
- UI (pages + components)
          ↓ user clicks / types
  Services (business rules)
          ↓ calls
  API layer (Axios + error handling)

2.3.Libraries
  - Redux-toolkit - state management
  - Axios - network calls

---------------------------------------------------
3.RDBMS
  - Planned to use RDS in production

3.1.Why mySQl not mongoDB
  - Most of the data can store structured way

3.2.EER
  - https://www.figma.com/board/gF6ymVRoJtJK7uarVWjtK0/Entity-relationship--ER--Diagram--Community-?      node-id=303-741&t=noQg0OhxDkVo5KBG-1

---------------------------------------------------
4.Containerizing
4.1.
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
