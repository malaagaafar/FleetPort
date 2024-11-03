from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash
import pyodbc

app = Flask(__name__)

# Database connection

conn = pyodbc.connect(r'DRIVER={SQL Server};SERVER=DESKTOP-G1KJ375\SQLEXPRESS01;DATABASE=FleetManagementDB;Trusted_Connection=yes;')


@app.route('/api/register', methods=['POST'])
def create_user():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone_number = data.get('phone_number')
    role = data.get('role', 'User')  # Default role is 'User' if not provided

    if not all([name, email, password]):
        return jsonify({'message': 'Name, email, and password are required'}), 400

    # Hash the password (ensure you have a hashing function)
    hashed_password = generate_password_hash(password, method='sha256')

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Users (Name, Email, PasswordHash, PhoneNumber, Role)
            VALUES (?, ?, ?, ?, ?)
        ''', (name, email, hashed_password, phone_number, role))

        # Retrieve the last inserted ID
        cursor.execute('SELECT SCOPE_IDENTITY()')
        user_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201
    except pyodbc.IntegrityError:
        return jsonify({'message': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/users', methods=['GET'])
def get_users():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Users")
    users = cursor.fetchall()
    return jsonify([{'id': user[0], 'username': user[1]} for user in users]), 200

@app.route('/api/vehicles', methods=['POST'])
def create_vehicle():
    data = request.json
    owner_id = data.get('owner_id')
    make = data.get('make')
    model = data.get('model')
    vin = data.get('vin')
    license_plate = data.get('license_plate')
    odometer_reading = data.get('odometer_reading', 0.00)  # Default is 0.00
    engine_status = data.get('engine_status', 1)  # Default is 1 (running)

    if not all([owner_id, make, model, vin, license_plate]):
        return jsonify({'message': 'Owner ID, make, model, VIN, and license plate are required'}), 400

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Vehicles (OwnerId, Make, Model, VIN, LicensePlate, OdometerReading, EngineStatus)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (owner_id, make, model, vin, license_plate, odometer_reading, engine_status))

        # Retrieve the last inserted ID
        cursor.execute('SELECT SCOPE_IDENTITY()')
        vehicle_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'Vehicle created successfully', 'vehicle_id': vehicle_id}), 201
    except pyodbc.IntegrityError:
        return jsonify({'message': 'VIN or License Plate already exists'}), 409
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@app.route('/api/vehicles', methods=['GET'])
def get_vehicles():
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Vehicles")
    vehicles = cursor.fetchall()
    return jsonify([{'id': vehicle[0], 'user_id': vehicle[1], 'vehicle_type': vehicle[2], 'license_plate': vehicle[3]} for vehicle in vehicles]), 200

@app.route('/api/trips', methods=['POST'])
def create_trip():
    data = request.json
    vehicle_id = data.get('vehicle_id')
    driver_id = data.get('driver_id')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    start_location = data.get('start_location')
    end_location = data.get('end_location')
    distance = data.get('distance')
    average_speed = data.get('average_speed')
    fuel_consumption = data.get('fuel_consumption')
    g_force_data = data.get('g_force_data')

    if not all([vehicle_id, driver_id, start_time, distance]):
        return jsonify({'message': 'Vehicle ID, Driver ID, Start Time, and Distance are required'}), 400

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Trips (VehicleId, DriverId, StartTime, EndTime, StartLocation, EndLocation, 
            Distance, AverageSpeed, FuelConsumption, GForceData)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (vehicle_id, driver_id, start_time, end_time, start_location, end_location, 
              distance, average_speed, fuel_consumption, g_force_data))

        cursor.execute('SELECT SCOPE_IDENTITY()')
        trip_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'Trip created successfully', 'trip_id': trip_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/trips', methods=['GET'])
def get_all_trips():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Trips')
        trips = cursor.fetchall()
        return jsonify([{
            'id': trip[0],
            'vehicle_id': trip[1],
            'driver_id': trip[2],
            'start_time': trip[3].isoformat(),
            'end_time': trip[4].isoformat() if trip[4] else None,
            'start_location': trip[5],
            'end_location': trip[6],
            'distance': trip[7],
            'average_speed': trip[8],
            'fuel_consumption': trip[9],
            'g_force_data': trip[10],
            'created_at': trip[11].isoformat()
        } for trip in trips]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/trips/<int:trip_id>', methods=['GET'])
def get_trip_by_id(trip_id):
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Trips WHERE Id = ?', (trip_id,))
        trip = cursor.fetchone()
        if trip:
            return jsonify({
                'id': trip[0],
                'vehicle_id': trip[1],
                'driver_id': trip[2],
                'start_time': trip[3].isoformat(),
                'end_time': trip[4].isoformat() if trip[4] else None,
                'start_location': trip[5],
                'end_location': trip[6],
                'distance': trip[7],
                'average_speed': trip[8],
                'fuel_consumption': trip[9],
                'g_force_data': trip[10],
                'created_at': trip[11].isoformat()
            }), 200
        else:
            return jsonify({'message': 'Trip not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/trips/<int:trip_id>', methods=['PUT'])
def update_trip(trip_id):
    data = request.json
    vehicle_id = data.get('vehicle_id')
    driver_id = data.get('driver_id')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    start_location = data.get('start_location')
    end_location = data.get('end_location')
    distance = data.get('distance')
    average_speed = data.get('average_speed')
    fuel_consumption = data.get('fuel_consumption')
    g_force_data = data.get('g_force_data')

    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE Trips
            SET VehicleId = ?, DriverId = ?, StartTime = ?, EndTime = ?, StartLocation = ?, 
                EndLocation = ?, Distance = ?, AverageSpeed = ?, FuelConsumption = ?, GForceData = ?
            WHERE Id = ?
        ''', (
            vehicle_id, 
            driver_id, 
            start_time, 
            end_time if end_time else None,  # Ensure None for null values
            start_location, 
            end_location, 
            distance, 
            average_speed, 
            fuel_consumption, 
            g_force_data, 
            trip_id
        ))

        if cursor.rowcount == 0:
            return jsonify({'message': 'Trip not found'}), 404

        conn.commit()
        return jsonify({'message': 'Trip updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
def delete_trip(trip_id):
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Trips WHERE Id = ?', (trip_id,))
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Trip not found'}), 404

        conn.commit()
        return jsonify({'message': 'Trip deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/maintenance', methods=['POST'])
def create_maintenance():
    data = request.json
    vehicle_id = data.get('vehicle_id')
    service_type = data.get('service_type')
    service_date = data.get('service_date')
    next_service_due = data.get('next_service_due')
    cost = data.get('cost')
    notes = data.get('notes')

    if not all([vehicle_id, service_type, service_date]):
        return jsonify({'message': 'Vehicle ID, Service Type, and Service Date are required'}), 400

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Maintenance (VehicleId, ServiceType, ServiceDate, NextServiceDue, Cost, Notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (vehicle_id, service_type, service_date, next_service_due, cost, notes))

        cursor.execute('SELECT SCOPE_IDENTITY()')
        maintenance_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'Maintenance record created successfully', 'maintenance_id': maintenance_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

##
@app.route('/api/maintenance', methods=['GET'])
def get_all_maintenance():
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Maintenance')
        maintenance_records = cursor.fetchall()
        return jsonify([{
            'id': record[0],
            'vehicle_id': record[1],
            'service_type': record[2],
            'service_date': record[3].isoformat(),
            'next_service_due': record[4].isoformat() if record[4] else None,
            'cost': record[5],
            'notes': record[6],
            'created_at': record[7].isoformat()
        } for record in maintenance_records]), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/maintenance/<int:maintenance_id>', methods=['GET'])
def get_maintenance_by_id(maintenance_id):
    try:
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM Maintenance WHERE Id = ?', (maintenance_id,))
        record = cursor.fetchone()
        if record:
            return jsonify({
                'id': record[0],
                'vehicle_id': record[1],
                'service_type': record[2],
                'service_date': record[3].isoformat(),
                'next_service_due': record[4].isoformat() if record[4] else None,
                'cost': record[5],
                'notes': record[6],
                'created_at': record[7].isoformat()
            }), 200
        else:
            return jsonify({'message': 'Maintenance record not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/maintenance/<int:maintenance_id>', methods=['PUT'])
def update_maintenance(maintenance_id):
    data = request.json
    vehicle_id = data.get('vehicle_id')
    service_type = data.get('service_type')
    service_date = data.get('service_date')
    next_service_due = data.get('next_service_due')
    cost = data.get('cost')
    notes = data.get('notes')

    try:
        cursor = conn.cursor()
        cursor.execute('''
            UPDATE Maintenance
            SET VehicleId = ?, ServiceType = ?, ServiceDate = ?, NextServiceDue = ?, Cost = ?, Notes = ?
            WHERE Id = ?
        ''', (vehicle_id, service_type, service_date, next_service_due, cost, notes, maintenance_id))

        if cursor.rowcount == 0:
            return jsonify({'message': 'Maintenance record not found'}), 404

        conn.commit()
        return jsonify({'message': 'Maintenance record updated successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##
@app.route('/api/maintenance/<int:maintenance_id>', methods=['DELETE'])
def delete_maintenance(maintenance_id):
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM Maintenance WHERE Id = ?', (maintenance_id,))
        
        if cursor.rowcount == 0:
            return jsonify({'message': 'Maintenance record not found'}), 404

        conn.commit()
        return jsonify({'message': 'Maintenance record deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
##

##
@app.route('/api/performance_insights', methods=['POST'])
def create_performance_insight():
    data = request.json
    vehicle_id = data.get('vehicle_id')
    trip_id = data.get('trip_id')
    insight_description = data.get('insight_description')
    insight_type = data.get('insight_type')
    recommendation = data.get('recommendation')

    if not all([vehicle_id, trip_id, insight_description]):
        return jsonify({'message': 'Vehicle ID, Trip ID, and Insight Description are required'}), 400

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO PerformanceInsights (VehicleId, TripId, InsightDescription, InsightType, Recommendation)
            VALUES (?, ?, ?, ?, ?)
        ''', (vehicle_id, trip_id, insight_description, insight_type, recommendation))

        cursor.execute('SELECT SCOPE_IDENTITY()')
        insight_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'Performance insight created successfully', 'insight_id': insight_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

##
##
@app.route('/api/decisions', methods=['POST'])
def create_decision():
    data = request.json
    user_id = data.get('user_id')
    insight_id = data.get('insight_id')
    decision_type = data.get('decision_type')

    if not all([user_id, insight_id, decision_type]):
        return jsonify({'message': 'User ID, Insight ID, and Decision Type are required'}), 400

    try:
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO Decisions (UserId, InsightId, DecisionType)
            VALUES (?, ?, ?)
        ''', (user_id, insight_id, decision_type))

        cursor.execute('SELECT SCOPE_IDENTITY()')
        decision_id = cursor.fetchone()[0]

        conn.commit()
        return jsonify({'message': 'Decision created successfully', 'decision_id': decision_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500

##
##



if __name__ == '__main__':
    app.run(debug=True)
