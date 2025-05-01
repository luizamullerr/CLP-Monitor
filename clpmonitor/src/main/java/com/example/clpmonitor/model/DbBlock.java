package com.example.clpmonitor.model;


import jakarta.persistence.*;

@Entity
@Table(name = "db_block")
public class DbBlock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "position", nullable = false)
    private Short position;

    @Column(name = "color", nullable = false)
    private Short color;

    @Column(name = "storageId", nullable = false)
    private Short storageId;

    @Column(name = "productionOrder", nullable = true)
    private Short productionOrder;

    public Long getId()
    {
        return id;
    }

    public void setId(Long id)
    {
        this.id = id;
    }

    public Short getPosition()
    {
        return position;
    }

    public void setPosition(Short position)
    {
        this.position = position;
    }

    public Short getColor()
    {
        return color;
    }

    public void setColor(Short color)
    {
        this.color = color;
    }

    public Short getStorageId()
    {
        return storageId;
    }

    public void setStorageId(Short storageId)
    {
        this.storageId = storageId;
    }

    public Short getProductionOrder()
    {
        return productionOrder;
    }

    public void setProductionOrder(Short productionOrder)
    {
        this.productionOrder = productionOrder;
    }

}
