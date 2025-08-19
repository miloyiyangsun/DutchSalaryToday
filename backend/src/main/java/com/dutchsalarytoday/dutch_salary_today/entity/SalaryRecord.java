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
                '}';
    }
}