from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains

# Database connection configuration
DB_CONFIG = {
    'host': 'localhost',
    'user': 'root',
    'password': 'root',
    'database': 'shopping_cloth'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
        
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    
    if not username or not email or not password or not role:
        return jsonify({"success": False, "message": "All fields are required"}), 400

    connection = get_db_connection()
    if not connection:
        return jsonify({"success": False, "message": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        
        # Insert query with the actual column names in MySQL
        insert_query = """
            INSERT INTO user_Register (User_Name, Email_ID, Password, Role)
            VALUES (%s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (username, email, password, role))
        connection.commit()
        
        return jsonify({"success": True, "message": "Registration successful!"}), 201
        
    except Error as e:
        print(f"Failed to insert record into MySQL table: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/payment', methods=['POST'])
def payment():
    data = request.json
    
    if not data:
        return jsonify({"success": False, "message": "No data provided"}), 400
        
    full_name = data.get('Full_Name')
    email = data.get('Email_Address')
    phone = data.get('Phone_Number')
    image = data.get('Product_Image')
    city = data.get('City')
    zip_code = data.get('Zip_Code')
    color = data.get('Product_Color')
    address = data.get('Shipping_Address')

    connection = get_db_connection()
    if not connection:
        return jsonify({"success": False, "message": "Database connection failed"}), 500

    try:
        cursor = connection.cursor()
        
        insert_query = """
            INSERT INTO Order_Details (Full_Name, Email_Address, Phone_Number, City, Zip_Code, Product_Color, Shipping_Address)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        
        cursor.execute(insert_query, (full_name, email, phone, city, zip_code, color, address))
        connection.commit()
        
        return jsonify({"success": True, "message": "Order details saved successfully!"}), 201
        
    except Error as e:
        print(f"Failed to insert record into MySQL table: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
        
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
