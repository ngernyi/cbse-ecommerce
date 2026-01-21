package com.ecommerce.backend.repository;

import com.ecommerce.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContaining(String name);

    List<Product> findByNameContainingOrDescriptionContaining(String name, String description,
            org.springframework.data.domain.Sort sort);

    List<Product> findByCategoriesId(Long categoryId, org.springframework.data.domain.Sort sort);

    List<Product> findDistinctByCategoriesIdIn(java.util.List<Long> categoryIds);
}
