# OSGi E-Commerce Application: Setup and Deployment Guide

This document provides a step-by-step guide to setting up, building, and deploying the OSGi E-Commerce application to an Apache Karaf container.

## 1. Prerequisites

Ensure you have the following software installed and configured on your system:

- **Java Development Kit (JDK)**: Version 8 or higher.
- **Apache Maven**: To build the project and manage dependencies.
- **Apache Karaf**: The OSGi container where the application will be deployed.

## 2. Project Structure

The project is a multi-module Maven build, enforcing a strict separation of concerns as required.

- **/pom.xml**: The main parent POM that manages all modules and shared dependencies.
- **/api**: An OSGi bundle containing only Java interfaces (`*.api.customer`) and data models (`*.api.model`). Other bundles depend on this to communicate without knowing the implementation details.
- **/customer-impl**: An OSGi bundle containing the business logic that implements the interfaces from the `api` bundle. This is where database logic will go.
- **/customer-rest**: An OSGi bundle that contains the JAX-RS (CXF) REST endpoints. It consumes the service from `customer-impl` and exposes it over HTTP.
- **/features**: A module to package the Karaf `features.xml` file, which defines how the application is deployed.

## 3. Building the Application

The project is built using Apache Maven.

Open a terminal in the root directory of the project and run the following command:

```bash
mvn clean install
```

This command will:
1.  **clean**: Delete any previously compiled files and builds.
2.  **install**: Compile your Java code, package each module into an OSGi bundle (a `.jar` file), and install them into your local Maven repository (`~/.m2/repository`). This also prepares the `features.xml` file in the `features/target` directory.

## 4. Deployment to Apache Karaf

Follow these steps in the Karaf console to deploy the application.

### Step 1: Start Karaf

Launch the Karaf container by running `./bin/karaf` (Linux/macOS) or `\bin\karaf.bat` (Windows).

### Step 2: Add Required Feature Repositories

Our application uses Apache CXF for REST services, but Karaf doesn't know about these features by default. Add the CXF "cookbook" first.

```sh
karaf@root()> feature:repo-add cxf
```

### Step 3: Add Your Project's Feature Repository

Now, tell Karaf about your application's features. We use a `mvn:` URL, which tells Karaf to find the `features.xml` file directly from your local Maven repository.

```sh
karaf@root()> feature:repo-add mvn:com.mycompany.ecommerce/features/1.0.0-SNAPSHOT/xml/features
```

### Step 4: Install the Application Feature

With all repositories in place, you can now install the main feature for the customer module.

```sh
karaf@root()> feature:install ecommerce-customer
```

Karaf will now read your feature, see that it needs `cxf-jaxrs`, install it, and then install your `api`, `customer-impl`, and `customer-rest` bundles.

## 5. Verification

You can verify that the deployment was successful with these commands.

### Check Bundles

List all bundles and filter for yours. They should all be `Active`.

```sh
karaf@root()> bundle:list | grep ecommerce
```

### Check REST Endpoint

The simplest way is to use a web browser or `curl`. The REST service is exposed at `http://localhost:8181/cxf/api`.

```bash
# Using curl
curl http://localhost:8181/cxf/api/customers/123
```

You should see the dummy JSON response:
```json
{"id":"123","name":"John Doe","email":"john.doe@example.com"}
```
