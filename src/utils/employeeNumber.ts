// utils/employeeNumber.ts
import fs from 'fs';
import path from 'path';

const filePath = path.join(__dirname, '../data/employeeData.json');

export function generateEmployeeNumber(): string {
  const now = new Date();
  const datePart = now.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  const randomPart = Math.floor(Math.random() * 9000 + 1000); // 1000-9999
  return `EMP-${datePart}-${randomPart}`;
}

export function saveEmployeeToJson(employeeNumber: string) {
  const data = { Employee_Number: employeeNumber };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export function readEmployeeFromJson(): string {
  const data = fs.readFileSync(filePath, 'utf-8');
  const parsed = JSON.parse(data);
  return parsed.Employee_Number;
}