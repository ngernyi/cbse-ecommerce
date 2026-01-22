# MySQL Database Setup for OSGi E-Commerce Project

This document provides instructions on how to set up and configure a MySQL database for the OSGi E-Commerce project.

## 1. Prerequisites
- MySQL Server installed and running.
- A MySQL client (e.g., MySQL Workbench, DBeaver, or the command-line client) to execute SQL scripts.

## 2. Database Creation
First, you need to create a new database for the application. You can do this using your MySQL client.

```sql
CREATE DATABASE osgi_ecommerce;
```

## 3. User Creation
It is recommended to create a dedicated user for the application to access the database.

```sql
CREATE USER 'osgi_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON osgi_ecommerce.* TO 'osgi_user'@'localhost';
FLUSH PRIVILEGES;
```
**Note:** Replace `'password'` with a strong password.

## 4. Karaf Configuration
To connect the application to the MySQL database, you need to configure a datasource in Apache Karaf. This is done in the `customer-impl/src/main/resources/OSGI-INF/blueprint/datasource-mysql.xml` file.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<blueprint xmlns="http://www.osgi.org/xmlns/blueprint/v1.0.0">

    <bean id="mysqlDataSource" class="com.mysql.cj.jdbc.MysqlDataSource">
        <property name="url" value="jdbc:mysql://localhost:3306/osgi_ecommerce"/>
        <property name="user" value="osgi_user"/>
        <property name="password" value="password"/>
    </bean>

    <service ref="mysqlDataSource" interface="javax.sql.DataSource">
        <service-properties>
            <entry key="osgi.jndi.service.name" value="jdbc/osgi_ecommerce_ds"/>
        </service-properties>
    </service>

</blueprint>
```
Make sure the `url`, `user`, and `password` properties match your MySQL setup.

## 5. Schema and Data Initialization
The database schema and initial data are defined in the following files in the root of the project:
- `schema.sql`: Contains the `CREATE TABLE` statements to create the database schema.
- `data.sql`: Contains `INSERT` statements to populate the database with sample data.

You need to execute these scripts in your `osgi_ecommerce` database before running the application. You can do this using your MySQL client.

## 6. Install MySQL JDBC Driver in Karaf
Before deploying the application, you need to install the MySQL JDBC driver in Karaf.

1.  Open the Karaf console.
2.  Install the driver using the `bundle:install` command. You may need to download the MySQL Connector/J driver first.
    ```
    bundle:install -s mvn:mysql/mysql-connector-java/8.0.28
    ```
    (The version may vary)

After completing these steps, your OSGi application will be able to connect to the MySQL database.