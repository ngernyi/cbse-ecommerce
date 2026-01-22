# Troubleshooting Guide: E-Commerce Application Deployment

This document tracks the steps taken to resolve errors during the deployment of the OSGi e-commerce application.

## Problem

The application fails to start correctly. Initially "Table not found" with H2, then "Missing Dependencies" during MySQL migration, and finally REST bundles timing out.

## Steps Taken

1.  **Diagnosed Initial 404 Error**:
    *   **Resolution**: Build frontend and installed `ecommerce-all`.

2.  **Migrated to MySQL**:
    *   **Reason**: H2 schema persistence issues.
    *   **Action**: Configured `MysqlDataSource` and installed proper driver.

3.  **Fixed Blueprint Deadlock**:
    *   **Issue**: `customer-impl` was deadlocked waiting for its own DataSource.
    *   **Action**: Injected `mysqlDataSource` bean internally in `blueprint.xml`.

4.  **Restarted Implementation Bundles**:
    *   Implementation bundles start successfully after the deadlock fix.

5.  **Restarted REST Bundles**:
    *   **Issue**: REST bundles (`*-rest`) entered `Failure` state because they timed out waiting for the implementation services to come online.
    *   **Resolution**: Restarted the failed REST bundles after verifying the Impl bundles were `Active`.

## Current Status

*   **All Bundles**: Should be `Active`.
*   **Application**: Accessible at `http://localhost:8181/shop/`.

## Verification Commands
1.  **Check Status**: `list` (All 80 level bundles should be Active).
2.  **Test API**: `curl http://localhost:8181/cxf/products`
3.  **Test UI**: Open `http://localhost:8181/shop`.
