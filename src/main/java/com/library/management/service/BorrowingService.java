package com.library.management.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.library.management.entity.Book;
import com.library.management.entity.Borrowing;
import com.library.management.entity.Member;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowingRepository;
import com.library.management.repository.MemberRepository;

@Service
public class BorrowingService {

    private final BorrowingRepository borrowingRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;

    public BorrowingService(
            BorrowingRepository borrowingRepository,
            BookRepository bookRepository,
            MemberRepository memberRepository) {

        this.borrowingRepository = borrowingRepository;
        this.bookRepository = bookRepository;
        this.memberRepository = memberRepository;
    }

    // Borrow a book
    public Borrowing addBorrowing(Long bookId, Long memberId) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(()
                        -> new RuntimeException(
                        "Book not found with id: " + bookId));

        Member member = memberRepository.findById(memberId)
                .orElseThrow(()
                        -> new RuntimeException(
                        "Member not found with id: " + memberId));

        if (book.getAvailableCopies() <= 0) {
            throw new RuntimeException(
                    "No available copies of this book");
        }

        // Decrease available copies
        book.setAvailableCopies(
                book.getAvailableCopies() - 1
        );

        bookRepository.save(book);

        // Create borrowing record
        Borrowing borrowing = new Borrowing();

        borrowing.setBook(book);
        borrowing.setMember(member);
        borrowing.setBorrowDate(LocalDate.now());
        borrowing.setReturned(false);

        return borrowingRepository.save(borrowing);
    }

    // Get all borrowings
    public List<Borrowing> getAllBorrowings() {
        return borrowingRepository.findAll();
    }

    // Get borrowing by ID
    public Optional<Borrowing> getBorrowingById(Long id) {
        return borrowingRepository.findById(id);
    }

    // Return a book
    public Borrowing updateBorrowing(
            Long id,
            boolean returned) {

        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException(
                        "Borrowing not found with id: " + id));

        // Only process the return once
        if (returned && !borrowing.isReturned()) {

            Book book = borrowing.getBook();

            int currentAvailable = book.getAvailableCopies();
            int totalCopies = book.getTotalCopies();

            // Prevent available copies from exceeding total copies
            if (currentAvailable < totalCopies) {
                book.setAvailableCopies(
                        currentAvailable + 1
                );
            }

            bookRepository.save(book);

            borrowing.setReturned(true);
            borrowing.setReturnDate(LocalDate.now());
        }

        return borrowingRepository.save(borrowing);
    }

    // Delete borrowing
    public void deleteBorrowing(Long id) {

        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(()
                        -> new RuntimeException(
                        "Borrowing not found with id: " + id));

        // If the borrowing is still active,
        // restore the book's available copy
        if (!borrowing.isReturned()) {

            Book book = borrowing.getBook();

            if (book.getAvailableCopies() < book.getTotalCopies()) {

                book.setAvailableCopies(
                        book.getAvailableCopies() + 1
                );

                bookRepository.save(book);
            }
        }

        borrowingRepository.delete(borrowing);
    }
}
