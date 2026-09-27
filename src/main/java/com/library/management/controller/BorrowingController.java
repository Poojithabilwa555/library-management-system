package com.library.management.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.library.management.entity.Borrowing;
import com.library.management.service.BorrowingService;

@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    // Borrow book
    // Example:
    // POST /api/borrowings?bookId=2&memberId=2
    @PostMapping
    public ResponseEntity<Borrowing> addBorrowing(
            @RequestParam Long bookId,
            @RequestParam Long memberId) {

        return ResponseEntity.ok(
                borrowingService.addBorrowing(bookId, memberId)
        );
    }

    // Get all borrowings
    @GetMapping
    public ResponseEntity<List<Borrowing>> getAllBorrowings() {

        return ResponseEntity.ok(
                borrowingService.getAllBorrowings()
        );
    }

    // Get borrowing by ID
    @GetMapping("/{id}")
    public ResponseEntity<Borrowing> getBorrowingById(
            @PathVariable Long id) {

        return borrowingService.getBorrowingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Return book
    // Example:
    // PUT /api/borrowings/1?returned=true
    @PutMapping("/{id}")
    public ResponseEntity<Borrowing> updateBorrowing(
            @PathVariable Long id,
            @RequestParam boolean returned) {

        return ResponseEntity.ok(
                borrowingService.updateBorrowing(id, returned)
        );
    }

    // Delete borrowing
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBorrowing(
            @PathVariable Long id) {

        borrowingService.deleteBorrowing(id);

        return ResponseEntity.noContent().build();
    }
}
