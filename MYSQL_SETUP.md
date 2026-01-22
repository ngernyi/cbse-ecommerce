# MySQL Setup Instructions for OSGi E-Commerce

Since we are switching from H2 to MySQL (via XAMPP) to resolve persistence and table issues, please follow these steps to configure your environment.

## 1. Start XAMPP
1. Open **XAMPP Control Panel**.
2. Click **Start** for **Apache** and **MySQL**.
3. Ensure the ports (default 3306 for MySQL) are green and running.

## 2. Initialize the Database
Since the MySQL driver doesn't support the automatic `INIT=RUNSCRIPT` feature used by H2, you must manually import the SQL schemas.

1. Open your browser and go to [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
2. Click on **New** in the left sidebar to create a database.
3. Database Name: `ecommerce`
4. Click **Create**.
5. Select the `ecommerce` database.
6. Click the **Import** tab.
7. Click **Choose File** and select `osgi/schema.sql` from your project directory.
8. Click **Import** (or **Go**) at the bottom.
9. Repeat steps 6-8 for `osgi/data.sql` to populate sample data.

## 3. Install MySQL Driver in Karaf
When you start Apache Karaf, you need to provide the MySQL connector so the application can connect to XAMPP.

In the Karaf console, run:
```bash
bundle:install -s mvn:com.mysql/mysql-connector-j/8.0.33
```
(Or any version compatible with your Java setup. 8.0.33 is standard).

You may also need to install `pax-jdbc` features if not already present, but the application uses a direct DataSource bean, so the driver bundle should be sufficient if the package imports are correct.

## 4. Rebuild and Deploy
1. In your project root, run:
   ```bash
   mvn clean install
   ```
2. Start Karaf.
3. If you have a distribution or feature file, update it to include the mysql-connector dependency.
4. Deploy the features/bundles.
   - `karaf@root> feature:repo-add mvn:com.mycompany.ecommerce/features/1.0.0-SNAPSHOT/xml/features`
   - `karaf@root> feature:install ecommerce-all`

## Troubleshooting
- **ClassNotFoundException: com.mysql.cj.jdbc.MysqlDataSource**: Ensure the `mysql-connector-java` bundle is installed and has status `Active` in Karaf.
- **Connection Refused**: Ensure XAMPP MySQL is running on port 3306.
