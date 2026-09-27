package com.library.management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.management.entity.Member;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
