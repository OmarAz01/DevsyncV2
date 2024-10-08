package com.devsync.v2.repo;

import com.devsync.v2.entity.ProfileDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileDetailsRepo extends JpaRepository<ProfileDetailsEntity, Long> {


}
