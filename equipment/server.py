from flask import Flask, request, render_template_string, redirect, flash
import csv
import os
from datetime import datetime
from werkzeug.utils import secure_filename
from search import search_bp

app = Flask(__name__)
app.secret_key = 'your-secret-key-here'  # Needed for flash messages

# 注册蓝图
app.register_blueprint(search_bp)

CSV_FILE = 'data.csv'
ALLOWED_EXTENSIONS = {'csv'}

# HTML Template with improved styling and structure
FORM_HTML = """
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新生儿科设备管理系统</title>
    <style>
        :root {
            --primary-color: #4285f4;
            --secondary-color: #34a853;
            --danger-color: #ea4335;
            --light-gray: #f5f5f5;
            --dark-gray: #333;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
            line-height: 1.6;
            color: var(--dark-gray);
            background-color: #f9f9f9;
            padding: 20px;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        h1 {
            text-align: center;
            color: var(--primary-color);
            margin-bottom: 30px;
            font-weight: 500;
        }
        
        .form-header {
            text-align: center;
            margin-bottom: 25px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #555;
        }
        
        input, select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            transition: border 0.3s;
        }
        
        input:focus, select:focus {
            border-color: var(--primary-color);
            outline: none;
            box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.2);
        }
        
        .form-row {
            display: flex;
            gap: 20px;
        }
        
        .form-row .form-group {
            flex: 1;
        }
        
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            text-align: center;
            text-decoration: none;
        }
        
        .btn:hover {
            background-color: #3367d6;
        }
        
        .btn-block {
            display: block;
            width: 100%;
        }
        
        .alert {
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        
        .alert-success {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .patient-id-container {
            display: flex;
            align-items: center;
        }
        
        .patient-id-prefix {
            margin-right: 10px;
            font-weight: 600;
        }
        
        @media (max-width: 600px) {
            .form-row {
                flex-direction: column;
                gap: 0;
            }
            
            .container {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="form-header">
            <h1>新生儿科设备使用消毒登记</h1>
        </div>
        
        {% with messages = get_flashed_messages(with_categories=true) %}
            {% if messages %}
                {% for category, message in messages %}
                    <div class="alert alert-{{ category }}">{{ message }}</div>
                {% endfor %}
            {% endif %}
        {% endwith %}
        
        <form method="post" enctype="multipart/form-data">
            <div class="form-row">
                <div class="form-group">
                    <label for="name">设备名称</label>
                    <select id="name" name="name">
                        <option value="">-- 请选择设备 --</option>
                        <option value="暖箱">暖箱</option>
                        <option value="长颈鹿多功能暖箱">长颈鹿多功能暖箱</option>
                        <option value="辐射台">辐射台</option>
                        <option value="菲萍呼吸机">菲萍呼吸机</option>
                        <option value="SLE呼吸机">SLE呼吸机</option>
                        <option value="千禧呼吸机">千禧呼吸机</option>
                        <option value="E360呼吸机">E360呼吸机</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="number">设备编号</label>
                    <input type="text" id="number" name="number">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="use_date">使用日期</label>
                    <input type="date" id="use_date" name="use_date">
                </div>
                
                <div class="form-group">
                    <label for="status">运行状态</label>
                    <select id="status" name="status">
                        <option value="正常运行">正常运行</option>
                        <option value="故障">故障</option>
                        <option value="空闲">空闲</option>
                    </select>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="user">使用人</label>
                    <input type="text" id="user" name="user">
                </div>
                
                <div class="form-group">
                    <label for="bed">床号</label>
                    <input type="text" id="bed" name="bed">
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="person_name">患儿姓名</label>
                    <input type="text" id="person_name" name="person_name">
                </div>
                
                <div class="form-group">
                    <label for="patient_id">住院号</label>
                    <div class="patient-id-container">
                        <span class="patient-id-prefix">P000</span>
                        <input type="text" id="patient_id" name="patient_id" 
                               title="请输入6位数字住院号（可选）">
                    </div>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="end_date">结束日期</label>
                    <input type="date" id="end_date" name="end_date">
                </div>
                
                <div class="form-group">
                    <label for="disinfect_date">终末消毒日期</label>
                    <input type="date" id="disinfect_date" name="disinfect_date">
                </div>
            </div>
            
            <div class="form-group">
                <label for="disinfector">消毒人</label>
                <input type="text" id="disinfector" name="disinfector">
            </div>
            
            <div class="form-group">
                <label for="notes">备注</label>
                <input type="text" id="notes" name="notes" placeholder="可填写特殊情况说明">
            </div>
            
            <button type="submit" class="btn btn-block">提交信息</button>
        </form>
        
        <div style="margin-top: 30px; text-align: center;">
            <a href="/data" class="btn">查看</a>
        </div>
    </div>
</body>
</html>
"""

DATA_VIEW_HTML = """
<!doctype html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>设备数据查看</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
            margin: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin-bottom: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            position: sticky;
            top: 0;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .actions {
            margin-top: 20px;
            text-align: center;
        }
        .btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #4285f4;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 0 5px;
        }
        .btn:hover {
            background-color: #3367d6;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>设备使用记录</h1>
        <div class="table-container" style="max-height: 600px; overflow-y: auto;">
            {{ table_html|safe }}
        </div>
        <div class="actions">
            <a href="/" class="btn">返回表单</a>
            <a href="/search" class="btn">高级查询</a>
        </div>
    </div>
</body>
</html>
"""

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def ensure_data_file():
    """Ensure the CSV file exists with correct headers"""
    if not os.path.isfile(CSV_FILE):
        with open(CSV_FILE, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                '设备名称', '设备编号', '使用日期', '运行状态', '使用人', 
                '床号', '患儿姓名', '住院号', '结束日期', '终末消毒日期', 
                '消毒人', '备注', '记录时间'
            ])

def read_equipment_data():
    """Read all equipment data from CSV"""
    ensure_data_file()
    with open(CSV_FILE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        return list(reader)

def save_data(data):
    """保存数据到CSV"""
    ensure_data_file()
    with open(CSV_FILE, 'a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            data.get('name', ''),
            data.get('number', ''),
            data.get('use_date', ''),
            data.get('status', ''),
            data.get('user', ''),
            data.get('bed', ''),
            data.get('person_name', ''),
            f"P000{data.get('patient_id', '')}",
            data.get('end_date', ''),
            data.get('disinfect_date', ''),
            data.get('disinfector', ''),
            data.get('notes', ''),
            datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        ])

@app.route('/', methods=['GET', 'POST'])
def index():
    # 确保数据文件存在
    ensure_data_file()
    if request.method == 'POST':
        data = {
            'name': request.form.get('name', ''),
            'number': request.form.get('number', ''),
            'use_date': request.form.get('use_date', ''),
            'status': request.form.get('status', ''),
            'user': request.form.get('user', ''),
            'bed': request.form.get('bed', ''),
            'person_name': request.form.get('person_name', ''),
            'patient_id': request.form.get('patient_id', ''),
            'end_date': request.form.get('end_date', ''),
            'disinfect_date': request.form.get('disinfect_date', ''),
            'disinfector': request.form.get('disinfector', ''),
            'notes': request.form.get('notes', '')
        }
        
        # 验证必填字段（仅设备名称和设备编号）
        if not data['name'] or not data['number']:
            flash('设备名称和设备编号是必填项!', 'error')
            return redirect('/')
        
        # 验证住院号格式（如果填写了住院号）
        if data['patient_id'] and (not data['patient_id'].isdigit() or len(data['patient_id']) != 6):
            flash('住院号必须为6位数字!', 'error')
            return redirect('/')
        save_data(data)
        flash('设备信息已成功提交!', 'success')
        return redirect('/')
    return render_template_string(FORM_HTML)

@app.route('/data')
def view_data():
    try:
        data = read_equipment_data()
        # 获取查询参数并验证
        name = request.args.get('name', '').strip()
        number = request.args.get('number', '').strip()
        
        if not name or not number:
            flash('请提供设备名称和编号!', 'error')
            return redirect('/')
            
        # 仅显示与本次填写的设备名称和编号相同的数据
        filtered = [row for row in data if (row.get('设备名称', '') == name and row.get('设备编号', '') == number)]
        if not filtered:
            return render_template_string(DATA_VIEW_HTML, table_html="<p>暂无数据</p>")
            
        # 生成表格
        table_html = '<table><thead><tr>'
        for header in filtered[0].keys():
            table_html += f'<th>{header}</th>'
        table_html += '</tr></thead><tbody>'
        
        for row in filtered:
            table_html += '<tr>'
            for value in row.values():
                table_html += f'<td>{value}</td>'
            table_html += '</tr>'
            
        table_html += '</tbody></table>'
        return render_template_string(DATA_VIEW_HTML, table_html=table_html)
        
    except Exception as e:
        flash(f'读取数据失败: {str(e)}', 'error')
        return redirect('/')

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--port', type=int, default=5000)
    args = parser.parse_args()
    
    ensure_data_file()
    app.run(host='0.0.0.0', port=args.port, debug=True)
