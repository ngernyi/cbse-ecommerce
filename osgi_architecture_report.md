# OSGi E-Commerce Migration: Architecture & Implementation Report

## 1. Executive Summary
This project involves the migration of a legacy Spring Boot monolithic e-commerce application to a modular, service-oriented architecture using **OSGi (Open Services Gateway initiative)**. The target runtime is **Apache Karaf**, a robust OSGi container. Additional modernizing steps include replacing JPA with raw JDBC for performance/control and decoupling the frontend using **React**.

## 2. Architectural Philosophy: Monolith to Modular

### Legacy Monolith
- **Structure**: Single JAR/WAR file containing all logic (Customer, Order, Catalog).
- **Coupling**: High coupling between components; changing one requires redeploying everything.
- **Dependency Management**: "Classpath Hell" where libraries conflict globally.

### New OSGi Architecture
- **Structure**: Application split into discrete **Bundles** (JARs).
- **Decoupling**: Modules interact strictly via defined **Interfaces** in the `api` bundle.
- **Dynamic Lifecycle**: Bundles can be installed, started, stopped, or updated individually without restarting the entire system (Hot Deployment).
- **Isolation**: Each bundle has its own classloader, resolving dependency conflicts.

## 3. System Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend Layer"
        ReactApp[React Frontend (Single Page App)]
        WAB[Frontend Web Bundle /shop]
    end

    subgraph "API Layer (Contracts)"
        API[API Bundle (Interfaces & Models)]
    end

    subgraph "Service Layer (Business Logic)"
        CustImpl[Customer Impl]
        CatImpl[Catalog Impl]
        CartImpl[Cart Impl]
        OrdImpl[Order Impl]
    end

    subgraph "REST Layer (Exposure)"
        CustRest[Customer REST]
        CatRest[Catalog REST]
        CartRest[Cart REST]
        OrdRest[Order REST]
    end

    subgraph "Data Layer"
        DB[(H2 / MySQL Database)]
    end

    %% Relationships
    ReactApp -->|HTTP/REST| CustRest
    ReactApp -->|HTTP/REST| CatRest
    ReactApp -->|HTTP/REST| CartRest

    CustRest -->|OSGi Service| CustImpl
    CatRest -->|OSGi Service| CatImpl
    CartRest -->|OSGi Service| CartImpl

    CustImpl -.->|Implements| API
    CatImpl -.->|Implements| API
    CartImpl -.->|Implements| API

    CustImpl -->|JDBC| DB
    CatImpl -->|JDBC| DB
```

## 4. Key OSGi Concepts Applied

### 4.1. Bundles
The foundational unit of OSGi. Each Maven module in our project becomes a bundle.
- **`osgi-ecommerce`**: Parent project managing build configuration.
- **`api`**: The "Common Language". Exports packages containing Service Interfaces and POJOs. **Does not depend on implementation.**
- **`*-impl`**: internals. Hides implementation details (`private` packages). uses `Import-Package` to consume API.
- **`*-rest`**: The "Adapter". Consumes OSGi services and exposes them as JAX-RS (REST) endpoints.

### 4.2. OSGi Services & Blueprint
We use **Blueprint** (dependency injection for OSGi) to wire components.
- **Registration**: Implementation bundles (`*-impl`) register their classes as services in the **OSGi Service Registry**.
  ```xml
  <service ref="customerServiceImpl" interface="com.mycompany.ecommerce.api.CustomerService" />
  ```
- **Consumption**: REST bundles look up these services dynamically.
  ```xml
  <reference id="customerService" interface="com.mycompany.ecommerce.api.CustomerService" />
  ```
This serves as a dynamic link. If the implementation changes (e.g., v1.0 to v2.0), the REST layer automatically binds to the new version.

### 4.3. Classloading Isolation
Each bundle specifies exactly what it exports (shares) and imports (requires) in its `MANIFEST.MF`. This prevents leaked implementation details.

## 5. Technology Stack

| Component | Technology | Role |
|-----------|------------|------|
| **Runtime** | Apache Karaf 4.x | OSGi Container & Console |
| **Framework** | OSGi R6 | Modular Standard |
| **DI** | Aries Blueprint | Service Wiring & Injection |
| **REST** | Apache CXF (JAX-RS) | REST API Implementation |
| **Database** | H2 (Dev) / MySQL (Prod) | Relational Data Storage |
| **Persistence** | JDBC (Java SQL) | Low-level, high-performance data access |
| **Frontend** | React + Vite | Modern Dynamic UI |
| **Serving** | OSGi WAB (Web Application Bundle) | Serving static frontend assets |

## 6. Detailed Module Breakdown

### 6.1. API Bundle
- **Role**: Pure contracts.
- **Content**: `CustomerService.java`, `Product.java`, `CartItem.java`.
- **Note**: POJOs are stripped of JPA/Hibernate annotations to ensure the API is independent of the persistence layer.

### 6.2. Implementation Bundles
- **Role**: The "Brains".
- **Logic**: 
    - **Customer**: JDBC logic for login, registration.
    - **Catalog**: Search queries using SQL `LIKE`.
    - **Cart**: Managing cart state in DB table.
- **Persistence**: Uses `javax.sql.DataSource` injected by Karaf's Pax JDBC features.

### 6.3. REST Bundles
- **Role**: The "Mouth".
- **Logic**: Uses JAX-RS annotations (`@GET`, `@POST`, `@Path`) to map HTTP requests to Java methods.
- **Format**: Produces and Consumes JSON.

### 6.4. Frontend Bundle (`frontend-web`)
- **Type**: Web Application Bundle (WAB).
- **Role**: Serves the compiled React files (`index.html`, `js`, `css`) via Karaf's HTTP Service (Pax Web).
- **Context**: Accessible at `http://localhost:8181/shop`.

## 7. Deployment Strategy

The project uses a `features.xml` repository file. This acts as a catalog of our application.
- **One-click Deploy**: `feature:install ecommerce-all` installs all bundles, database drivers, and the frontend in the correct order.
- **Repo Refresh**: `feature:repo-refresh` allows updating the catalog without restarting Karaf.

## 8. Conclusion
The new architecture successfully decouples the frontend from the backend and splits the backend into independent, maintainable modules. This "Separation of Concerns" allows different teams to work on different modules (e.g., Catalog vs. Checkout) simultaneously, creating a scalable foundation for future growth.
