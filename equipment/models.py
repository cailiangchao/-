from datetime import datetime
import csv
import os

class Patient:
    def __init__(self):
        self.id = None
        self.name = ""
        self.phone = ""
        self.infected = False
        self.infection_date = None
        self.location_history_file = ""

    def save(self):
        """保存患者基本信息"""
        file_exists = os.path.isfile('patients.csv')
        with open('patients.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['id', 'name', 'phone', 'infected', 'infection_date', 'location_history_file'])
            writer.writerow([
                self.id,
                self.name,
                self.phone,
                self.infected,
                self.infection_date,
                self.location_history_file
            ])

class LocationHistory:
    @staticmethod
    def add(patient_id, start_time, end_time, latitude, longitude, location_code):
        """添加位置历史记录"""
        filename = f"locations_{patient_id}.csv"
        file_exists = os.path.isfile(filename)
        
        with open(filename, 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['patient_id', 'start_time', 'end_time', 'latitude', 'longitude', 'location_code'])
            writer.writerow([patient_id, start_time, end_time, latitude, longitude, location_code])
        
        return filename

class Contact:
    @staticmethod
    def save(source_id, contact_id, start_time, end_time, risk_level):
        """保存接触关系"""
        file_exists = os.path.isfile('contacts.csv')
        with open('contacts.csv', 'a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if not file_exists:
                writer.writerow(['source_patient_id', 'contact_patient_id', 'contact_start', 'contact_end', 'risk_level'])
            writer.writerow([source_id, contact_id, start_time, end_time, risk_level])
