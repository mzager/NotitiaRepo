
import xlsx2csv
from openpyxl import load_workbook

file = 'broad.xlsx'
wb = load_workbook(filename=file, read_only=True)
sheetNames = wb.sheetnames
converter = xlsx2csv.Xlsx2csv(file, sheetid=0, outputencoding='utf-8')
del wb


    
for idx, sheetName in enumerate(sheetNames):
    converter.convert(sheetName+'.csv', sheetid=idx)
    
