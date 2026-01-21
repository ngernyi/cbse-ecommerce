# Troubleshooting Guide: E-Commerce Application Deployment

This document tracks the steps taken to resolve the "Table not found" error during the deployment of the OSGi e-commerce application.

## Problem

The application fails to start correctly, throwing a `JdbcSQLSyntaxErrorException: Table "CART_ITEMS" not found`. This indicates that the database schema is not being created.

## Steps Taken

1.  **Diagnosed Initial 404 Error**:
    *   Identified that only the `ecommerce-customer` feature was being installed, which did not include the `frontend-web` bundle.
    *   **Resolution**: Instructed to build the frontend (`npm run build`) and install the `ecommerce-all` feature in Karaf.

2.  **Diagnosed "Table Not Found" Error**:
    *   The error persisted, pointing to a database schema initialization failure.
    *   Inspected `datasource-h2.xml` and found it used hardcoded, absolute file paths to the `schema.sql` and `data.sql` scripts.

3.  **Attempted Fix #1**:
    *   Copied `schema.sql` and `data.sql` into `customer-impl/src/main/resources/`.
    *   Copied `datasource-h2.xml` into `customer-impl/src/main/resources/OSGI-INF/blueprint/`.
    *   Modified `datasource-h2.xml` to load the SQL scripts from the classpath (`classpath:schema.sql`).
    *   **Result**: The error remains, suggesting the updated `datasource-h2.xml` is still not being loaded correctly.

4.  **Attempted Fix #2**:
    *   Deleted the original `datasource-h2.xml` from the project's root directory to prevent conflicts.

## Next Steps

1.  **Rebuild the project** with `mvn clean install` to ensure the `customer-impl` bundle is correctly updated with the database scripts and blueprint file.
2.  **Restart Karaf** (clearing the cache is recommended) and redeploy the `ecommerce-all` feature.
3.  If the problem still persists, the next step will be to verify that the `customer-impl` bundle's manifest correctly lists the blueprint file and that all necessary `pax-jdbc` features are being started correctly in Karaf.
