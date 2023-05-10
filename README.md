# AI Quant Assistant Commercial System

Assist your quantitative analysis by our AI quant assistant at affordable price

## Gallery

![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_home_page.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_category_page.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_category_page_management.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_product_page.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_product_page_management.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_cart_page.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_order_page.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_order_page_management.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_subscription_prediction.png)
![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/Gallery/frontend_web_profile_page.png)

## Features

- REST API
- CI/CD
- JWT authentication
- Password recovery
- Error handling
- Local storage based visitor's shopping cart
- Persistent customer's shopping cart
- Cart and order management
- Checkout
- Catalogue
- Order management
- Subscription management
- Pagination

## Technology Stacks

**BackEnd Forecast**

- Python 3.10
- Gunicorn WSGI HTTP Server
- Flask
- Numpy
- Pandas
- Scikit-learn
- Pytorch
- Yahoo Finance
- AutoTS
- FBProphet
- Neural Prophet

**BackEnd Store**

- Java 11
- Spring Boot 2.4
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven
- Spring Validation
- Lombok
- Swagger 2.9.2

**FrontEnd Web**

- Javascript
- Node.JS
- React 18.2
- React Router
- Bootstrap 5.2
- SCSS
- Redux
- Axios
- NGINX

**FrontEnd Android and iOS**

- Javascript
- Node.JS
- React Native 0.71
- Expo 48
- React Navigation
- React Native Paper
- React Native Reanimated
- React Native Gesture Handler
- Redux
- Redux-Thunk
- Axios

**Database**

- MySQL
- Firebase

**DevOps**

- Docker
- Docker Compose

## Database Schema

![](https://github.com/ghiffaryr/AIQuantAssistant/raw/main/docs/ERD/ERD.bmp)

## How to

### Build JAR with dependencies

1. Open IntelliJ IDEA.
2. Open backend_store project.
3. Click on Maven sidebar.
4. Block clean until verify lifecycle then Run Maven Build.

### Run in Docker

1. Start docker daemon.
2. Run docker compose.

```bash
docker-compose up --build
```

### Import SQL Dump

1. Connect MySQL Workbench to

```
Host = localhost
Port = 8036
Username = root
Password = Password1#
```

2. Import ai_store.sql

### Prepare FrontEnd Web Client

1. Open terminal from frontend_web_store
2. Install dependencies

```
npm install
```

### Prepare FrontEnd Expo Mobile Client

1. Open terminal from frontend_mobile_store
2. Install dependencies

```
npm install
```

3. Run apps

```
npm start
```
