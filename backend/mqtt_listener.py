
import json
import os

import paho.mqtt.client as mqtt
from dotenv import load_dotenv

from main import get_db_connection

load_dotenv()

MQTT_BROKER = os.getenv("MQTT_BROKER", "test.mosquitto.org")
MQTT_PORT = int(os.getenv("MQTT_PORT", "1883"))
MQTT_TOPIC = os.getenv("MQTT_TOPIC", "smart-irrigation/demo/sensors")


def on_connect(client, userdata, flags, reason_code, properties):
    if reason_code == 0:
        print(f"Connected to MQTT broker: {MQTT_BROKER}")
        result, mid = client.subscribe(MQTT_TOPIC)
        print(f"Subscribed to {MQTT_TOPIC}; result: {result}")
    else:
        print(f"MQTT connection failed: {reason_code}")


def on_message(client, userdata, message):
    try:
        data = json.loads(message.payload.decode("utf-8"))

        device_id = data.get("device_identifier")
        field_id = str(data.get("field_id", ""))
        if not device_id or not field_id:
            print("Ignoring message: device_identifier and field_id are required.")
            return

        with get_db_connection() as conn:
            field = conn.execute(
                "SELECT id FROM fields WHERE id::text = %s",
                (field_id,),
            ).fetchone()

            if field is None:
                print(f"Ignoring message: field_id {field_id} does not exist.")
                return

            conn.execute(
                """
                INSERT INTO sensor_readings
                    (device_identifier, field_id, timestamp, humidity,
                     temperature, electrical_conductivity, battery)
                VALUES
                    (%s, %s, COALESCE(%s::timestamptz, NOW()),
                     %s, %s, %s, %s)
                """,
                (
                    device_id,
                    field_id,
                    data.get("timestamp"),
                    data.get("humidity"),
                    data.get("temperature"),
                    data.get("electrical_conductivity"),
                    data.get("battery"),
                ),
            )

        print(f"Saved MQTT reading to PostgreSQL for field {field_id}.")
        print(json.dumps(data, indent=2))

    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        print(f"Ignoring invalid JSON message: {exc}")
    except Exception as exc:
        print(f"Could not save MQTT message: {exc}")


def main():
    client = mqtt.Client(
        callback_api_version=mqtt.CallbackAPIVersion.VERSION2,
        client_id="smart-irrigation-listener-padak-20261016",
        protocol=mqtt.MQTTv311,
    )
    client.on_connect = on_connect
    client.on_message = on_message

    print(f"Connecting to {MQTT_BROKER}:{MQTT_PORT} ...")
    client.connect(MQTT_BROKER, MQTT_PORT, keepalive=60)
    client.loop_forever()


if __name__ == "__main__":
    main()
