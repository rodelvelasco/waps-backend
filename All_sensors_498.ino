#include <SoftwareSerial.h>
#include <Wire.h>
#include <BH1750.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>

BH1750 lightMeter;

#define RE 8
#define DE 7
#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BME280 bme;

const byte nitro[] = {0x01,0x03, 0x00, 0x1e, 0x00, 0x01, 0xe4, 0x0c};
const byte phos[] = {0x01,0x03, 0x00, 0x1f, 0x00, 0x01, 0xb5, 0xcc};
const byte pota[] = {0x01,0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xc0};
byte values[11];

int Sensor = A0;
int ad_value;

SoftwareSerial mod(2,3);

long randNumber;
 
void setup() {
  Serial.begin(9600);
  mod.begin(9600);
  pinMode(RE, OUTPUT);
  pinMode(DE, OUTPUT);

  // Initialize the I2C bus (BH1750 library doesn't do this automatically)
  // On esp8266 devices you can select SCL and SDA pins using Wire.begin(D4, D3);
  Wire.begin();

  lightMeter.begin();
  //Serial.println(F("BH1750 Test"));
  
  if (!bme.begin(0x76)) {
   Serial.println("Could not find a valid BME280 sensor, check wiring!");
   while (1);
  }
  
  pinMode(Sensor, INPUT);
  pinMode(5,OUTPUT);
}

void loop() {

  //solenoid
  digitalWrite(5,HIGH);
  //BME
  //Serial.print("Temperature = ");
  Serial.println(int(bme.readTemperature()));
  //Serial.println("*C");

  //Serial.print("Pressure = ");
  Serial.println(int(bme.readPressure() / 100.0F));
  //Serial.println("hPa");

  //Serial.print("Approx. Altitude = ");
  Serial.println(int(bme.readAltitude(SEALEVELPRESSURE_HPA)));
  //Serial.println("m");

  //Serial.print("Humidity = ");
  Serial.println(int(bme.readHumidity()));
  //Serial.println("%");

  //SoilMoisture
  ad_value = analogRead(Sensor);
  //Serial.print("Output: ");
  Serial.println(int(ad_value));
  //delay(500);

  //LightIntensity
  float lux = lightMeter.readLightLevel();
  //Serial.print("Light: ");
  Serial.println(int(lux));
  //Serial.println(" lx");
  //delay(1000);

  //WaterFlow
  randNumber = random(78);
  Serial.println(int(randNumber));

  //NPK
  byte val1,val2,val3;
  val1 = nitrogen();
  delay(250);
  val2 = phosphorous();
  delay(250);
  val3 = potassium();
  delay(250);
  //Serial.println();
  //Serial.print("Nitrogen: ");
  Serial.println(val1);
  //Serial.print("X");
  //Serial.println(" mg/kg");
  //Serial.print("Phosphorous: ");
  Serial.println(val2);
  //Serial.print("X");
  //Serial.println(" mg/kg");
  //Serial.print("Potassium: ");
  Serial.println(val3);
  //Serial.print("X");
  //Serial.println(" mg/kg");
  
  delay(30000);
  
}

byte nitrogen(){
  digitalWrite(DE,HIGH);
  digitalWrite(RE,HIGH);
  delay(10);
  if(mod.write(nitro,sizeof(nitro))==8){
    digitalWrite(DE,LOW);
    digitalWrite(RE,LOW);
    for(byte i=0;i<7;i++){
    //Serial.print(mod.read(),HEX);
    values[i] = mod.read();
    //Serial.print(values[i],HEX);
    }
    //Serial.println();
  }
  return values[4];
}
byte phosphorous(){
  digitalWrite(DE,HIGH);
  digitalWrite(RE,HIGH);
  delay(10);
  if(mod.write(phos,sizeof(phos))==8){
    digitalWrite(DE,LOW);
    digitalWrite(RE,LOW);
    for(byte i=0;i<7;i++){
    //Serial.print(mod.read(),HEX);
    values[i] = mod.read();
    //Serial.print(values[i],HEX);
    }
    //Serial.println();
  }
  return values[4];
}
 
byte potassium(){
  digitalWrite(DE,HIGH);
  digitalWrite(RE,HIGH);
  delay(10);
  if(mod.write(pota,sizeof(pota))==8){
    digitalWrite(DE,LOW);
    digitalWrite(RE,LOW);
    for(byte i=0;i<7;i++){
    //Serial.print(mod.read(),HEX);
    values[i] = mod.read();
    //Serial.print(values[i],HEX);
    }
    //Serial.println();
  }
  return values[4];
}
