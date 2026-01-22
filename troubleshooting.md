# Troubleshooting Guide

This guide provides solutions to common problems you might encounter while developing and running the OSGi E-Commerce project.

## 1. Build Failures

### Symptom: Maven build fails with "package ... does not exist"
- **Cause**: This usually happens when the `api` bundle has not been built and installed into your local Maven repository.
- **Solution**: Run `mvn clean install` from the root of the project. This will build all modules in the correct order.

### Symptom: Frontend build fails with a syntax error
- **Cause**: The frontend code might have a syntax error.
- **Solution**: Check the error message in the console. The build tool (Vite) usually provides a clear error message with the file and line number. Fix the syntax error and try building again.

## 2. Runtime Issues in Karaf

### Symptom: Bundle is in "Installed" state, not "Active"
- **Cause**: The bundle has unresolved dependencies. This means it requires a package that is not exported by any other active bundle.
- **Solution**: Use the `diag <bundle-id>` command in the Karaf console to see the unresolved dependencies. For example, if your `customer-impl` bundle is not starting, run `diag <customer-impl-bundle-id>`. This will tell you which package is missing. You might need to install another bundle that exports the required package.

### Symptom: REST APIs are not available (404 Not Found)
- **Cause**:
    1. The `*-rest` bundle is not active.
    2. The CXF feature is not installed.
    3. There is a problem with the JAX-RS annotations in your REST service.
- **Solution**:
    1. Check the status of your `*-rest` bundles using `list`.
    2. Make sure the `cxf` feature is installed by running `feature:list -i | grep cxf`. If it's not installed, run `feature:install cxf`.
    3. Check your REST service classes for any errors in the `@Path`, `@GET`, `@POST`, etc. annotations.

### Symptom: Frontend is not loading at `http://localhost:8181/shop`
- **Cause**:
    1. The `frontend-web` bundle is not active.
    2. The `pax-web-wab` feature is not installed.
- **Solution**:
    1. Check the status of the `frontend-web` bundle using `list`.
    2. Make sure the `pax-web-wab` feature is installed by running `feature:list -i | grep pax-web-wab`. If not, run `feature:install pax-web-wab`.

## 3. Database Issues

### Symptom: "Table not found" error in the logs
- **Cause**: The database schema has not been created.
- **Solution**: Make sure you have executed the `schema.sql` script in your MySQL database.

### Symptom: Application fails to connect to the database
- **Cause**:
    1. The MySQL JDBC driver is not installed in Karaf.
    2. The datasource configuration in `datasource-mysql.xml` is incorrect.
- **Solution**:
    1. Install the MySQL driver in Karaf (see `MYSQL_SETUP.md`).
    2. Double-check the database URL, username, and password in your `datasource-mysql.xml` file.

## 4. Frontend Issues

### Symptom: Product images are not loading
- **Cause**:
    1. The image files are not in the correct directory.
    2. The `product_images` table in the database is empty.
- **Solution**:
    1. Place your product images in the `frontend/public/assets/images/` directory.
    2. Make sure you have executed the `data.sql` script to populate the `product_images` table.

### Symptom: "Failed to update profile" or other API errors
- **Cause**: There is a mismatch between the frontend's API call and the backend's API endpoint.
- **Solution**: Check the browser's developer console (Network tab) to inspect the failed API request. Compare the request URL, method, and payload with the backend's REST service definition.