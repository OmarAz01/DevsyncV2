package com.devsync.v2.repo;

import com.devsync.v2.entity.ProfileDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileDetailsRepo extends JpaRepository<ProfileDetails, Long> {


}
