package com.library.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.management.entity.Borrowing;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {
}
