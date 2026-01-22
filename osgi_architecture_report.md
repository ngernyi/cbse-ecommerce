# OSGi E-Commerce Migration: Architecture & Implementation Report

## 1. Executive Summary
This project involves the migration of a legacy Spring Boot monolithic e-commerce application to a modular, service-oriented architecture using **OSGi (Open Services Gateway initiative)**. The target runtime is **Apache Karaf**, a robust OSGi container. Additional modernizing steps include replacing JPA with raw JDBC for performance/control and decoupling the frontend using **React**. This report details the architecture, development model, and technical stack of the new application.

## 2. Architectural Philosophy: Monolith to Modular

### Legacy Monolith
- **Structure**: Single JAR/WAR file containing all logic (Customer, Order, Catalog).
- **Coupling**: High coupling between components; changing one requires redeploying everything.
- **Dependency Management**: "Classpath Hell" where libraries conflict globally.

### New OSGi Architecture
- **Structure**: Application split into discrete **Bundles** (JARs with special metadata). Each bundle represents a specific feature or layer of the application.
- **Decoupling**: Modules interact strictly through well-defined **Interfaces** (Java interfaces) provided by the `api` bundle. This enforces a "Separation of Concerns" where implementation details are hidden.
- **Dynamic Lifecycle**: Bundles can be installed, started, stopped, or updated individually without restarting the entire system. This is known as **Hot Deployment** and is a key advantage of OSGi, allowing for zero-downtime updates.
- **Isolation**: Each bundle has its own classloader, resolving dependency conflicts and preventing "Classpath Hell".
- **Versioning**: OSGi supports versioning of bundles and packages, allowing multiple versions of the same library or service to coexist in the container.

## 3. System Architecture Diagram

```mermaid
graph TD
    subgraph "Frontend Layer"
        ReactApp[React Frontend (Vite)]
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
        ProdAdminImpl[Product Admin Impl]
    end

    subgraph "REST Layer (Exposure)"
        CustRest[Customer REST]
        CatRest[Catalog REST]
        CartRest[Cart REST]
        OrdRest[Order REST]
        ProdAdminRest[Product Admin REST]
    end

    subgraph "Data Layer"
        DB[(MySQL Database)]
    end

    %% Relationships
    ReactApp -->|HTTP/REST| WAB
    WAB -->|Serves Static Files| ReactApp

    ReactApp -->|API Calls| CustRest
    ReactApp -->|API Calls| CatRest
    ReactApp -->|API Calls| CartRest
    ReactApp -->|API Calls| OrdRest
    ReactApp -->|API Calls| ProdAdminRest

    CustRest -->|OSGi Service| CustImpl
    CatRest -->|OSGi Service| CatImpl
    CartRest -->|OSGi Service| CartImpl
    OrdRest -->|OSGi Service| OrdImpl
    ProdAdminRest -->|OSGi Service| ProdAdminImpl

    CustImpl -.->|Implements| API
    CatImpl -.->|Implements| API
    CartImpl -.->|Implements| API
    OrdImpl -.->|Implements| API
    ProdAdminImpl -.->|Implements| API

    CustImpl -->|JDBC| DB
    CatImpl -->|JDBC| DB
    CartImpl -->|JDBC| DB
    OrdImpl -->|JDBC| DB
    ProdAdminImpl -->|JDBC| DB
```

## 4. The OSGi Development Model Explained

The development model of this project is centered around the concept of **modularity**. The application is broken down into a collection of independent but collaborating **bundles**. Each bundle has a specific responsibility, promoting a clean "Separation of Concerns".

The development workflow is as follows:
1.  **Define Contracts (`api` bundle):** All business logic starts with defining Java interfaces (e.g., `CustomerService`, `ProductService`) and data models (e.g., `Customer`, `Product`) in the `api` bundle. This bundle acts as the "common language" that all other bundles understand. It has no implementation details.
2.  **Implement Business Logic (`*-impl` bundles):** For each service defined in the `api` bundle, a corresponding implementation bundle is created (e.g., `customer-impl`, `catalog-impl`). These bundles contain the actual business logic and data access code (JDBC queries). They import the `api` bundle to implement the interfaces.
3.  **Expose Services via REST (`*-rest` bundles):** To make the business logic accessible to the outside world (i.e., the frontend), REST bundles are created (e.g., `customer-rest`, `catalog-rest`). These bundles use JAX-RS to expose the business services as RESTful APIs. They consume the OSGi services registered by the `*-impl` bundles.
4.  **Develop the Frontend (`frontend` directory):** The frontend is a standard React application developed independently of the backend. It communicates with the backend exclusively through the REST APIs.
5.  **Package the Frontend (`frontend-web` bundle):** The compiled frontend assets (HTML, CSS, JavaScript) are packaged into a **Web Application Bundle (WAB)**. This is a special type of OSGi bundle that can be deployed to a web server running inside the OSGi container.

This modular approach allows for parallel development. For instance, one developer can work on the `catalog-impl` bundle while another works on the `order-impl` bundle, and a third developer can work on the frontend. As long as they adhere to the contracts defined in the `api` bundle, the different parts of the application will integrate seamlessly.

## 5. Technology Stack

| Component | Technology | Version | Role |
|-----------|------------|---------|------|
| **Runtime** | Apache Karaf | 4.x | OSGi Container & Console |
| **Framework** | OSGi Core | 6.0.0 | Modular Standard |
| **DI** | Aries Blueprint | | Service Wiring & Injection |
| **REST** | Apache CXF (JAX-RS) | | REST API Implementation |
| **Database** | MySQL | | Relational Data Storage |
| **Persistence**| JDBC | | Low-level, high-performance data access |
| **Build Tool** | Maven | | Backend build and dependency management |
| | | | |
| **Frontend Framework** | React | 18.3.1 | Modern Dynamic UI |
| **Frontend Build Tool** | Vite | 5.4.11 | Frontend development server and build tool |
| **Frontend Routing** | React Router | 6.28.0 | Client-side routing |
| **Frontend HTTP Client**| Axios | 1.13.2 | Making API calls to the backend |
| **Frontend UI** | Lucide React | 0.468.0 | Icons |
| **Serving** | OSGi WAB | | Serving static frontend assets |

## 6. Detailed Module Breakdown

### 6.1. API Bundle
- **Role**: Pure contracts. Defines the "what" but not the "how".
- **Content**: `CustomerService.java`, `Product.java`, `CartItem.java`.
- **Note**: POJOs are stripped of JPA/Hibernate annotations to ensure the API is independent of the persistence layer.

### 6.2. Implementation Bundles (`*-impl`)
- **Role**: The "Brains" of the application. Contains the business logic.
- **Logic**: 
    - **`customer-impl`**: Handles user registration, login, profile updates, and address management.
    - **`catalog-impl`**: Manages products and categories, including search functionality.
    - **`cart-impl`**: Manages the shopping cart.
    - **`order-impl`**: Handles order creation and management.
    - **`product-admin-impl`**: Manages the product catalog (add, update, delete products).
- **Persistence**: Uses `javax.sql.DataSource` injected by Karaf's Pax JDBC features. The database schema is initialized using `schema.sql`, and sample data is inserted using `data.sql`.

### 6.3. REST Bundles (`*-rest`)
- **Role**: The "Mouth" of the application. Exposes the business logic as REST APIs.
- **Logic**: Uses JAX-RS annotations (`@GET`, `@POST`, `@Path`) to map HTTP requests to Java methods in the `*-impl` services.
- **Format**: Produces and Consumes JSON.

### 6.4. Frontend (`frontend` and `frontend-web`)
- **`frontend`**: A standard React project created with Vite. All UI components, pages, and frontend logic reside here.
- **`frontend-web`**: A Web Application Bundle (WAB) that packages the compiled output of the `frontend` project (from the `frontend/dist` directory).
- **Role**: Serves the React application as a Single Page Application (SPA).
- **Context**: Accessible at `http://localhost:8181/shop`.

## 7. Deployment Strategy

The project uses a `features.xml` repository file. This acts as a catalog of our application.
- **One-click Deploy**: `feature:install ecommerce-all` installs all bundles, database drivers, and the frontend in the correct order.
- **Hot Deployment/Refresh**: If you update a single bundle (e.g., `catalog-impl`), you can redeploy just that bundle using `bundle:update <bundle-id>`. The `feature:repo-refresh` command allows updating the entire feature repository without restarting Karaf.

## 8. Conclusion
The new architecture successfully decouples the frontend from the backend and splits the backend into independent, maintainable modules. This "Separation of Concerns" allows different teams to work on different modules simultaneously. The use of OSGi provides a dynamic and scalable foundation for future growth, allowing for easy updates and maintenance without system downtime.