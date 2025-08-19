package com.dutchsalarytoday.dutch_salary_today.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

/**
 * JPA实体类 - 荷兰薪资记录
 * 映射PostgreSQL的salary_records表，专注于wages_per_fte_9字段的业务处理
 */
@Entity
@Table(name = "salary_records")
public class SalaryRecord {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    // 核心业务字段 - 必须字段
    @Column(name = "year_period", nullable = false)
    private Integer yearPeriod;
    
    @Column(name = "title", nullable = false)
    private String title;
    
    // 关键薪资字段 - wages_per_fte_9 (工资和薪金每FTE，千欧元)
    @Column(name = "wages_per_fte_9")
    private BigDecimal wagesPerFte;
    
    // 工时分析专用字段 - Story 2
    @Column(name = "hours_worked_21")
    private BigDecimal hoursWorked; // 工作小时数(百万小时)
    
    @Column(name = "full_time_equivalent_fte_20") 
    private BigDecimal fullTimeEquivalentFte; // 全职等价人数(千人)
    
    @Column(name = "compensation_per_hour_worked_11")
    private BigDecimal compensationPerHourWorked; // 每小时薪酬(欧元)
    
    // 性别统计字段 - Story 3: Gender Power Rise
    @Column(name = "male_28")
    private BigDecimal male; // 男性数量(千人)
    
    @Column(name = "female_29") 
    private BigDecimal female; // 女性数量(千人)
    
    @Column(name = "total_27")
    private BigDecimal total; // 总计数量(千人)
    
    // 故事5: 隐形人力成本分析字段 - Hidden Labor Costs
    @Column(name = "compensation_of_employees_1")
    private BigDecimal compensationOfEmployees; // 员工薪酬总额(百万欧元)
    
    @Column(name = "wages_and_salaries_2")
    private BigDecimal wagesAndSalaries; // 工资薪金总额(百万欧元)
    
    @Column(name = "employers_social_contributions_3")
    private BigDecimal employersSocialContributions; // 雇主社保支出(百万欧元)
    
    // 辅助字段
    @Column(name = "description")
    private String description;
    
    @Column(name = "sector_code")
    private String sectorCode;
    
    // 默认构造函数 (JPA要求)
    public SalaryRecord() {}
    
    // 业务构造函数
    public SalaryRecord(Integer yearPeriod, String title, BigDecimal wagesPerFte) {
        this.yearPeriod = yearPeriod;
        this.title = title;
        this.wagesPerFte = wagesPerFte;
    }
    
    // Getter和Setter方法
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Integer getYearPeriod() {
        return yearPeriod;
    }
    
    public void setYearPeriod(Integer yearPeriod) {
        this.yearPeriod = yearPeriod;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public BigDecimal getWagesPerFte() {
        return wagesPerFte;
    }
    
    public void setWagesPerFte(BigDecimal wagesPerFte) {
        this.wagesPerFte = wagesPerFte;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getSectorCode() {
        return sectorCode;
    }
    
    public void setSectorCode(String sectorCode) {
        this.sectorCode = sectorCode;
    }
    
    // 工时分析字段的getter和setter
    public BigDecimal getHoursWorked() {
        return hoursWorked;
    }
    
    public void setHoursWorked(BigDecimal hoursWorked) {
        this.hoursWorked = hoursWorked;
    }
    
    public BigDecimal getFullTimeEquivalentFte() {
        return fullTimeEquivalentFte;
    }
    
    public void setFullTimeEquivalentFte(BigDecimal fullTimeEquivalentFte) {
        this.fullTimeEquivalentFte = fullTimeEquivalentFte;
    }
    
    public BigDecimal getCompensationPerHourWorked() {
        return compensationPerHourWorked;
    }
    
    public void setCompensationPerHourWorked(BigDecimal compensationPerHourWorked) {
        this.compensationPerHourWorked = compensationPerHourWorked;
    }
    
    // 性别统计字段的getter和setter方法 - Story 3
    public BigDecimal getMale() {
        return male;
    }
    
    public void setMale(BigDecimal male) {
        this.male = male;
    }
    
    public BigDecimal getFemale() {
        return female;
    }
    
    public void setFemale(BigDecimal female) {
        this.female = female;
    }
    
    public BigDecimal getTotal() {
        return total;
    }
    
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    // 隐形成本字段的getter和setter方法 - Story 5
    public BigDecimal getCompensationOfEmployees() {
        return compensationOfEmployees;
    }
    
    public void setCompensationOfEmployees(BigDecimal compensationOfEmployees) {
        this.compensationOfEmployees = compensationOfEmployees;
    }
    
    public BigDecimal getWagesAndSalaries() {
        return wagesAndSalaries;
    }
    
    public void setWagesAndSalaries(BigDecimal wagesAndSalaries) {
        this.wagesAndSalaries = wagesAndSalaries;
    }
    
    public BigDecimal getEmployersSocialContributions() {
        return employersSocialContributions;
    }
    
    public void setEmployersSocialContributions(BigDecimal employersSocialContributions) {
        this.employersSocialContributions = employersSocialContributions;
    }
    
    @Override
    public String toString() {
        return "SalaryRecord{" +
                "id=" + id +
                ", yearPeriod=" + yearPeriod +
                ", title='" + title + '\'' +
                ", wagesPerFte=" + wagesPerFte +
                ", hoursWorked=" + hoursWorked +
                ", fullTimeEquivalentFte=" + fullTimeEquivalentFte +
                ", compensationPerHourWorked=" + compensationPerHourWorked +
                ", male=" + male +
                ", female=" + female +
                ", total=" + total +
                ", compensationOfEmployees=" + compensationOfEmployees +
                ", wagesAndSalaries=" + wagesAndSalaries +
                ", employersSocialContributions=" + employersSocialContributions +
                '}';
    }
}