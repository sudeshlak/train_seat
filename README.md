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
  - Lombok - Reduce Repeating codes
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
  - Redux-toolkit - State management
  - Axios - Simplify handling network calls, errors

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


in booking page - should be private
1.grab routeId from url
fetch endpoint get - /route/{routeId}
{
  "trainName": "Express 101",
  "departureTime": "2026-08-05T08:00:00Z",
  "stopOrder": [
    {
      order:0
      station:{
        id
        name
      }
    },
    {
      order:2
      station:{
        id
        name
      }
    }
  ]
}

display train and route details in top

need form with 3 fields
1.from dropdown - select from stop order
2.to dropdown - can select only order high station
3.date - future date only.if current time > departure time today available
all fields should be filled to available submit
click on "check for seats"

fetch Post /seats
{
  routeId,
  from stationId
  to stationId
  selected date
}
response
validation error 
{
  routeId:error
  from:error
  to:error
  date:error
}

success-only seats available for users Journey 
[
  {
    seat:{
      id
      number
    }
    coach:{
      id:
      number
    }
    classType{
      id:
      name:
    }
  }
]

priview as train and coach in screen 
use defferent color for defferent classes
categorize them in coach



