"""
时空伴随者追踪系统框架设计

1. 数据模型设计
- patients.csv (患者信息表)
  id,name,phone,infected,infection_date,location_history_file

- location_history.csv (位置历史记录)
  patient_id,start_time,end_time,latitude,longitude,location_code

- contacts.csv (接触关系表)
  source_patient_id,contact_patient_id,contact_start,contact_end,risk_level

2. 核心功能模块
- 患者信息管理
  - 添加/编辑患者信息
  - 标记感染状态
  - 录入位置历史

- 时空匹配算法
  - 基于时间和空间的重叠检测
  - 风险等级计算

- 接触者追踪
  - 自动识别时空伴随者
  - 风险等级标记

- 数据可视化
  - 感染传播链展示
  - 热力图展示

3. 需要实现的主要接口
- /patient/add - 添加患者
- /patient/{id}/locations - 添加位置历史
- /patient/{id}/mark-infected - 标记为感染者
- /contact/search - 查找接触者
- /contact/visualize - 可视化展示

4. 时空匹配算法逻辑
def find_contacts(infected_patient, days_before=14):
    # 获取感染者过去14天的位置历史
    infected_locations = get_locations(infected_patient, days_before)
    
    contacts = []
    for loc in infected_locations:
        # 查找同一时间段出现在同一区域的其他患者
        overlapping = find_overlapping_patients(
            loc['start_time'],
            loc['end_time'],
            loc['location_code']
        )
        
        for patient in overlapping:
            if patient != infected_patient:
                # 计算接触时长和风险等级
                duration = calculate_overlap_duration(...)
                risk = calculate_risk_level(duration, loc['type'])
                
                contacts.append({
                    'patient': patient,
                    'start_time': ...,
                    'end_time': ...,
                    'risk_level': risk
                })
    
    return contacts
"""
